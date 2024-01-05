-- migrate:up
INSERT INTO topics(name)
VALUES ('science'), ('mathematics'), ('history'), ('literature'), ('georgraphy'), ('language')

-- migrate:down
DELETE FROM topics
