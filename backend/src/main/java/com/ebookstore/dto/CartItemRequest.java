package com.ebookstore.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class CartItemRequest {
    @NotNull
    private Long productId;
    @NotNull @Positive
    private Integer quantity;
}
