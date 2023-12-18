-- migrate:up
CREATE TABLE study_note_topics (
    id SERIAL PRIMARY KEY,
    topic_id INT REFERENCES topics(id) ON DELETE CASCADE,
    study_notes_id INT REFERENCES study_notes(id) ON DELETE CASCADE
);

-- migrate:down
drop table study_note_topics
