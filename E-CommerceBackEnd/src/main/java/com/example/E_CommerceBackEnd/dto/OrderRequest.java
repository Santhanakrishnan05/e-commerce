package com.example.E_CommerceBackEnd.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Integer userId;
    private Integer customRequestId;
    private String userName;
    private String email;
    private String address;
    private Integer productId;
    private String payment;
    private String image;
    private String clothType;
    private String color;
    private String size;
    private Integer quantity;
    private String status;
    private String type;
}
