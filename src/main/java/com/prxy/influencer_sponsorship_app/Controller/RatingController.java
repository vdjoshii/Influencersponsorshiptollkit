package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.DTO.RatingRequest;
import com.prxy.influencer_sponsorship_app.DTO.RatingResponse;
import com.prxy.influencer_sponsorship_app.Service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.prxy.influencer_sponsorship_app.Constant.ApiPath.BASE_PATH;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_PATH + "/ratings")
public class RatingController {

    private final RatingService ratingService;

    /** GET /ratings?influencerId=1 — get ratings for an influencer */
    @GetMapping
    public ResponseEntity<RatingResponse> getRatings(@RequestParam int influencerId) {
        return ResponseEntity.ok(ratingService.getForInfluencer(influencerId));
    }

    /** POST /ratings — create or update a rating */
    @PostMapping
    public ResponseEntity<RatingResponse.RatingItem> upsertRating(
            @Valid @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.upsert(request));
    }
}
