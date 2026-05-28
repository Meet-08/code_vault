package com.meet.server.features.snippet.specification;

import com.meet.server.features.snippet.model.Collection;
import com.meet.server.features.user.model.User;
import org.springframework.data.jpa.domain.Specification;

public class CollectionSpecification {

    public static Specification<Collection> isCreatedBy(User createdBy) {
        return (root, query, cb) ->
                cb.equal(root.get("createdBy").get("id"), createdBy.getId());
    }

    public static Specification<Collection> contains(String q) {
        return (root, query, criteriaBuilder) -> {
            if (q == null || q.trim().isEmpty())
                return null;

            return criteriaBuilder.like(root.get("name"), "%" + q + "%");
        };
    }
}
