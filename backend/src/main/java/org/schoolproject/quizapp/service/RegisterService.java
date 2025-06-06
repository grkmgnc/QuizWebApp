package org.schoolproject.quizapp.service;

import org.schoolproject.quizapp.dto.RegisterDto;
import org.schoolproject.quizapp.entity.RegularUser;
import org.schoolproject.quizapp.entity.Users;
import org.schoolproject.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean register(RegisterDto dto) {
        // Kullanıcı adı veya e-posta zaten kayıtlı mı?
        boolean usernameExists = usersRepository.findByUsername(dto.getUsername()).isPresent();
        boolean emailExists = usersRepository.findByEmail(dto.getEmail()).isPresent();

        if (usernameExists || emailExists) {
            return false; // Kullanıcı zaten varsa kayıt iptal
        }


        // Şifreyi hashle
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // 👇 Normal User olarak kaydediyoruz
        RegularUser user = new RegularUser();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(encodedPassword);

        usersRepository.save(user); // user_type = "REGULAR" olarak kaydolur
        return true;
    }
}
