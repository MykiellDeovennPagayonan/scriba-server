-- migrate:up
CREATE TABLE shared_notes (
    id SERIAL PRIMARY KEY,
    study_group_id INT REFERENCES study_groups(id) ON DELETE CASCADE,
    study_note_id INT REFERENCES study_notes(id) ON DELETE CASCADE
);

-- migrate:down
drop table shared_notes
