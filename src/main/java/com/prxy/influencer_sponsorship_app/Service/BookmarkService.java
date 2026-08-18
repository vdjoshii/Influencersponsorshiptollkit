package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.BookmarkResponse;
import com.prxy.influencer_sponsorship_app.Exception.BrandNotFoundException;
import com.prxy.influencer_sponsorship_app.Exception.InfluencerNotFoundException;
import com.prxy.influencer_sponsorship_app.Model.Bookmark;
import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Repository.BookmarkRepo;
import com.prxy.influencer_sponsorship_app.Repository.BrandRepo;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepo bookmarkRepo;
    private final BrandRepo brandRepo;
    private final InfluencerRepo influencerRepo;

    /** Toggle bookmark — returns true if now bookmarked, false if removed */
    @Transactional
    public boolean toggle(int brandId, int influencerId) {
        if (bookmarkRepo.existsByBrandIdAndInfluencerId(brandId, influencerId)) {
            bookmarkRepo.deleteByBrandIdAndInfluencerId(brandId, influencerId);
            return false;
        }
        Brand brand = brandRepo.findById(brandId)
                .orElseThrow(() -> new BrandNotFoundException("Brand not found: " + brandId));
        Influencer influencer = influencerRepo.findById(influencerId)
                .orElseThrow(() -> new InfluencerNotFoundException("Influencer not found: " + influencerId));
        bookmarkRepo.save(Bookmark.builder().brand(brand).influencer(influencer).build());
        return true;
    }

    /** Get all bookmarked influencers for a brand */
    public List<BookmarkResponse> getBookmarks(int brandId) {
        return bookmarkRepo.findByBrandId(brandId).stream()
                .map(b -> {
                    Influencer inf = b.getInfluencer();
                    return BookmarkResponse.builder()
                            .influencerId(inf.getId())
                            .name(inf.getName())
                            .platform(inf.getPlatform())
                            .followers(inf.getFollowers())
                            .totalEarnings(inf.getTotalEarnings())
                            .bookmarked(true)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /** Get set of bookmarked influencer IDs for a brand (for UI state) */
    public Set<Integer> getBookmarkedIds(int brandId) {
        return bookmarkRepo.findByBrandId(brandId).stream()
                .map(b -> b.getInfluencer().getId())
                .collect(Collectors.toSet());
    }
}
