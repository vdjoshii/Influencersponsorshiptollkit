CREATE TABLE IF NOT EXISTS messages (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    brand_id      INT NOT NULL,
    influencer_id INT NOT NULL,
    sender_role   VARCHAR(20) NOT NULL,
    content       VARCHAR(1000) NOT NULL,
    created_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    is_read       TINYINT(1) NOT NULL DEFAULT 0,
    INDEX idx_msg_brand_inf (brand_id, influencer_id),
    INDEX idx_msg_created   (created_at),
    FOREIGN KEY (brand_id)      REFERENCES brands(id)      ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
);
