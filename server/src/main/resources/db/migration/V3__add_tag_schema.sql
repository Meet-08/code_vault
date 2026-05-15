CREATE SEQUENCE IF NOT EXISTS tags_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE tags
(
    id         BIGINT       NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    name       VARCHAR(255) NOT NULL,
    CONSTRAINT pk_tags PRIMARY KEY (id)
);

CREATE TABLE tags_snippets
(
    snippet_id BIGINT NOT NULL,
    tag_id     BIGINT NOT NULL,
    CONSTRAINT pk_tags_snippets PRIMARY KEY (snippet_id, tag_id)
);

ALTER TABLE tags
    ADD CONSTRAINT uc_tags_name UNIQUE (name);

ALTER TABLE tags_snippets
    ADD CONSTRAINT fk_tagsni_on_snippet FOREIGN KEY (snippet_id) REFERENCES snippets (id);

ALTER TABLE tags_snippets
    ADD CONSTRAINT fk_tagsni_on_tag FOREIGN KEY (tag_id) REFERENCES tags (id);