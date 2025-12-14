package com.example.E_CommerceBackEnd.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
public class CustomRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;
    private String userName;
    private String email;
    private String address;
    private String clothType;   // ✅ ADD THIS
    private String image;
    private String color;
    private String size;
    private int quantity;
    private String status;
    private String type = "customized";
    private int estimatedCost;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

