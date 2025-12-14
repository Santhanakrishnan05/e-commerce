package com.example.E_CommerceBackEnd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String userName;
    private String email;
    private String address;
    private String role;
}
