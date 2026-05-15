package com.meet.server.features.snippet.model;


import com.meet.server.common.audit.BaseAuditEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Tag extends BaseAuditEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "tags_snippets",
            joinColumns = @JoinColumn(name = "tag_id"),
            inverseJoinColumns = @JoinColumn(name = "snippet_id")
    )
    private Set<Snippet> snippets = new HashSet<>();

    private void addSnippet(Snippet snippet) {
        snippet.getTags().add(this);
    }

    private void removeSnippet(Snippet snippet) {
        snippet.getTags().remove(this);
    }
}
