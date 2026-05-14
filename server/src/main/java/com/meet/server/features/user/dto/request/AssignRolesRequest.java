package com.meet.server.features.user.dto.request;

import com.meet.server.features.user.enums.UserRole;

import java.util.List;

public record AssignRolesRequest(
        List<UserRole> roles
) {
}
