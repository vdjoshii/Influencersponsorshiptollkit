package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.DTO.OfferRequest;
import com.prxy.influencer_sponsorship_app.DTO.OfferUpdateRequest;
import com.prxy.influencer_sponsorship_app.Model.Offer;
import com.prxy.influencer_sponsorship_app.Service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.prxy.influencer_sponsorship_app.Constant.ApiPath.BASE_PATH;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_PATH + "/offers")
public class OfferController {

    private final OfferService offerService;

    @PostMapping
    public ResponseEntity<Offer> createOffer(@RequestBody OfferRequest request) {
        return new ResponseEntity<>(offerService.createOffer(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Offer>> getAllOffers(
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        return ResponseEntity.ok(offerService.getAllOffers(pageable));
    }

    // Fixed: now actually filters by influencer id
    @GetMapping("/influencer")
    public ResponseEntity<Page<Offer>> getOffersByInfluencer(
            @RequestParam int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(offerService.getOffersByInfluencerId(id, pageable));
    }

    // Fixed: now actually filters by brand id
    @GetMapping("/brand")
    public ResponseEntity<Page<Offer>> getOffersByBrand(
            @RequestParam int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(offerService.getOffersByBrandId(id, pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Offer> updateOfferStatus(
            @PathVariable int id,
            @Valid @RequestBody OfferUpdateRequest request) {
        return ResponseEntity.ok(offerService.updateOfferStatus(id, request.getStatus()));
    }
}