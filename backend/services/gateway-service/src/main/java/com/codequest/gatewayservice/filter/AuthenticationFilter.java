package com.codequest.gatewayservice.filter;

import com.codequest.gatewayservice.util.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.List;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;

    public AuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    public static class Config {}

    // Endpoints that do not require login tokens
    private final List<String> openApiEndpoints = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/token"
    );

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 0. Let CORS OPTIONS requests pass through
            if (request.getMethod().name().equals("OPTIONS")) {
                return chain.filter(exchange);
            }

            // 1. If it's a public endpoint, let it pass right through
            if (openApiEndpoints.stream().anyMatch(uri -> request.getURI().getPath().contains(uri))) {
                return chain.filter(exchange);
            }

            // 2. Check if the Authorization Header exists
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid Authorization Header Format", HttpStatus.UNAUTHORIZED);
            }

            // 3. Extract and validate JWT
            String token = authHeader.substring(7);
            try {
                jwtUtil.validateToken(token);
            } catch (Exception e) {
                return onError(exchange, "Unauthorized access - Invalid Token", HttpStatus.UNAUTHORIZED);
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }
}