-- Create the ExperienceLevel table with the desired name
CREATE TABLE "experienceLevels" (
    id SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL
);

-- Insert data into the ExperienceLevel table
INSERT INTO "experienceLevels" ("name") VALUES 
    ('Entry level (IC less than 5 YOE)'),
    ('Mid level (IC with 5-8 YOE)'),
    ('Senior level (IC and people management)'),
    ('Executive level (People management)');
