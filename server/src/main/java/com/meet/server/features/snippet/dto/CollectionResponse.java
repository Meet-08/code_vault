package com.meet.server.features.snippet.dto;

import lombok.Builder;

@Builder
public record CollectionResponse(
        Long id,
        String name,
        String description,
        Long snippetCount
) {
}
