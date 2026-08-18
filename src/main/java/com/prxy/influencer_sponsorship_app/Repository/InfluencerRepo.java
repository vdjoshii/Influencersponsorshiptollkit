package com.prxy.influencer_sponsorship_app.Repository;

import com.prxy.influencer_sponsorship_app.Model.Influencer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfluencerRepo extends JpaRepository<Influencer, Integer> {
}
