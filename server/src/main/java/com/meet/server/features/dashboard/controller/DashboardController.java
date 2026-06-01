package com.meet.server.features.dashboard.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.security.user.CustomUserPrincipal;
import com.meet.server.features.dashboard.dto.DashboardStatResponse;
import com.meet.server.features.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("stats")
    public ResponseEntity<ApiResponse<DashboardStatResponse>> getDashboard(
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var data = dashboardService.getDashboardStats(principal.user());
        return ResponseEntity.ok(
                ApiResponse.ok("Dashboard Data Fetched Successfully", data)
        );
    }
}
