-- migrate:up
CREATE TABLE study_note_comments (
    id SERIAL PRIMARY KEY,
    study_note_id INT REFERENCES study_notes(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- migrate:down
drop table study_note_comments
