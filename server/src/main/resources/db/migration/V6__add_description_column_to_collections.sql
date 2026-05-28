ALTER TABLE collections
    ADD description VARCHAR(200);

ALTER TABLE collections
    ALTER COLUMN description SET NOT NULL;