package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Service.BrandService;
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
@RequestMapping(BASE_PATH + "/brands")
public class BrandController {

    private final BrandService brandService;

    // Fixed: default sort is "name" — Brand has no "followers" field
    @GetMapping
    public ResponseEntity<Page<Brand>> getAllBrands(
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).ascending());
        return ResponseEntity.ok(brandService.getAllBrands(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable int id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand request) {
        return new ResponseEntity<>(brandService.createBrand(request), HttpStatus.CREATED);
    }
}