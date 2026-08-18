package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.RatingRequest;
import com.prxy.influencer_sponsorship_app.DTO.RatingResponse;
import com.prxy.influencer_sponsorship_app.Exception.BrandNotFoundException;
import com.prxy.influencer_sponsorship_app.Exception.InfluencerNotFoundException;
import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Model.Rating;
import com.prxy.influencer_sponsorship_app.Repository.BrandRepo;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import com.prxy.influencer_sponsorship_app.Repository.RatingRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepo ratingRepo;
    private final BrandRepo brandRepo;
    private final InfluencerRepo influencerRepo;

    /** Upsert: one rating per brand-influencer pair */
    @Transactional
    public RatingResponse.RatingItem upsert(RatingRequest req) {
        Brand brand = brandRepo.findById(req.getBrandId())
                .orElseThrow(() -> new BrandNotFoundException("Brand not found: " + req.getBrandId()));
        Influencer influencer = influencerRepo.findById(req.getInfluencerId())
                .orElseThrow(() -> new InfluencerNotFoundException("Influencer not found: " + req.getInfluencerId()));

        Rating rating = ratingRepo
                .findByBrandIdAndInfluencerId(req.getBrandId(), req.getInfluencerId())
                .orElse(Rating.builder().brand(brand).influencer(influencer).build());

        rating.setStars(req.getStars());
        rating.setReview(req.getReview());
        Rating saved = ratingRepo.save(rating);

        return RatingResponse.RatingItem.builder()
                .id(saved.getId())
                .brandName(brand.getName())
                .stars(saved.getStars())
                .review(saved.getReview())
                .build();
    }

    /** Get all ratings + average for an influencer */
    public RatingResponse getForInfluencer(int influencerId) {
        List<Rating> ratings = ratingRepo.findByInfluencerId(influencerId);
        Double avg = ratingRepo.getAverageRatingByInfluencerId(influencerId);

        List<RatingResponse.RatingItem> items = ratings.stream()
                .map(r -> RatingResponse.RatingItem.builder()
                        .id(r.getId())
                        .brandName(r.getBrand().getName())
                        .stars(r.getStars())
                        .review(r.getReview())
                        .build())
                .collect(Collectors.toList());

        return RatingResponse.builder()
                .influencerId(influencerId)
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .totalRatings(ratings.size())
                .ratings(items)
                .build();
    }
}
