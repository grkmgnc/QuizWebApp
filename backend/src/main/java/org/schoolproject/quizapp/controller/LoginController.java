package org.schoolproject.quizapp.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.schoolproject.quizapp.entity.Users;
import org.schoolproject.quizapp.entity.Admin;
import org.schoolproject.quizapp.entity.RegularUser;
import org.schoolproject.quizapp.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepo;

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credential) {
        String username = credential.get("username");
        String password = credential.get("password");

        Optional<Users> userByUname = userRepo.findByUsername(username);

        if (userByUname.isPresent()) {
            Users user = userByUname.get();

            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = generateToken(user);
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Geçersiz kullanıcı adı veya şifre");
    }

    private String generateToken(Users user) {
        String role = (user instanceof Admin) ? "ADMIN" :
                (user instanceof RegularUser) ? "USER" : "UNKNOWN";

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 saat
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes()) // 👍 byte[] kullan!
                .compact();
    }
}