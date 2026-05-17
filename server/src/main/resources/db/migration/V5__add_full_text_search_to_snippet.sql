-- Add tsvector column
ALTER TABLE snippets
    ADD COLUMN search_vector tsvector;

-- Populate existing rows
UPDATE snippets
SET search_vector =
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B');

-- Create GIN index
CREATE INDEX idx_snippet_search_vector
    ON snippets
    USING GIN(search_vector);

-- Function to auto-update vector
CREATE FUNCTION snippets_search_vector_update()
    RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(
            to_tsvector('english', coalesce(NEW.title, '')),
            'A'
        )
        ||
        setweight(
            to_tsvector('english', coalesce(NEW.description, '')),
            'B'
        );

RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trg_snippets_search_vector
    BEFORE INSERT OR UPDATE
                         ON snippets
                         FOR EACH ROW
                         EXECUTE FUNCTION snippets_search_vector_update();