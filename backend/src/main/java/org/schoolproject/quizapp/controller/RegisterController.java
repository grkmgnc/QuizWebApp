package org.schoolproject.quizapp.controller;

import org.schoolproject.quizapp.dto.RegisterDto;
import org.schoolproject.quizapp.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // React frontend erişebilsin diye
public class RegisterController {

    @Autowired
    private RegisterService registerService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterDto dto) {
        System.out.println(">>> Kayıt isteği geldi: " + dto.getUsername());
        boolean success = registerService.register(dto);
        if (success) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Kayıt başarılı");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Kullanıcı adı veya email adresi zaten var");
        }
    }
}
