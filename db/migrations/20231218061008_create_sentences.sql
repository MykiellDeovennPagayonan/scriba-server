-- migrate:up
CREATE TABLE sentences (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    embedding BYTEA, -- Assuming embedding is a binary data
    study_note_id INT REFERENCES study_notes(id) ON DELETE CASCADE
);

-- migrate:down
drop table sentences
