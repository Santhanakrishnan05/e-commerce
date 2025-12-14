package com.example.E_CommerceBackEnd.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String originalPrice;
    private String discountPrice;
    private String category;
    private String size;
    private String colorsAvailable;
    private Integer quantity;
}
