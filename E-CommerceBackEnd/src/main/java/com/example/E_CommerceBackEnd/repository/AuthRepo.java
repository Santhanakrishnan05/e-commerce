package com.example.E_CommerceBackEnd.repository;

import com.example.E_CommerceBackEnd.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepo extends JpaRepository<Users, Integer> {
    Optional<Users> findByEmail(String email);
}
