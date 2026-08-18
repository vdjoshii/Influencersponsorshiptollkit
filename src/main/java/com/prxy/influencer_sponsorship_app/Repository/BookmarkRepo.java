package com.prxy.influencer_sponsorship_app.Repository;

import com.prxy.influencer_sponsorship_app.Model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepo extends JpaRepository<Bookmark, Integer> {

    List<Bookmark> findByBrandId(int brandId);

    Optional<Bookmark> findByBrandIdAndInfluencerId(int brandId, int influencerId);

    boolean existsByBrandIdAndInfluencerId(int brandId, int influencerId);

    void deleteByBrandIdAndInfluencerId(int brandId, int influencerId);
}
