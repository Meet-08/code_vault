package com.meet.server.features.snippet.specification;

import com.meet.server.features.snippet.model.Snippet;
import com.meet.server.features.snippet.model.Tag;
import com.meet.server.features.user.model.User;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public class SnippetSpecification {

    public static Specification<Snippet> isNotDeleted() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("isDeleted"));
    }

    public static Specification<Snippet> hasUser(User user) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("createdBy"), user);
    }

    public static Specification<Snippet> containsQuery(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return null;

            String tsQuery = Arrays.stream(q.trim().split("\\s+"))
                    .map(term -> term + ":*")
                    .collect(Collectors.joining(" & "));

            return cb.isTrue(
                    cb.function(
                            "fts_match",
                            Boolean.class,
                            root.get("searchVector"),
                            cb.literal(tsQuery)
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
