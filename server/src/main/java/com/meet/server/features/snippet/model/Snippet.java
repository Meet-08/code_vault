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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Snippet extends BaseAuditEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 50, nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "created_by_id",
            foreignKey = @ForeignKey(name = "fk_snippet_created_by")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User createdBy;

    @ManyToMany(mappedBy = "snippets")  // Collection owns the relationship
    private Set<Collection> collections = new HashSet<>();

    @ManyToMany(mappedBy = "snippets")
    private Set<Tag> tags = new HashSet<>();

    private boolean isFavorite = false;

    private boolean isDeleted = false;
}
