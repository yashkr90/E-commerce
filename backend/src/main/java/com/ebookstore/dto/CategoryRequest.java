package com.ebookstore.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CategoryRequest {
    @NotBlank
    private String name;
    private String description;
    private String imageUrl;
}
