-- Table: Influencer
CREATE TABLE influencers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(255) NOT NULL,
    followers INT NOT NULL,
    total_earnings DOUBLE(10,2) DEFAULT 0.0
);

-- Table: Brand
CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    marketing_budget DOUBLE(10,2) NOT NULL
);

-- Table: Offer
CREATE TABLE offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proposed_amount DOUBLE(10,2) NOT NULL,
    status VARCHAR(255) DEFAULT 'PENDING',
    brand_id INT NOT NULL,
    influencer_id INT NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (influencer_id) REFERENCES influencers(id)
);
