package com.example.E_CommerceBackEnd.service;

import com.example.E_CommerceBackEnd.dto.*;
import com.example.E_CommerceBackEnd.model.CustomRequests;
import com.example.E_CommerceBackEnd.model.Orders;
import com.example.E_CommerceBackEnd.model.Products;
import com.example.E_CommerceBackEnd.repository.CustomRequestRepo;
import com.example.E_CommerceBackEnd.repository.OrderRepo;
import com.example.E_CommerceBackEnd.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Integer.parseInt;

@Service
public class OrderService {

    @Autowired
    OrderRepo orderRepo;

    @Autowired
    CustomRequestRepo customRequestRepo;

    @Autowired
    ProductRepo productRepo; // <<-- used to enrich order responses

    private final String UPLOAD_DIR = "uploads";

    public OrderService() {
        try {
            Path p = Paths.get(UPLOAD_DIR).toAbsolutePath();
            if (!Files.exists(p)) Files.createDirectories(p);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // ---------------- Orders (enriched) ----------------

    public List<OrderResponse> getAllOrders() {
        List<Orders> orders = orderRepo.findAll().stream()
                .sorted(Comparator.comparing(Orders::getCreatedAt).reversed())
                .collect(Collectors.toList());

        // Prefetch products used by these orders
        Map<Integer, Products> productsMap = prefetchProducts(orders);

        return orders.stream()
                .map(o -> toEnrichedOrderResponse(o, productsMap.get(o.getProductId())))
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getUserOrders(Integer userId) {
        if (userId == null) return Collections.emptyList();
        List<Orders> orders = orderRepo.findByUserIdOrderByCreatedAtDesc(userId);

        Map<Integer, Products> productsMap = prefetchProducts(orders);

        return orders.stream()
                .map(o -> toEnrichedOrderResponse(o, productsMap.get(o.getProductId())))
                .collect(Collectors.toList());
    }

    public OrderResponse createOrder(OrderRequest req) {
        Orders o = new Orders();
        o.setUserId(req.getUserId() != null ? req.getUserId() : 0);
        o.setCustomRequestId(req.getCustomRequestId() != null ? req.getCustomRequestId() : 0);
        o.setProductId(req.getProductId() != null ? req.getProductId() : 0);
        o.setUserName(req.getUserName());
        o.setEmail(req.getEmail());
        o.setAddress(req.getAddress());
        o.setPayment(req.getPayment() != null ? req.getPayment() : "paid");
        o.setImage(req.getImage());
        o.setClothType(req.getClothType());
        o.setColor(req.getColor());
        o.setSize(req.getSize());
        o.setQuantity(req.getQuantity() != null ? req.getQuantity() : 1);
        o.setStatus(req.getStatus());
        o.setType(req.getType());
        Orders saved = orderRepo.save(o);

        // enrich with product if exists
        Products prod = productRepo.findById(saved.getProductId()).orElse(null);
        return toEnrichedOrderResponse(saved, prod);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Integer id, String status) {
        Orders o = orderRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Order not found"));
        o.setStatus(status);
        Orders saved = orderRepo.save(o);
        Products prod = productRepo.findById(saved.getProductId()).orElse(null);
        return toEnrichedOrderResponse(saved, prod);
    }

    public void deleteOrder(Integer id) {
        if (!orderRepo.existsById(id)) throw new NoSuchElementException("Order not found");
        orderRepo.deleteById(id);
    }

    // ---------------- Custom Requests (unchanged) ----------------

    public List<CustomRequestResponse> getAllCustomRequests() {
        return customRequestRepo.findAll().stream()
                .sorted(Comparator.comparing(CustomRequests::getCreatedAt).reversed())
                .map(this::toCustomResponse).collect(Collectors.toList());
    }

    public List<CustomRequestResponse> getUserCustomRequests(Integer userId) {
        if (userId == null) return Collections.emptyList();
        return customRequestRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toCustomResponse).collect(Collectors.toList());
    }

    public CustomRequestResponse createCustomRequest(CustomRequestCreateRequest req, MultipartFile imageFile) throws IOException {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String ct = imageFile.getContentType();
        if (ct == null || !ct.startsWith("image/")) throw new IllegalArgumentException("Only image files are allowed!");

        String filename = saveImageFile(imageFile);

        CustomRequests cr = new CustomRequests();
        cr.setUserId(req.getUserId() != null ? req.getUserId() : 0);
        cr.setUserName(req.getUserName());
        cr.setEmail(req.getEmail());
        cr.setAddress(req.getAddress());
        cr.setClothType(req.getClothType());
        cr.setImage(filename);
        cr.setColor(req.getColor());
        cr.setSize(req.getSize());
        cr.setQuantity(req.getQuantity() != null ? req.getQuantity() : 1);
        cr.setStatus("pending");
        cr.setType("customized");
        CustomRequests saved = customRequestRepo.save(cr);
        return toCustomResponse(saved);
    }

    @Transactional
    public CustomRequestResponse updateCustomRequest(Integer id, Map<String, Object> updates) {
        CustomRequests cr = customRequestRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Custom request not found"));

        if (updates.containsKey("status")) cr.setStatus((String) updates.get("status"));
        if (updates.containsKey("estimatedCost")) {
            Object val = updates.get("estimatedCost");
            if (val instanceof Number) cr.setEstimatedCost(((Number) val).intValue());
            else {
                try { cr.setEstimatedCost(parseInt(val.toString())); } catch (Exception ignored) {}
            }
        }
        // adminNotes/estimatedTime ignored unless you add fields

        CustomRequests saved = customRequestRepo.save(cr);
        return toCustomResponse(saved);
    }

    public void deleteCustomRequest(Integer id) {
        if (!customRequestRepo.existsById(id)) throw new NoSuchElementException("Custom request not found");
        customRequestRepo.deleteById(id);
    }

    // ---------------- Helpers ----------------

    private Map<Integer, Products> prefetchProducts(List<Orders> orders) {
        Set<Integer> prodIds = orders.stream()
                .map(Orders::getProductId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        if (prodIds.isEmpty()) return Collections.emptyMap();
        List<Products> products = productRepo.findAllById(prodIds);
        return products.stream().collect(Collectors.toMap(Products::getId, p -> p));
    }

    /**
     * Build enriched OrderResponse using order + optional product
     */
    private OrderResponse toEnrichedOrderResponse(Orders o, Products p) {
        String clothType = (p != null && p.getName() != null) ? p.getName() : "";
        // decide unit price: discountPrice if present else originalPrice
        int unitPrice = 0;
        if (p != null) {
            //String disc = p.getDiscountPrice();
            unitPrice = parseInt(p.getDiscountPrice());
        }
        int qty =  o.getQuantity();
        double amount = unitPrice * qty;

        String image = (p != null && p.getImage() != null) ? p.getImage() : "";
        if (o.getCustomRequestId() != 0){
            CustomRequests cr = customRequestRepo.findById(o.getCustomRequestId()).orElse(null);
            clothType = cr.getClothType();
            amount = cr.getEstimatedCost();
            image = cr.getImage();
        }

        return new OrderResponse(
                o.getId(),
                o.getUserId(),
                o.getUserName(),
                o.getEmail(),
                o.getAddress(),
                o.getProductId(),
                o.getPayment(),
                o.getColor(),
                o.getSize(),
                o.getQuantity(),
                o.getStatus(),
                o.getType(),
                o.getCreatedAt(),
                clothType,
                amount,
                image
        );
    }

    // parse price string safely (strip non-numeric chars)
    private double parsePrice(String priceStr) {
        if (priceStr == null) return 0.0;
        String cleaned = priceStr.replaceAll("[^0-9.\\-]", "").trim();
        if (cleaned.isEmpty()) return 0.0;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    // Save image method for custom requests (kept original behavior but ensuring directories)
    private String saveImageFile(MultipartFile file) throws IOException {
        String original = Objects.requireNonNull(file.getOriginalFilename());
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx >= 0) ext = original.substring(idx);
        String filename = System.currentTimeMillis() + ext;
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();
        Files.createDirectories(uploadPath);
        Path target = uploadPath.resolve(filename);

        // Use stream copy for reliability
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        return filename;
    }

    private CustomRequestResponse toCustomResponse(CustomRequests cr) {
        return new CustomRequestResponse(
                cr.getId(),
                cr.getUserId(),
                cr.getUserName(),
                cr.getEmail(),
                cr.getAddress(),
                cr.getClothType(),
                cr.getImage(),
                cr.getColor(),
                cr.getSize(),
                cr.getQuantity(),
                cr.getStatus(),
                cr.getType(),
                cr.getEstimatedCost(),
                cr.getCreatedAt()
        );
    }

}
