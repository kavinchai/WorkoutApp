-- V5 — Add exercise type and duration support for cardio/skill exercises
ALTER TABLE exercise_set
    ADD COLUMN exercise_type    VARCHAR(10) NOT NULL DEFAULT 'lifting',
    ADD COLUMN duration_seconds INTEGER;
