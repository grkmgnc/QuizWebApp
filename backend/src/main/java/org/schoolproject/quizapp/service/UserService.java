package org.schoolproject.quizapp.service;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import org.schoolproject.quizapp.entity.Users;
import org.schoolproject.quizapp.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Users validateLogin(String username, String password) {
        return userRepository.findByUsername(username).stream()
                .filter(u -> u.getPassword().equals(password))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Invalid credentials"));
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users saveUser(Users user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}