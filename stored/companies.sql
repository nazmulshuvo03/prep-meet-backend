CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(255),
    name VARCHAR(255),
    country VARCHAR(255),
    sector VARCHAR(255),
    industry VARCHAR(255)
);

INSERT INTO companies (symbol, name, country, sector, industry) VALUES
('A', 'Agilent Technologies Inc. Common Stock', 'United States', 'Industrials', 'Electrical Products'),
('AA', 'Alcoa Corporation Common Stock', 'United States', 'Industrials', 'Aluminum'),
('AACG', 'ATA Creativity Global American Depositary Shares', 'China', 'Real Estate', 'Other Consumer Services'),
('AACI', 'Armada Acquisition Corp. I Common Stock', 'United States', 'Finance', 'Blank Checks'),
('AACIW', 'Armada Acquisition Corp. I Warrant', 'United States', 'Finance', 'Blank Checks'),
('AACT', 'Ares Acquisition Corporation II Class A Ordinary Shares', '', 'Finance', 'Blank Checks');