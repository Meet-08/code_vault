package com.meet.server.features.admin.service;

import com.meet.server.common.api.PageResponse;
import com.meet.server.features.admin.dto.AdminDashboardStats;
import com.meet.server.features.admin.dto.AdminUserResponse;
import com.meet.server.features.snippet.service.CollectionService;
import com.meet.server.features.snippet.service.SnippetService;
import com.meet.server.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserService userService;
    private final SnippetService snippetService;
    private final CollectionService collectionService;

    @Cacheable(value = "admin-dashboard")
    public AdminDashboardStats getAdminDashboardStats() {
        return AdminDashboardStats.builder()
                .userCount(userService.countUsers())
                .snippetsCount(snippetService.getTotalSnippetCount())
                .collectionCount(collectionService.getTotalCollectionCount())
                .build();
    }

    public PageResponse<AdminUserResponse> getAdminUsers(String q, Pageable pageable) {
        return userService.getUsers(q, pageable);
    }
}
