package com.prxy.influencer_sponsorship_app.DTO;

import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMarketingBudgetRequest {

    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private double amount;
}
