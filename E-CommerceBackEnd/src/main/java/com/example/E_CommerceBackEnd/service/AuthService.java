package com.example.E_CommerceBackEnd.service;

import com.example.E_CommerceBackEnd.dto.*;
import com.example.E_CommerceBackEnd.model.Users;
import com.example.E_CommerceBackEnd.repository.AuthRepo;
import com.example.E_CommerceBackEnd.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    AuthRepo authRepo;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;


    public AuthResponse register(RegisterRequest req) {
        Optional<Users> existing = authRepo.findByEmail(req.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }

        String hashed = passwordEncoder.encode(req.getPassword());

        Users user = new Users();
        user.setUserName(req.getUserName());
        user.setEmail(req.getEmail());
        user.setPassword(hashed);
        user.setAddress(req.getAddress());
        user.setRole("user");

        Users saved = authRepo.save(user);

        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getRole());

        UserResponse userResp = new UserResponse(
                saved.getId(),
                saved.getUserName(),
                saved.getEmail(),
                saved.getAddress(),
                saved.getRole()
        );

        return new AuthResponse("User created successfully", token, userResp);
    }

    public AuthResponse login(LoginRequest req) {
        Users user = authRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        boolean matches = passwordEncoder.matches(req.getPassword(), user.getPassword());
        if (!matches) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        UserResponse userResp = new UserResponse(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getAddress(),
                user.getRole()
        );

        return new AuthResponse("Login successful", token, userResp);
    }

    public UserResponse getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new SecurityException("Access denied. No token provided.");
        }
        String token = authHeader.substring(7);
        try {
            Integer userId = jwtUtil.extractUserId(token);
            if (userId == null) throw new SecurityException("Invalid token.");
            Users user = authRepo.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            return new UserResponse(user.getId(), user.getUserName(), user.getEmail(), user.getAddress(), user.getRole());
        } catch (io.jsonwebtoken.JwtException ex) {
            throw new SecurityException("Invalid token.");
        }
    }

}
