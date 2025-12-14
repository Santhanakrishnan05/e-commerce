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
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;
    private int customRequestId;
    private String userName;
    private String email;
    private String address;
    private int productId;
    private String payment = "paid";
    private String image;
    private String clothType;
    private String color;
    private String size;
    private int quantity;
    private String status;
    private String type;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
