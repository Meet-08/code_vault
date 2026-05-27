package com.meet.server.features.snippet.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.UniqueElements;

import java.util.List;

public record UpdateSnippetRequest(

        @Length(min = 3, max = 50)
        String title,

        @Length(min = 3, max = 100)
        String description,

        @Length(min = 2, max = 30)
        @Pattern(
                regexp = "^[a-zA-Z0-9#+.-]+$",
                message = "Invalid language format"
        )
        String language,

        @Length(min = 1, max = 10000)
        String code,
        
        @Size(min = 1, max = 10)
        @UniqueElements
        List<
                @Length(min = 2, max = 30)
                @Pattern(
                        regexp = "^[a-zA-Z0-9_\\- ]+$",
                        message = "Invalid tag format"
                )
                        String
                > tags

) {
}
