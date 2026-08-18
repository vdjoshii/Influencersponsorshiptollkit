package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.DTO.InfluencerRequest;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Service.InfluencerService;
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
@RequestMapping(BASE_PATH + "/influencers")
@RequiredArgsConstructor
public class InfluencerController {
    private final InfluencerService influencerService;

    @GetMapping()
    public ResponseEntity<Page<Influencer>> getAllInfluencers(@RequestParam(defaultValue = "followers") String sort,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        Page<Influencer> influencers = influencerService.getAllInfluencers(pageable);
        return new ResponseEntity<>(influencers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Influencer> getInfluencerById(@PathVariable int id){
        Influencer influencer = influencerService.getInfluencerById(id);
        return new ResponseEntity<>(influencer, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Influencer> createInfluencer(@RequestBody InfluencerRequest request) {
        Influencer influencer = influencerService.createInfluencer(request);
        return new ResponseEntity<>(influencer, HttpStatus.CREATED);
    }
}
