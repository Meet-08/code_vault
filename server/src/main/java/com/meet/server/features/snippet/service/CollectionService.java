package com.meet.server.features.snippet.service;

import com.meet.server.features.snippet.dto.CollectionDetailResponse;
import com.meet.server.features.snippet.dto.CollectionResponse;
import com.meet.server.features.snippet.dto.CreateCollectionRequest;
import com.meet.server.features.snippet.exception.CollectionException;
import com.meet.server.features.snippet.mapper.CollectionMapper;
import com.meet.server.features.snippet.mapper.SnippetMapper;
import com.meet.server.features.snippet.model.Collection;
import com.meet.server.features.snippet.repository.CollectionRepository;
import com.meet.server.features.snippet.specification.CollectionSpecification;
import com.meet.server.features.user.model.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CollectionService {

    private static final Logger log = LoggerFactory.getLogger(CollectionService.class);
    private final CollectionRepository collectionRepository;
    private final SnippetService snippetService;

    @Transactional
    public CollectionResponse createCollection(CreateCollectionRequest request, User createdBy) {
        Collection collection = new Collection();
        collection.setName(request.name());
        collection.setDescription(request.description());
        collection.setCreatedBy(createdBy);
        var snippets =
                new HashSet<>(snippetService.findAllByIds(request.snippetsIds()));

        if (snippets.size() != request.snippetsIds().size()) {
            throw new IllegalArgumentException("Some snippets do not exist");
        }

        snippets.forEach(collection::addSnippet);

        collectionRepository.save(collection);
        return CollectionMapper.toResponse(collection, (long) request.snippetsIds().size());
    }

    public List<CollectionResponse> getCollections(String q, User createdBy) {
        log.debug("Get collections: q={}, createdBy={}", q, createdBy.getId());
        var specs = Specification.allOf(
                CollectionSpecification.isCreatedBy(createdBy),
                CollectionSpecification.contains(q)
        );

        var collections = collectionRepository.findAll(specs);
        return collections.stream()
                .map(c -> CollectionMapper.toResponse(c, getSnippetCount(c.getId())))
                .toList();
    }

    public CollectionDetailResponse getCollection(Long id, User createdBy) {
        var collection = collectionRepository.findById(id).orElseThrow(
                () -> new CollectionException("Collection Not Fount", HttpStatus.NOT_FOUND)
        );

        if (!Objects.equals(collection.getCreatedBy().getId(), createdBy.getId()))
            throw new CollectionException("Unauthorized Access Denied", HttpStatus.FORBIDDEN);

        var snippetsResponse = collection.getSnippets().stream()
                .map(SnippetMapper::toDto)
                .toList();

        return CollectionMapper.toDetailResponse(collection, snippetsResponse);
    }

    @Transactional
    public CollectionDetailResponse addSnippetsToCollection(Long id, List<Long> snippetIds) {
        var collection = collectionRepository.findById(id).orElseThrow(
                () -> new CollectionException("Collection Not Fount", HttpStatus.NOT_FOUND)
        );

        var snippets = snippetService.findAllByIds(snippetIds);

        if (snippets.size() != snippetIds.size()) {
            throw new IllegalArgumentException("Some snippets do not exist");
        }

        snippets.forEach(collection::addSnippet);

        var snippetResponses = collection.getSnippets().stream()
                .map(SnippetMapper::toDto)
                .toList();

        return CollectionMapper.toDetailResponse(collection, snippetResponses);
    }

    @Transactional
    public void removeSnippetsFromCollection(Long id, List<Long> snippetIds) {
        var collection = collectionRepository.findById(id).orElseThrow(
                () -> new CollectionException("Collection Not Fount", HttpStatus.NOT_FOUND)
        );

        var snippets = snippetService.findAllByIds(snippetIds);

        if (snippets.size() != snippetIds.size()) {
            throw new IllegalArgumentException("Some snippets do not exist");
        }

        snippets.forEach(snippet -> snippet.removeCollection(collection));
    }

    private Long getSnippetCount(Long id) {
        return collectionRepository.countSnippetsById(id);
    }

    public Long getCollectionCount(User createdBy) {
        var spec = Specification.allOf(CollectionSpecification.isCreatedBy(createdBy));
        return collectionRepository.count(spec);
    }
}
