package com.meet.server.features.snippet.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SnippetIdsRequest(
        @NotNull
        List<Long> snippetIds
) {
}
