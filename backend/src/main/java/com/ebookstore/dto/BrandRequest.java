package com.ebookstore.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class BrandRequest {
    @NotBlank
    private String name;
    private String logoUrl;
}
