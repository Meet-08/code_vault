package com.meet.server.features.dashboard.service;

import com.meet.server.features.dashboard.dto.DashboardStatResponse;
import com.meet.server.features.snippet.service.CollectionService;
import com.meet.server.features.snippet.service.SnippetService;
import com.meet.server.features.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SnippetService snippetService;
    private final CollectionService collectionService;

    public DashboardStatResponse getDashboardStats(User user) {
        return DashboardStatResponse.builder()
                .recentSnippets(snippetService.recentSnippets(user))
                .totalSnippets(snippetService.getSnippetCount(user))
                .favouriteCount(snippetService.getFavouriteCount(user))
                .byLanguage(snippetService.getLanguageCounts(user))
                .totalCollections(collectionService.getCollectionCount(user))
                .build();
    }

}
