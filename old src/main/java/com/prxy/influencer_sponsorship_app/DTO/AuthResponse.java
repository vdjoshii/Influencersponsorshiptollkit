package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String role;
    private String email;

    // The linked profile id — brand.id or influencer.id
    private int profileId;

    // Human-readable display name
    private String name;
}