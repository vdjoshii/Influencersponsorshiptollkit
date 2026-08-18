package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RatingResponse {
    private int influencerId;
    private double averageRating;
    private int totalRatings;
    private List<RatingItem> ratings;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RatingItem {
        private int id;
        private String brandName;
        private int stars;
        private String review;
    }
}
