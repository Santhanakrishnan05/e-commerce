package com.example.E_CommerceBackEnd.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String userName;   // matches your Users.userName field
    private String email;
    private String password;
    private String address;
}
