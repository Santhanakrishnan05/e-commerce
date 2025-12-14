package com.example.E_CommerceBackEnd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ProductResponse {
    private Integer id;
    private String name;
    private String description;
    private String originalPrice;
    private String discountPrice;
    private String category;
    private String image;
    private List<String> size;
    private List<String> colorsAvailable;
    private Integer quantity;
    private LocalDateTime createdAt;
}
