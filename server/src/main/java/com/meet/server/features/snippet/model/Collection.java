package com.meet.server.features.snippet.model;

import com.meet.server.features.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "collections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "snippets")
public class Collection {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, length = 25)
    private String name;

    @Column(nullable = false, length = 200)
    private String description;

    @ManyToMany
    @JoinTable(
            name = "collection_snippets",
            joinColumns = @JoinColumn(name = "collection_id"),
            inverseJoinColumns = @JoinColumn(name = "snippet_id")
    )
    private Set<Snippet> snippets = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    public void addSnippet(Snippet snippet) {
        snippets.add(snippet);
        snippet.getCollections().add(this);
    }
}
