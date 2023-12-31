-- migrate:up
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    embedding FLOAT8[],
    answer TEXT NOT NULL,
    study_notes_id INT REFERENCES study_notes(id) ON DELETE CASCADE
);

-- migrate:down
drop table quiz_questions
