package com.meet.server.features.snippet.dto;

import java.util.List;

public record SnippetResponse(
        Long id,
        String title,
        String language,
        String description,
        List<String> tags,
        Boolean isFavourite,
        String createdAt
) {
}
