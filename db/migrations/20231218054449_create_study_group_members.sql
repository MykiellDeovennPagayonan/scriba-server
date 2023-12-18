-- migrate:up
CREATE TABLE study_group_members (
    id SERIAL PRIMARY KEY,
    study_group_id INT REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);


-- migrate:down
drop table study_group_members

