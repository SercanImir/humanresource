package com.project.humanresource.config;

import com.project.humanresource.utility.UserStatus;
import io.jsonwebtoken.*;
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
    private String jwtSecret;         // Base64 formatında, en az 512‐bitlik bir secret

    private final String issuer = "Sercan IMIR";
    private final long expirationMillis = 1000L * 60 * 60 * 5; // 5 saat

    private Key hmacKey;

    @PostConstruct
    public void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("security.jwt.secret ayarı bulunamadı!");
        }
        // Base64 çöz, sonra HS512 için Key oluştur
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.hmacKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * userId, email, rollerle bir JWT üretir.
     */
    public String generateToken(Long userId, String email, List<String> roles ) {
        long now = System.currentTimeMillis();
        Date issuedAt   = new Date(now);
        Date expiresAt  = new Date(now + expirationMillis);

        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(email)
                .setIssuedAt(issuedAt)
                .setExpiration(expiresAt)
                // claim’lere id ve roller ekleyelim
                .claim("userId", userId)
                .claim("roles", roles)
                .signWith(hmacKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Token’dan email (subject) okur.
     */
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(hmacKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Token valid mi? (imza & süre)
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(hmacKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // expired, malformed, unsupported, signature invalid vs.
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(hmacKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("userId",Long.class);
    }
}
