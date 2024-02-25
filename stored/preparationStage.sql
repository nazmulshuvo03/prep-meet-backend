-- Create the preparationStage table
CREATE TABLE "preparationStages" (
    id SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);

-- Insert data into the preparationStage table
INSERT INTO "preparationStages" ("name") VALUES 
    ('Starting My Job Search'),
    ('Actively Interviewing'),
    ('Practicing To Stay Interview Ready');

