package com.meet.server.features.snippet.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.security.user.CustomUserPrincipal;
import com.meet.server.features.snippet.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<String>>> getTags(
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(
                ApiResponse.ok("Fetched Tags Successfully", tagService.getUserTags(principal.user()))
        );
    }
}
