package com.meet.server.features.admin.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.api.PageResponse;
import com.meet.server.features.admin.dto.AdminDashboardStats;
import com.meet.server.features.admin.dto.AdminUserResponse;
import com.meet.server.features.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getAdminDashboardStats() {
        var adminDashboardStats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin Dashboard Stats", adminDashboardStats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserResponse>>> getAdminUsers(
            @RequestParam(required = false) String q,
            @PageableDefault(
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Admin Users", adminService.getAdminUsers(q, pageable)));
    }
}
