package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ConversationSummary {
    private int peerId;
    private String peerName;
    private String peerRole;   // "BRAND" or "INFLUENCER"
    private String lastMessage;
    private long unreadCount;
}
