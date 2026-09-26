package com.ebookstore.service;

import com.ebookstore.dto.ProductRequest;
import com.ebookstore.entity.*;
import com.ebookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public Page<Product> getProducts(Long categoryId, Long brandId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search != null && !search.isBlank()) {
            return productRepository.searchProducts(search, pageable);
        }
        if (categoryId != null && brandId != null) {
            return productRepository.findByCategoryIdAndBrandId(categoryId, brandId, pageable);
        }
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageable);
        }
        if (brandId != null) {
            return productRepository.findByBrandId(brandId, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public List<Product> getRelatedProducts(Long productId) {
        Product product = getProductById(productId);
        return productRepository.findByCategoryIdAndIdNot(product.getCategory().getId(), productId);
    }

    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        Product product = Product.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .estimatedDeliveryDays(request.getEstimatedDeliveryDays())
                .category(category)
                .brand(brand)
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        product.setTitle(request.getTitle());
        product.setAuthor(request.getAuthor());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setEstimatedDeliveryDays(request.getEstimatedDeliveryDays());
        product.setCategory(category);
        product.setBrand(brand);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getRecommendations(Long userId) {
        List<Product> recommended = productRepository.findRecommendedProductsByUserId(userId);
        if (recommended.isEmpty()) {
            return productRepository.findAll(PageRequest.of(0, 6)).getContent();
        }
        return recommended;
    }
}
