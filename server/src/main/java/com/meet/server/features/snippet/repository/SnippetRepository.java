package com.meet.server.features.snippet.repository;

import com.meet.server.features.snippet.model.Snippet;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long>, JpaSpecificationExecutor<Snippet> {

    @NullMarked
    Page<Snippet> findAll(
            Specification<Snippet> spec,
            Pageable pageable
    );
}
