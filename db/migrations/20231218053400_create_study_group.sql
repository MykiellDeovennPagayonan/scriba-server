-- migrate:up
CREATE TABLE study_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- migrate:down
drop table study_groups

