ALTER TABLE collections
    ADD created_by_id BIGINT;

ALTER TABLE collections
    ALTER COLUMN created_by_id SET NOT NULL;

ALTER TABLE collections
    ADD CONSTRAINT FK_COLLECTIONS_ON_CREATED_BY FOREIGN KEY (created_by_id) REFERENCES users (id);