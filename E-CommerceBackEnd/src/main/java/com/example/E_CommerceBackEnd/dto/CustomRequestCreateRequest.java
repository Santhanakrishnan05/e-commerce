package com.example.E_CommerceBackEnd.dto;

import lombok.Data;

@Data
public class CustomRequestCreateRequest {

    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String clothType;   // NEW
    private String color;
    private String size;
    private Integer quantity;
}
