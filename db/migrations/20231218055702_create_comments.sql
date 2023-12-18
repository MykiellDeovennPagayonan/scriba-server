-- migrate:up
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    study_note_comment_id INT REFERENCES study_note_comments(id) ON DELETE CASCADE,
    comment_date_create TIMESTAMP NOT NULL
);

-- migrate:down
drop table comments