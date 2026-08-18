package com.prxy.influencer_sponsorship_app.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Brand brand;

    @ManyToOne
    private Influencer influencer;

    private Double proposedAmount;

    private String status;
}