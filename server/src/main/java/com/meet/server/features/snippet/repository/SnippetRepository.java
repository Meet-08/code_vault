package com.meet.server.features.snippet.repository;

import com.meet.server.features.dashboard.dto.LanguageCount;
import com.meet.server.features.snippet.model.Snippet;
import com.meet.server.features.user.model.User;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long>, JpaSpecificationExecutor<Snippet> {

    @NullMarked
    @EntityGraph(attributePaths = {
            "createdBy"
    })
    Page<Snippet> findAll(
            Specification<Snippet> spec,
            Pageable pageable
    );

    Optional<Snippet> findByIdAndCreatedBy(Long aLong, User user);

    @Query("""
                SELECT new com.meet.server.features.dashboard.dto.LanguageCount(
                    s.language,
                    COUNT(s)
                )
                FROM Snippet s
                WHERE s.createdBy.id = :userId
                  AND s.isDeleted = false
                GROUP BY s.language
                ORDER BY COUNT(s) DESC
            """)
    List<LanguageCount> getLanguageCounts(Long userId);
}
