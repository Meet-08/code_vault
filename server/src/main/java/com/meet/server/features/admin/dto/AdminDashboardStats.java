package com.meet.server.features.admin.dto;

import lombok.Builder;

@Builder
public record AdminDashboardStats(
        Long userCount,
        Long snippetsCount,
        Long collectionCount
) {
}
