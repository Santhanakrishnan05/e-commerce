package com.example.E_CommerceBackEnd.contoller;

import com.example.E_CommerceBackEnd.dto.ProductRequest;
import com.example.E_CommerceBackEnd.dto.ProductResponse;
import com.example.E_CommerceBackEnd.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ModelAttribute;


import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService productService;

    // GET all products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Create product
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @ModelAttribute ProductRequest productRequest,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            System.out.println("[DEBUG] createProduct called. image="
                    + (image != null ? image.getOriginalFilename() : "null")
                    + ", productRequest=" + productRequest);
            ProductResponse response = productService.createProduct(productRequest == null ? new ProductRequest() : productRequest, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Product created successfully", "product", response));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "File upload error", "details", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // <-- VERY IMPORTANT: print stacktrace so we can see root cause
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error", "details", e.getMessage()));
        }
    }


    // Update product

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductRequest productRequest,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            System.out.println("[DEBUG] updateProduct called. id=" + id
                    + ", image=" + (image != null ? image.getOriginalFilename() : "null")
                    + ", productRequest=" + productRequest);
            ProductResponse response = productService.updateProduct(id,
                    productRequest == null ? new ProductRequest() : productRequest,
                    image);
            return ResponseEntity.ok(Map.of("message", "Product updated successfully", "product", response));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "File upload error", "details", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error", "details", e.getMessage()));
        }
    }


    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }
}
