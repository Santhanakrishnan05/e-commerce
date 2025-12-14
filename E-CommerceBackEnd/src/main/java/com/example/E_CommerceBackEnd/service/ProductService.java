package com.example.E_CommerceBackEnd.service;

import com.example.E_CommerceBackEnd.dto.ProductRequest;
import com.example.E_CommerceBackEnd.dto.ProductResponse;
import com.example.E_CommerceBackEnd.model.Products;
import com.example.E_CommerceBackEnd.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    ProductRepo productRepo;

    // folder relative to project root (create if not exists)
    private final String UPLOAD_DIR = "uploads";

    public ProductService() {
        // Ensure upload dir exists
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            // If directory creation fails, you'll see errors on file upload later
            e.printStackTrace();
        }
    }

    // --- Util: convert CSV string to list (trim, remove empty) ---
    private List<String> csvToList(String csv) {
        if (csv == null) return Collections.emptyList();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    // --- Util: list to CSV ---
    private String listToCsv(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return list.stream().map(String::trim).collect(Collectors.joining(","));
    }

    // --- File save helper ---

    private String saveImageFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed!");
        }

        String original = Objects.requireNonNull(file.getOriginalFilename());
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx >= 0) ext = original.substring(idx);

        // Use absolute upload dir to avoid container-relative surprises
        Path uploadDirPath = Paths.get(UPLOAD_DIR).toAbsolutePath();
        // Ensure upload directory exists
        Files.createDirectories(uploadDirPath);

        String filename = System.currentTimeMillis() + ext;
        Path target = uploadDirPath.resolve(filename);

        // Ensure parent exists (defensive)
        if (target.getParent() != null) {
            Files.createDirectories(target.getParent());
        }

        // Use stream copy (more robust than transferTo across containers)
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        // return the filename (store relative filename in DB)
        return filename;
    }


    // --- GET all products (sorted by createdAt desc) ---
    public List<ProductResponse> getAllProducts() {
        List<Products> products = productRepo.findAll()
                .stream()
                .sorted(Comparator.comparing(Products::getCreatedAt).reversed())
                .collect(Collectors.toList());

        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // --- CREATE product ---
    @Transactional
    public ProductResponse createProduct(ProductRequest req, MultipartFile imageFile) throws IOException {
        Products p = new Products();
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setOriginalPrice(req.getOriginalPrice());
        p.setDiscountPrice(req.getDiscountPrice());
        p.setCategory(req.getCategory());

        // size/colors: either req.size (CSV string) or empty
        String sizeCsv = req.getSize() != null ? req.getSize() : "";
        p.setSize(sizeCsv);

        String colorsCsv = req.getColorsAvailable() != null ? req.getColorsAvailable() : "";
        p.setColorsAvailable(colorsCsv);

        p.setQuantity(req.getQuantity() != null ? req.getQuantity() : 0);

        if (imageFile != null && !imageFile.isEmpty()) {
            String saved = saveImageFile(imageFile);
            p.setImage(saved);
        }

        Products saved = productRepo.save(p);
        return toResponse(saved);
    }

    // --- UPDATE product ---
    @Transactional
    public ProductResponse updateProduct(Integer id, ProductRequest req, MultipartFile imageFile) throws IOException {
        Products existing = productRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found"));

        if (req.getName() != null) existing.setName(req.getName());
        if (req.getDescription() != null) existing.setDescription(req.getDescription());
        if (req.getOriginalPrice() != null) existing.setOriginalPrice(req.getOriginalPrice());
        if (req.getDiscountPrice() != null) existing.setDiscountPrice(req.getDiscountPrice());
        if (req.getCategory() != null) existing.setCategory(req.getCategory());

        if (req.getSize() != null) existing.setSize(req.getSize());
        if (req.getColorsAvailable() != null) existing.setColorsAvailable(req.getColorsAvailable());
        if (req.getQuantity() != null) existing.setQuantity(req.getQuantity());

        if (imageFile != null && !imageFile.isEmpty()) {
            String saved = saveImageFile(imageFile);
            existing.setImage(saved);
        }

        Products updated = productRepo.save(existing);
        return toResponse(updated);
    }

    // --- DELETE product ---
    public void deleteProduct(Integer id) {
        if (!productRepo.existsById(id)) {
            throw new NoSuchElementException("Product not found");
        }
        productRepo.deleteById(id);
    }

    // --- Map entity to DTO (convert CSV to List) ---
    private ProductResponse toResponse(Products p) {
        List<String> sizeList = csvToList(p.getSize());
        List<String> colorsList = csvToList(p.getColorsAvailable());

        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getOriginalPrice(),
                p.getDiscountPrice(),
                p.getCategory(),
                p.getImage(),
                sizeList,
                colorsList,
                p.getQuantity(),
                p.getCreatedAt()
        );
    }
}
