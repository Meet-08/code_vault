package com.meet.server.features.snippet.repository;

import com.meet.server.features.snippet.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    @Query("""
                select distinct t.name
                from Tag t
                join t.snippets s
                where s.createdBy.id = :userId
                  and s.isDeleted = false
                order by t.name
            """)
    List<String> findUserTags(Long userId);
}
