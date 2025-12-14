package com.example.E_CommerceBackEnd.repository;


import com.example.E_CommerceBackEnd.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository<Users, Integer> {
}
