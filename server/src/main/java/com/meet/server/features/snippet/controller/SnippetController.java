package com.meet.server.features.snippet.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.api.PageResponse;
import com.meet.server.common.security.user.CustomUserPrincipal;
import com.meet.server.features.snippet.dto.*;
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SnippetDetailResponse>> getSnippet(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var snippet = snippetService.getSnippet(Long.parseLong(id), principal.user());
        return ResponseEntity.ok(
                ApiResponse.ok("Snippet Fetched Successfully", snippet)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SnippetResponse>>> getSnippets(
            @ModelAttribute SnippetFilterRequest filterRequest,
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PageableDefault(
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Snippets fetched successfully",
                        snippetService.getSnippets(filterRequest, principal.user(), pageable)
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SnippetResponse>> createSnippet(
            @Valid @RequestBody CreateSnippetRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var response = snippetService.createSnippet(request, principal.user());
        return ResponseEntity.created(URI.create("/api/snippets/" + response.id()))
                .body(ApiResponse.ok("Snippet Created Successfully", response));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SnippetResponse>> updateSnippet(
            @PathVariable String id,
            @Valid @RequestBody UpdateSnippetRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var response = snippetService.updateSnippet(id, request, principal.user());
        return ResponseEntity.ok(ApiResponse.ok("Snippet Updated Successfully", response));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSnippet(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        snippetService.deleteSnippet(id, principal.user());
        return ResponseEntity.ok(ApiResponse.ok("Snippet Deleted Successfully", null));
    }

    @PatchMapping("/{id}/favourite")
    public ResponseEntity<ApiResponse<FavouriteResponse>> toggleFavourite(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Favourite status updated successfully", snippetService.toggleFavourite(id, principal.user())));
    }
}
