package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.InfluencerRequest;
import com.prxy.influencer_sponsorship_app.Exception.InfluencerNotFoundException;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InfluencerService {
    private final InfluencerRepo influencerRepo;

    public Page<Influencer> getAllInfluencers(Pageable pageable) {
        return influencerRepo.findAll(pageable);
    }

    public Influencer createInfluencer(InfluencerRequest request) {
        Influencer influencer = Influencer.builder()
                .name(request.getName())
                .platform(request.getPlatform())
                .followers(request.getFollowers())
                .totalEarnings(0.0)
                .build();
        return influencerRepo.save(influencer);
    }

    public Influencer getInfluencerById(int id) {
        return influencerRepo.findById(id).orElseThrow(() -> new InfluencerNotFoundException("Influencer not found with id: " + id));
    }
}

