package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.InfluencerRequest;
import com.prxy.influencer_sponsorship_app.Exception.BrandNotFoundException;
import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Repository.BrandRepo;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepo brandRepo;
    public Page<Brand> getAllBrands(Pageable pageable) {
        return brandRepo.findAll(pageable);
    }

    public Brand createBrand(Brand brand) {
        return brandRepo.save(brand);
    }

    public Brand getBrandById(int id) {
        return brandRepo.findById(id).orElseThrow(() -> new BrandNotFoundException("Brand not found with id: " + id));
    }
}
