package com.prxy.influencer_sponsorship_app.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "influencers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Influencer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String platform;

    private Integer followers;

    private Double totalEarnings;
}