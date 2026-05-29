package com.meet.server.features.snippet.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record CollectionDetailResponse(
        Long id,
        String name,
        String description,
        List<SnippetResponse> snippets
) {
}
