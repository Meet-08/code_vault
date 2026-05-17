package com.meet.server.features.user.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.features.user.dto.request.AssignRolesRequest;
import com.meet.server.features.user.dto.response.UserResponse;
import com.meet.server.features.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return ResponseEntity.ok(ApiResponse.ok("Current user fetched successfully", userService.getCurrentUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<ApiResponse<UserResponse>> assignRoles(
            @PathVariable Long id,
            @RequestBody @Valid AssignRolesRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Roles assigned successfully", userService.assignRoles(id, request)));
    }
}
