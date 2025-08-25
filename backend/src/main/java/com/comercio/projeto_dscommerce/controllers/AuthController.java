package com.comercio.projeto_dscommerce.controllers;

import com.comercio.projeto_dscommerce.dto.LoginDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO dto) {
        if ("admin@teste.com".equals(dto.getUsername()) && "123".equals(dto.getPassword())) {
            return ResponseEntity.ok(Map.of(
                    "access_token", "fake-jwt-token",
                    "token_type", "Bearer"
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Credenciais inválidas"));
    }
}
