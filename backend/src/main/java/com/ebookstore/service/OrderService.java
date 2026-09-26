package com.ebookstore.service;

import com.ebookstore.dto.OrderRequest;
import com.ebookstore.entity.*;
import com.ebookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found: " + request.getAddressId()));

        Order order = Order.builder()
                .user(user)
                .address(address)
                .giftPointsUsed(request.getGiftPointsToRedeem())
                .status(Order.OrderStatus.CONFIRMED)
                .estimatedDeliveryDate(LocalDate.now().plusDays(5))
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            order.getItems().add(orderItem);
            total = total.add(orderItem.getSubtotal());
        }

        // Deduct gift points discount (1 point = $0.01)
        int pointsUsed = request.getGiftPointsToRedeem() != null ? request.getGiftPointsToRedeem() : 0;
        if (pointsUsed > 0 && pointsUsed <= user.getGiftPoints()) {
            BigDecimal discount = BigDecimal.valueOf(pointsUsed).multiply(new BigDecimal("0.01"));
            total = total.subtract(discount).max(BigDecimal.ZERO);
            user.setGiftPoints(user.getGiftPoints() - pointsUsed);
            userRepository.save(user);
        }

        // Earn 1 gift point per $1 spent
        int earnedPoints = total.intValue();
        user.setGiftPoints(user.getGiftPoints() + earnedPoints);
        userRepository.save(user);

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getCreatedAt().isBefore(LocalDateTime.now().minusHours(48))) {
            throw new RuntimeException("Cannot cancel order after 48 hours");
        }
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}
