package com.codequest.gatewayservice.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;

@Component
public class JwtUtil {

    // Must match the secret signing key used by your auth-service
    private static final String SECRET = "dGhpcy1pcy1hLXN1cGVyLXNlY3JldC1rZXktdGhhdC1pcy1hdC1sZWFzdC0yNTYtYml0cy1sb25nLWZvci1qd3Qtc2lnbmluZw==";

    public void validateToken(final String token) {
        Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token);
    }

    private Key getSignKey() {
        byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}