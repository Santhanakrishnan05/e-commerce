package com.example.E_CommerceBackEnd.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Entity
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String name;
    String description;
    String originalPrice;
    String discountPrice;
    String category;
    String image;

    @Column(columnDefinition = "TEXT")
    String size;
    @Column(columnDefinition = "TEXT")
    String colorsAvailable;
    int quantity;

    @CreationTimestamp
    LocalDateTime createdAt;
}
