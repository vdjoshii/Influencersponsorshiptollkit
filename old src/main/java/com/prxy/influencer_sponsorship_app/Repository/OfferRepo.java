package com.prxy.influencer_sponsorship_app.Repository;

import com.prxy.influencer_sponsorship_app.Model.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfferRepo extends JpaRepository<Offer, Integer> {

    Optional<Offer> findByIdAndStatus(int id, String status);

    // Fixed: actual filter queries instead of getById (old code was broken)
    Page<Offer> findByBrandId(int brandId, Pageable pageable);

    Page<Offer> findByInfluencerId(int influencerId, Pageable pageable);
}