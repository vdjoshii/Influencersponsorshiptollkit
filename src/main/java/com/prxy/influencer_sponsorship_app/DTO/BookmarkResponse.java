package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BookmarkResponse {
    private int influencerId;
    private String name;
    private String platform;
    private int followers;
    private double totalEarnings;
    private boolean bookmarked;
}
