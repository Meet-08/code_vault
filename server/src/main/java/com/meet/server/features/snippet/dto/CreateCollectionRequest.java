package com.meet.server.features.snippet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

import java.util.List;

public record CreateCollectionRequest(

        @NotBlank
        @Length(min = 3, max = 50)
        String name,

        @NotBlank
        @Length(min = 3, max = 200)
        String description,

        @NotNull
        @Size(min = 1, max = 20)
        List<Long> snippetsIds
) {
}
