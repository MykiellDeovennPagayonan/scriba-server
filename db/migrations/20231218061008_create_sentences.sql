-- migrate:up
CREATE TABLE sentences (
    id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    type VARCHAR(255) NOT NULL,
    embedding FLOAT8[],
    study_note_id INT REFERENCES study_notes(id) ON DELETE CASCADE
);

-- migrate:down
drop table sentences