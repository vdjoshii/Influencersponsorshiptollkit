-- Bookmarks: brand saves/follows an influencer
CREATE TABLE IF NOT EXISTS bookmarks (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    brand_id      INT NOT NULL,
    influencer_id INT NOT NULL,
    UNIQUE KEY uq_bookmark (brand_id, influencer_id),
    FOREIGN KEY (brand_id)      REFERENCES brands(id)      ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
);

-- Ratings: brand rates an influencer (1 per brand-influencer pair)
CREATE TABLE IF NOT EXISTS ratings (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    brand_id      INT NOT NULL,
    influencer_id INT NOT NULL,
    stars         TINYINT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    review        VARCHAR(500),
    UNIQUE KEY uq_rating (brand_id, influencer_id),
    FOREIGN KEY (brand_id)      REFERENCES brands(id)      ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
);
