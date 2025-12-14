package com.example.E_CommerceBackEnd.repository;

import com.example.E_CommerceBackEnd.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Orders, Integer> {
    List<Orders> findByUserIdOrderByCreatedAtDesc(int userId);
}
