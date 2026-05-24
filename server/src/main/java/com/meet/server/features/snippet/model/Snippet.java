package com.meet.server.features.snippet.model;

import com.meet.server.common.audit.BaseAuditEntity;
import com.meet.server.features.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "snippets",
        indexes = {
                @Index(name = "idx_snippet_created_by", columnList = "created_by_id"),
                @Index(name = "idx_snippet_created_by_deleted", columnList = "created_by_id,is_deleted"),
                @Index(name = "idx_snippet_created_by_favorite", columnList = "created_by_id,is_favorite"),
                @Index(name = "idx_snippet_language", columnList = "language")
        })
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(
        callSuper = true,
        exclude = {"createdBy", "collections", "tags"}
)
@ToString(exclude = {"createdBy", "collections", "tags"})
public class Snippet extends BaseAuditEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 100, nullable = false)
    private String description;

    @Column(length = 50, nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(
            name = "search_vector",
            columnDefinition = "tsvector",
            insertable = false,
            updatable = false
    )
    private String searchVector;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "created_by_id",
            foreignKey = @ForeignKey(name = "fk_snippet_created_by")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User createdBy;

    @ManyToMany(mappedBy = "snippets")  // Collection owns the relationship
    @Builder.Default
    private Set<Collection> collections = new HashSet<>();

    @ManyToMany(mappedBy = "snippets")
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @Builder.Default
    private boolean isFavorite = false;

    @Builder.Default
    private boolean isDeleted = false;

    public void addCollection(Collection collection) {
        collections.add(collection);
        collection.getSnippets().add(this);
    }

    public void removeCollection(Collection collection) {
        collections.remove(collection);
        collection.getSnippets().remove(this);
    }

    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getSnippets().add(this);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getSnippets().remove(this);
    }
}
