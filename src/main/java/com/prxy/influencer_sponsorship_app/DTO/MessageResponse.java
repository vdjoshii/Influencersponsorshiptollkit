package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MessageResponse {
    private Long id;
    private int brandId;
    private String brandName;
    private int influencerId;
    private String influencerName;
    private String senderRole;
    private String content;
    private LocalDateTime createdAt;
    private boolean read;
}
