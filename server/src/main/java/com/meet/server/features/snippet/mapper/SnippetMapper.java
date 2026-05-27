package com.meet.server.features.snippet.mapper;

import com.meet.server.features.snippet.dto.CreateSnippetRequest;
import com.meet.server.features.snippet.dto.SnippetDetailResponse;
import com.meet.server.features.snippet.dto.SnippetResponse;
import com.meet.server.features.snippet.model.Snippet;
import com.meet.server.features.snippet.model.Tag;
import com.meet.server.features.user.model.User;
import lombok.experimental.UtilityClass;

@UtilityClass
public class SnippetMapper {

    public static Snippet toEntity(
            CreateSnippetRequest createSnippetRequest,
            User user
    ) {
        return Snippet.builder()
                .title(createSnippetRequest.title())
                .description(createSnippetRequest.description())
                .language(createSnippetRequest.language())
                .createdBy(user)
                .code(createSnippetRequest.code())
                .build();
    }

    public static SnippetResponse toDto(Snippet snippet) {
        return new SnippetResponse(
                snippet.getId(),
                snippet.getTitle(),
                snippet.getLanguage(),
                snippet.getDescription(),
                snippet.getTags().stream().map(Tag::getName).toList(),
                snippet.isFavorite(),
                snippet.getCreatedAt().toString()
        );
    }

    public static SnippetDetailResponse toDetailsDto(Snippet snippet) {
        return new SnippetDetailResponse(
                snippet.getId(),
                snippet.getTitle(),
                snippet.getLanguage(),
                snippet.getCode(),
                snippet.getDescription(),
                snippet.getTags().stream().map(Tag::getName).toList(),
                snippet.isFavorite(),
                snippet.getCreatedAt().toString()
        );
    }
}
