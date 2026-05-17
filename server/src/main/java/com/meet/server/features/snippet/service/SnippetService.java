package com.meet.server.features.snippet.service;

import com.meet.server.common.api.PageResponse;
import com.meet.server.features.snippet.dto.CreateSnippetRequest;
import com.meet.server.features.snippet.dto.SnippetDto;
import com.meet.server.features.snippet.dto.SnippetFilterRequest;
import com.meet.server.features.snippet.mapper.SnippetMapper;
import com.meet.server.features.snippet.model.Tag;
import com.meet.server.features.snippet.repository.SnippetRepository;
import com.meet.server.features.snippet.specification.SnippetSpecification;
import com.meet.server.features.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    public SnippetDto createSnippet(CreateSnippetRequest request, User user) {
        Set<Tag> tags = request.tags()
                .stream()
                .map(tagService::findOrCreate)
                .collect(Collectors.toSet());

        var snippet = SnippetMapper.toEntity(request, user);

        tags.forEach(snippet::addTag);

        snippetRepository.save(snippet);
        return SnippetMapper.toDto(snippet);
    }

    public PageResponse<SnippetDto> getSnippets(
            SnippetFilterRequest request,
            Pageable pageable
    ) {
        var spec = Specification.allOf(
                SnippetSpecification.isNotDeleted(),
                Specification.anyOf(
                        SnippetSpecification.containsQuery(request.q()),
                        SnippetSpecification.hasLanguage(request.language()),
                        SnippetSpecification.hasTags(request.tags())
                )
        );

        var page = snippetRepository.findAll(spec, pageable);
        return new PageResponse<>(
                page.getContent().stream().map(SnippetMapper::toDto).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
