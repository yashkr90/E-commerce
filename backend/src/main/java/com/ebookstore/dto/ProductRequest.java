package com.ebookstore.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    private String description;
    @NotNull @Positive
    private BigDecimal price;
    private Integer stockQuantity = 0;
    private String imageUrl;
    private Integer estimatedDeliveryDays = 5;
    @NotNull
    private Long categoryId;
    @NotNull
    private Long brandId;
}
