package com.meet.server.features.snippet.repository;

import com.meet.server.features.snippet.model.Collection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long>, JpaSpecificationExecutor<Collection> {
    
    @EntityGraph(attributePaths = {"snippets"})
    Optional<Collection> findById(long id);

    @Query("""
                select count(s)
                from Collection c
                left join c.snippets s
                where c.id = :collectionId
            """)
    long countSnippetsById(Long collectionId);
}
