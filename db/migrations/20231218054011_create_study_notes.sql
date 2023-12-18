-- migrate:up
CREATE TABLE study_notes (
    id SERIAL PRIMARY KEY,
    date_published TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_public BOOLEAN NOT NULL,
    study_notes_edited_date TIMESTAMP
);

-- migrate:down
drop table study_notes

