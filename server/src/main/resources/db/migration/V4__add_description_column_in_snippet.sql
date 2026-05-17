ALTER TABLE snippets
    ADD description VARCHAR(100);

ALTER TABLE snippets
    ALTER COLUMN description SET NOT NULL;