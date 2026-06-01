package com.meet.server.features.dashboard.dto;

import com.meet.server.features.snippet.dto.SnippetResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record DashboardStatResponse(
        List<SnippetResponse> recentSnippets,
        Long totalSnippets,
        Long favouriteCount,
        Long totalCollections,
        List<LanguageCount> byLanguage
) {
}