package com.example.E_CommerceBackEnd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Integer id;
    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private Integer productId;

    // Existing fields
    private String payment;
    private String color;
    private String size;
    private Integer quantity;
    private String status;
    private String type;
    private LocalDateTime createdAt;

    // New/enriched fields for UI
    private String clothType;    // product.name
    private Double amount;       // quantity * price
    private String image;       // product.image or product.designLink
}
