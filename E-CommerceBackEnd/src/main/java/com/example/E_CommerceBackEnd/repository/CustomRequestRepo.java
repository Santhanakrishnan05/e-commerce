package com.example.E_CommerceBackEnd.repository;

import com.example.E_CommerceBackEnd.model.CustomRequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomRequestRepo extends JpaRepository<CustomRequests, Integer> {
    List<CustomRequests> findByUserIdOrderByCreatedAtDesc(int userId);
}
