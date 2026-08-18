-- V3: Add users table for authentication
-- Roles: BRAND or INFLUENCER
-- brand_id / influencer_id links the user to their profile

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    brand_id INT NULL,
    influencer_id INT NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (influencer_id) REFERENCES influencers(id)
);