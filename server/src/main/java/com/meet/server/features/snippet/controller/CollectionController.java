package com.meet.server.features.snippet.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.security.user.CustomUserPrincipal;
import com.meet.server.features.snippet.dto.CollectionResponse;
import com.meet.server.features.snippet.dto.CreateCollectionRequest;
import com.meet.server.features.snippet.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getCollections(
            @RequestParam(required = false) String q,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var collections = collectionService.getCollections(q, principal.user());
        return ResponseEntity.ok(
                ApiResponse.ok("Fetched All collection", collections)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CollectionResponse>> createCollection(
            @Valid @RequestBody CreateCollectionRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        var collection = collectionService.createCollection(request, principal.user());
        return ResponseEntity.ok(
                ApiResponse.ok("Collection Created Successfully", collection)
        );
    }
}
