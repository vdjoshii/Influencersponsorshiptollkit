package com.prxy.influencer_sponsorship_app.Repository;

import com.prxy.influencer_sponsorship_app.Model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Integer> {

    List<Rating> findByInfluencerId(int influencerId);

    Optional<Rating> findByBrandIdAndInfluencerId(int brandId, int influencerId);

    @Query("SELECT COALESCE(AVG(r.stars), 0) FROM Rating r WHERE r.influencer.id = :influencerId")
    Double getAverageRatingByInfluencerId(int influencerId);
}
