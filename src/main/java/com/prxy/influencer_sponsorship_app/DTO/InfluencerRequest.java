package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InfluencerRequest {

    private String name;

    private String platform;

    private Integer followers;
}