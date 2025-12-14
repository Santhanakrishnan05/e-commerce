package com.example.E_CommerceBackEnd.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret:default-very-secret-key-change-this-to-a-real-one-of-32+chars}")
    private String jwtSecret;

    private final long jwtExpirationMs = 24 * 60 * 60 * 1000L;

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Integer userId, String email, String role){
        return Jwts.builder()
                .claim("userId", userId)
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> validateAndGetClaims(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    public Integer extractUserId(String token) {
        Claims claims = validateAndGetClaims(token).getBody();
        Number idNum = (Number) claims.get("userId");
        return idNum != null ? idNum.intValue() : null;
    }

    public String extractEmail(String token) {
        return validateAndGetClaims(token).getBody().get("email", String.class);
    }

    public String extractRole(String token) {
        return validateAndGetClaims(token).getBody().get("role", String.class);
    }
}
