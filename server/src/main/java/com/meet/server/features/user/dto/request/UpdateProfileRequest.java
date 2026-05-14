package com.meet.server.features.user.dto.request;

public record UpdateProfileRequest(
        String name,
        String email
) {
}
