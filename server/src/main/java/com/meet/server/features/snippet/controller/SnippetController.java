package com.meet.server.features.snippet.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.api.PageResponse;
import com.meet.server.common.security.user.CustomUserPrincipal;
import com.meet.server.features.snippet.dto.CreateSnippetRequest;
import com.meet.server.features.snippet.dto.SnippetDto;
import com.meet.server.features.snippet.dto.SnippetFilterRequest;
import com.meet.server.features.snippet.service.SnippetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/snippets")
@RequiredArgsConstructor
public class SnippetController {

    private final SnippetService snippetService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SnippetDto>>> getSnippets(
            @ModelAttribute SnippetFilterRequest filterRequest,
            @PageableDefault(
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                ApiResponse.ok("Snippets fetched successfully", snippetService.getSnippets(filterRequest, pageable))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SnippetDto>> createSnippet(
            @Valid @RequestBody CreateSnippetRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var response = snippetService.createSnippet(request, principal.user());
        return ResponseEntity.created(URI.create("/api/snippets/" + response.id()))
                .body(ApiResponse.ok("Snippet Created Successfully", response));
    }

}
