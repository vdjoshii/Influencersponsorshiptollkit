package com.prxy.influencer_sponsorship_app.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    // "BRAND" or "INFLUENCER"
    @NotBlank
    private String role;

    // Required when role = BRAND
    private String brandName;
    private Double marketingBudget;

    // Required when role = INFLUENCER
    private String influencerName;
    private String platform;
    private Integer followers;
}