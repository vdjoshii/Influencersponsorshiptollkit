package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.OfferRequest;
import com.prxy.influencer_sponsorship_app.Exception.*;
import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Model.Offer;
import com.prxy.influencer_sponsorship_app.Repository.BrandRepo;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import com.prxy.influencer_sponsorship_app.Repository.OfferRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepo offerRepo;
    private final BrandRepo brandRepo;
    private final InfluencerRepo influencerRepo;
    private final BrandService brandService;
    private final InfluencerService influencerService;

    public Offer createOffer(OfferRequest request) {
        Offer offer = Offer.builder()
                .brand(brandService.getBrandById(request.getBrandId()))
                .influencer(influencerService.getInfluencerById(request.getInfluencerId()))
                .proposedAmount(request.getProposedAmount())
                .status("PENDING")
                .build();
        return offerRepo.save(offer);
    }

    public Page<Offer> getAllOffers(Pageable pageable) {
        return offerRepo.findAll(pageable);
    }

    // Fixed: returns offers for a specific brand
    public Page<Offer> getOffersByBrandId(int brandId, Pageable pageable) {
        return offerRepo.findByBrandId(brandId, pageable);
    }

    // Fixed: returns offers for a specific influencer
    public Page<Offer> getOffersByInfluencerId(int influencerId, Pageable pageable) {
        return offerRepo.findByInfluencerId(influencerId, pageable);
    }

    public Offer getOfferById(int id) {
        return offerRepo.findById(id)
                .orElseThrow(() -> new OfferNotFoundException("Offer not found with id: " + id));
    }

    public Offer updateOfferStatus(int id, String status) {
        Offer offer = offerRepo.findById(id)
                .orElseThrow(() -> new OfferNotFoundException("Offer not found with id: " + id));

        if (!offer.getStatus().equals("PENDING")) {
            throw new InvalidOfferStateException("Only PENDING offers can be updated");
        }

        Brand brand = offer.getBrand();
        Influencer influencer = offer.getInfluencer();

        if (status.equals("ACCEPTED")) {
            if (brand.getMarketingBudget() < offer.getProposedAmount()) {
                throw new InsufficientResourcesException("Insufficient marketing budget");
            }
            brand.setMarketingBudget(brand.getMarketingBudget() - offer.getProposedAmount());
            influencer.setTotalEarnings(influencer.getTotalEarnings() + offer.getProposedAmount());
            brandRepo.save(brand);
            influencerRepo.save(influencer);
        }

        offer.setStatus(status);
        return offerRepo.save(offer);
    }
}