package com.example.E_CommerceBackEnd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CustomRequestResponse {

    private Integer id;
    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String clothType;  // ✅
    private String image;
    private String color;
    private String size;
    private Integer quantity;
    private String status;
    private String type;
    private Integer estimatedCost;
    private LocalDateTime createdAt;
}
