package com.ebookstore.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
public class OrderRequest {
    @NotNull
    private Long userId;
    @NotNull
    private Long addressId;
    private Integer giftPointsToRedeem = 0;
    @NotNull
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;
        @NotNull
        private Integer quantity;
    }
}
