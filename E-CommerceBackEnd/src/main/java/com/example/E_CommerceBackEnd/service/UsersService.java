package com.example.E_CommerceBackEnd.service;

import com.example.E_CommerceBackEnd.dto.RoleUpdateRequest;
import com.example.E_CommerceBackEnd.dto.UpdateUserRequest;
import com.example.E_CommerceBackEnd.dto.UserResponse;
import com.example.E_CommerceBackEnd.model.Users;
import com.example.E_CommerceBackEnd.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class UsersService {

    @Autowired
    UsersRepo UsersRepo;

    @Autowired
    BCryptPasswordEncoder passwordEncoder; // ensure bean exists

    private UserResponse toResponse(Users u) {
        // map Users -> UserResponse (note field name differences: userName -> username)
        return new UserResponse(
                u.getId(),                // userId
                u.getUserName(),          // username
                u.getEmail(),
                u.getAddress(),
                u.getRole()
        );
    }

    public List<UserResponse> getAllUsers() {
        return UsersRepo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUser(Integer id, UpdateUserRequest req) {
        Users user = UsersRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));

        if (req.getUserName() != null) user.setUserName(req.getUserName());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getAddress() != null) user.setAddress(req.getAddress());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            String hashed = passwordEncoder.encode(req.getPassword());
            user.setPassword(hashed);
        }

        Users saved = UsersRepo.save(user);
        return toResponse(saved);
    }

    public void deleteUser(Integer id) {
        if (!UsersRepo.existsById(id)) throw new NoSuchElementException("User not found");
        UsersRepo.deleteById(id);
    }

    @Transactional
    public UserResponse updateUserRole(Integer id, RoleUpdateRequest req) {
        String newRole = req.getRole();
        if (newRole == null || (!newRole.equals("user") && !newRole.equals("admin"))) {
            throw new IllegalArgumentException("Invalid role");
        }

        Users user = UsersRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setRole(newRole);
        Users saved = UsersRepo.save(user);
        return toResponse(saved);
    }
}
