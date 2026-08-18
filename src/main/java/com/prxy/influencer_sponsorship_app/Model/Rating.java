package com.prxy.influencer_sponsorship_app.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"brand_id", "influencer_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "influencer_id", nullable = false)
    private Influencer influencer;

    /** 1–5 stars */
    @Column(nullable = false)
    private int stars;

    @Column(length = 500)
    private String review;
}
