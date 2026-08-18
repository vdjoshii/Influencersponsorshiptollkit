package com.prxy.influencer_sponsorship_app.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfferRequest {

    private int brandId;

    private int influencerId;

    private Double proposedAmount;
}