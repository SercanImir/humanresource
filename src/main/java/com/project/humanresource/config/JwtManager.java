package com.project.humanresource.config;


import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

import java.util.List;

@Component
public class JwtManager {
    @Value("${security.jwt.secret}")
    private String jwtSecret;

    private String issuer = "Sercan IMIR";
    private Long expirationDate = 1000L * 60 * 60 * 5;

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
