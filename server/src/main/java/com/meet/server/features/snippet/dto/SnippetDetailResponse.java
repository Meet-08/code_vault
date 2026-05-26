package com.meet.server.features.snippet.dto;

import java.util.List;

public record SnippetDetailResponse(
        Long id,
        String title,
        String language,
        String code,
        String description,
        List<String> tags,
        Boolean isFavourite,
        String createdAt
) {
}
