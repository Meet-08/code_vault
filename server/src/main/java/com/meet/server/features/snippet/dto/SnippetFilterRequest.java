package com.meet.server.features.snippet.dto;

import java.util.List;

public record SnippetFilterRequest(
        String q,
        List<String> tags,
        String language,
        Boolean isFavourite
) {
}