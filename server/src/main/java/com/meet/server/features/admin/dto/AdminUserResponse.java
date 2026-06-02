package com.meet.server.features.admin.dto;

public record AdminUserResponse(
        Long id,
        String name,
        String email
) {
}
