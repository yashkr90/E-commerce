package com.ebookstore.service;

import com.ebookstore.dto.BrandRequest;
import com.ebookstore.entity.Brand;
import com.ebookstore.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand createBrand(BrandRequest request) {
        Brand brand = Brand.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .build();
        return brandRepository.save(brand);
    }
}
