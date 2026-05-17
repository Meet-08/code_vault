package com.meet.server.features.snippet.specification;

import com.meet.server.features.snippet.model.Snippet;
import com.meet.server.features.snippet.model.Tag;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Locale;

public class SnippetSpecification {

    public static Specification<Snippet> isNotDeleted() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("isDeleted"));
    }

    public static Specification<Snippet> containsQuery(String q) {
        return (root, query, criteriaBuilder) -> {
            if (q == null || q.isBlank()) return null;

            return criteriaBuilder.isTrue(
                    criteriaBuilder.function(
                            "fts_match",
                            Boolean.class,
                            root.get("searchVector"),
                            criteriaBuilder.literal(q)
                    )
            );
        };
    }

    public static Specification<Snippet> hasLanguage(String language) {
        return (root, query, criteriaBuilder) -> {
            if (language == null || language.isBlank()) return null;
            return criteriaBuilder.equal(root.get("language"), language.toLowerCase(Locale.ROOT));
        };
    }

    public static Specification<Snippet> hasTags(List<String> tags) {
        return (root, query, cb) -> {
            if (tags == null || tags.isEmpty()) return null;

            query.distinct(true);

            Join<Snippet, Tag> tagJoin =
                    root.joinSet("tags");

            return tagJoin
                    .get("name")
                    .in(tags);
        };
    }
}
