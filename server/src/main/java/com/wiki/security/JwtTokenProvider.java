package com.wiki.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expires-in}")
    private String expiresIn;

    private SecretKey getKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        byte[] padded = Arrays.copyOf(keyBytes, 64);
        return Keys.hmacShaKeyFor(padded);
    }

    private long parseExpiryMs(String value) {
        if (value.endsWith("d")) return Long.parseLong(value.replace("d", "")) * 86400_000L;
        if (value.endsWith("h")) return Long.parseLong(value.replace("h", "")) * 3600_000L;
        if (value.endsWith("m")) return Long.parseLong(value.replace("m", "")) * 60_000L;
        return Long.parseLong(value) * 1000L;
    }

    public String createToken(UUID userId, String role) {
        long expiryMs = parseExpiryMs(expiresIn);
        return Jwts.builder()
                .subject(userId.toString())
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiryMs))
                .signWith(getKey())
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
