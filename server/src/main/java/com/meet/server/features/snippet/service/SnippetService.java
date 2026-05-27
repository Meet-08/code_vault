package com.meet.server.features.snippet.service;

import com.meet.server.common.api.PageResponse;
import com.meet.server.features.snippet.dto.*;
import com.meet.server.features.snippet.exception.SnippetException;
import com.meet.server.features.snippet.mapper.SnippetMapper;
import com.meet.server.features.snippet.model.Snippet;
import com.meet.server.features.snippet.model.Tag;
import com.meet.server.features.snippet.repository.SnippetRepository;
import com.meet.server.features.snippet.specification.SnippetSpecification;
import com.meet.server.features.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SnippetService {

    private final SnippetRepository snippetRepository;
    private final TagService tagService;

    @Transactional
    public SnippetResponse createSnippet(CreateSnippetRequest request, User user) {
        log.debug("Create snippet request: title: {} desc : {}",
                request.title(),
                request.description()
        );
        Set<Tag> tags = request.tags()
                .stream()
                .map(tagService::findOrCreate)
                .collect(Collectors.toSet());

        var snippet = SnippetMapper.toEntity(request, user);

        tags.forEach(snippet::addTag);

        snippetRepository.save(snippet);

        log.debug(
                "Snippet created: title={}",
                snippet.getTitle()
        );
        return SnippetMapper.toDto(snippet);
    }

    public PageResponse<SnippetResponse> getSnippets(
            SnippetFilterRequest request,
            User user,
            Pageable pageable
    ) {
        log.debug("Get snippets request: {}", request);
        var spec = Specification.allOf(
                SnippetSpecification.isNotDeleted(),
                SnippetSpecification.hasUser(user),
                Specification.anyOf(
                        SnippetSpecification.containsQuery(request.q()),
                        SnippetSpecification.hasLanguage(request.language()),
                        SnippetSpecification.hasTags(request.tags())
                )
        );
        var page = snippetRepository.findAll(spec, pageable);
        log.debug("Snippets found: {}", page.getNumberOfElements());

        return new PageResponse<>(
                page.getContent().stream().map(SnippetMapper::toDto).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    public SnippetDetailResponse getSnippet(Long snippetId, User user) {
        log.debug("Get snippet: id={}", snippetId);
        return SnippetMapper.toDetailsDto(findActiveSnippet(snippetId, user));
    }

    @Transactional
    public SnippetResponse updateSnippet(String id, UpdateSnippetRequest request, User user) {
        Snippet existing = findActiveSnippet(Long.parseLong(id), user);
        log.debug("Update snippet: id={}, title={}", id, existing.getTitle());
        if (request.title() != null) existing.setTitle(request.title());
        if (request.description() != null) existing.setDescription(request.description());
        if (request.language() != null) existing.setLanguage(request.language());
        if (request.code() != null) existing.setCode(request.code());
        if (request.tags() != null) {
            Set<Tag> newTags = request.tags()
                    .stream()
                    .map(tagService::findOrCreate)
                    .collect(Collectors.toSet());

            existing.replaceTags(newTags);
        }
        log.debug("Snippet updated: id={}, title={}", existing.getId(), existing.getTitle());
        return SnippetMapper.toDto(existing);
    }

    @Transactional
    public FavouriteResponse toggleFavourite(String id, User user) {
        Snippet snippet = findActiveSnippet(Long.parseLong(id), user);
        snippet.setFavorite(!snippet.isFavorite());
        return new FavouriteResponse(snippet.getId(), snippet.isFavorite());
    }

    private Snippet findActiveSnippet(Long snippetId, User user) {
        var snippet = snippetRepository
                .findByIdAndCreatedBy(snippetId, user)
                .orElseThrow(() -> new SnippetException("Snippet not found", HttpStatus.NOT_FOUND));

        if (snippet.isDeleted())
            throw new SnippetException("Snippet has been deleted", HttpStatus.FORBIDDEN);

        return snippet;
    }
}
