package com.prxy.influencer_sponsorship_app.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequest {

    @NotNull
    private Integer brandId;

    @NotNull
    private Integer influencerId;

    @NotNull @Min(1) @Max(5)
    private Integer stars;

    private String review;
}
