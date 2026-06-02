package com.meet.server.features.user.repository;

import com.meet.server.features.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
                SELECT u
                FROM User u
                WHERE COALESCE(:q, '') = ''
                   OR LOWER(u.name) LIKE CONCAT('%', LOWER(CAST(:q AS string)), '%')
                   OR LOWER(u.email) LIKE CONCAT('%', LOWER(CAST(:q AS string)), '%')
            """)
    Page<User> search(@Param("q") String q, Pageable pageable);
}
