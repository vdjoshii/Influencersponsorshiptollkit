package com.prxy.influencer_sponsorship_app.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.*;

@Data
@Getter
@Setter
public class LoginRequest {

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;
}