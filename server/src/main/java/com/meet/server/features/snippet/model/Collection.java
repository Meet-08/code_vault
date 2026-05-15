package com.meet.server.features.snippet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "collections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Collection {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, length = 25)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "collection_snippets",
            joinColumns = @JoinColumn(name = "collection_id"),
            inverseJoinColumns = @JoinColumn(name = "snippet_id")
    )
    private Set<Snippet> snippets = new HashSet<>();


    private void addSnippet(Snippet snippet) {
        snippet.getCollections().add(this);
    }

    private void removeSnippet(Snippet snippet) {
        snippet.getCollections().remove(this);
    }
}
