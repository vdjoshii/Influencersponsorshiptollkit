package com.prxy.influencer_sponsorship_app.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MessageRequest {

    @NotNull
    private Integer brandId;

    @NotNull
    private Integer influencerId;

    /** "BRAND" or "INFLUENCER" */
    @NotBlank
    private String senderRole;

    @NotBlank
    @Size(max = 1000)
    private String content;
}
