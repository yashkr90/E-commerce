package com.ebookstore.dto;

import com.ebookstore.entity.Payment;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Data
public class PaymentRequest {
    @NotNull
    private Long orderId;
    @NotNull
    private Payment.PaymentMethod method;
    @NotNull @Positive
    private BigDecimal amount;
    private String cardNumber;
    private String cardHolderName;
    private Integer expiryMonth;
    private Integer expiryYear;
    private String cvv;
}
