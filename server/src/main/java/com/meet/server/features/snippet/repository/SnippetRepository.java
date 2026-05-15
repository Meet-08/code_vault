package com.meet.server.features.snippet.repository;

import com.meet.server.features.snippet.model.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long> {
}
