package com.project.humanresource.config;


import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import java.util.List;

@Component
public class JwtManager {
    @Value("${security.jwt.secret}")
    private String jwtSecret;

    private String issuer = "Sercan IMIR";
    private Long expirationDate = 1000L * 60 * 60 * 5;
    private String base64Secret;

    private Key hmacKey;

    @PostConstruct
    public void init() {
        if (base64Secret == null || base64Secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET environment variable is not set!");
        }

        byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
        this.hmacKey = Keys.hmacShaKeyFor(keyBytes);
    }



    public String generateToken(Long userId, String email, List<String> roles){

        Long now = System.currentTimeMillis();
        Date issureAt = new Date(now);
        Date expiration = new Date(now + expirationDate);

        return Jwts.builder()
                .setSubject(email)
                .setIssuer(issuer)
                .setIssuedAt(issureAt)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS512,jwtSecret)
                .compact();
    }

    /**
     * Token’dan subject (email) bilgisini okur.
     */
    public String getEmailFromToken(String token){
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Token’ın imza ve süre bazlı geçerliliğini kontrol eder.
     */
    public boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        }catch (JwtException | IllegalArgumentException e){
            return false;
        }
    }
}
