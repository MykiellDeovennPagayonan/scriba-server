-- migrate:up
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    embedding BYTEA, -- Assuming embedding is a binary data
    answer TEXT NOT NULL, -- Assuming multiple choice answers are stored in an array
    study_notes_id INT REFERENCES study_notes(id) ON DELETE CASCADE
);


-- migrate:down
drop table quiz_questions
