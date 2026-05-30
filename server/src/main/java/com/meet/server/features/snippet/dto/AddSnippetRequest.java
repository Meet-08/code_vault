package com.meet.server.features.snippet.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AddSnippetRequest(
        @NotNull
        List<Long> snippetIds
) {
}
