package com.meet.server.features.snippet.mapper;

import com.meet.server.features.snippet.dto.CollectionDetailResponse;
import com.meet.server.features.snippet.dto.CollectionResponse;
import com.meet.server.features.snippet.dto.SnippetResponse;
import com.meet.server.features.snippet.model.Collection;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class CollectionMapper {

    public static CollectionResponse toResponse(Collection collection, Long count) {
        return CollectionResponse.builder()
                .id(collection.getId())
                .name(collection.getName())
                .description(collection.getDescription())
                .snippetCount(count)
                .build();
    }

    public static CollectionDetailResponse toDetailResponse(Collection collection, List<SnippetResponse> snippetResponses) {
        return CollectionDetailResponse.builder()
                .id(collection.getId())
                .name(collection.getName())
                .description(collection.getDescription())
                .snippets(snippetResponses)
                .build();
    }
}
