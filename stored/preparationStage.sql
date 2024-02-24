-- Create the preparationStage table
CREATE TABLE "preparationStage" (
    id SERIAL PRIMARY KEY,
    "stageName" VARCHAR(100) NOT NULL
);

-- Insert data into the preparationStage table
INSERT INTO "preparationStage" ("stageName") VALUES 
    ('Starting My Job Search'),
    ('Actively Interviewing'),
    ('Practicing To Stay Interview Ready');

