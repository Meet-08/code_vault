CREATE SEQUENCE IF NOT EXISTS collections_seq START WITH 1 INCREMENT BY 50;

CREATE SEQUENCE IF NOT EXISTS snippets_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE collection_snippets
(
    collection_id BIGINT NOT NULL,
    snippet_id    BIGINT NOT NULL,
    CONSTRAINT pk_collection_snippets PRIMARY KEY (collection_id, snippet_id)
);

CREATE TABLE collections
(
    id   BIGINT      NOT NULL,
    name VARCHAR(25) NOT NULL,
    CONSTRAINT pk_collections PRIMARY KEY (id)
);

CREATE TABLE snippets
(
    id            BIGINT                      NOT NULL,
    created_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    title         VARCHAR(255)                NOT NULL,
    language      VARCHAR(50)                 NOT NULL,
    code          TEXT                        NOT NULL,
    created_by_id BIGINT,
    is_favorite   BOOLEAN                     NOT NULL,
    is_deleted    BOOLEAN                     NOT NULL,
    CONSTRAINT pk_snippets PRIMARY KEY (id)
);

CREATE INDEX idx_snippet_created_by_deleted ON snippets (created_by_id, is_deleted);

CREATE INDEX idx_snippet_created_by_favorite ON snippets (created_by_id, is_favorite);

CREATE INDEX idx_snippet_language ON snippets (language);

ALTER TABLE snippets
    ADD CONSTRAINT FK_SNIPPET_CREATED_BY FOREIGN KEY (created_by_id) REFERENCES users (id) ON DELETE CASCADE;

CREATE INDEX idx_snippet_created_by ON snippets (created_by_id);

ALTER TABLE collection_snippets
    ADD CONSTRAINT fk_colsni_on_collection FOREIGN KEY (collection_id) REFERENCES collections (id);

ALTER TABLE collection_snippets
    ADD CONSTRAINT fk_colsni_on_snippet FOREIGN KEY (snippet_id) REFERENCES snippets (id);
