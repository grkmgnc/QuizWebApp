package org.schoolproject.quizapp.service;

import org.schoolproject.quizapp.entity.UserAnswers;
import org.schoolproject.quizapp.repository.UserAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAnswerService {

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    public UserAnswers saveAnswer(UserAnswers answer) {
        return userAnswerRepository.save(answer);
    }

    public UserAnswers getAnswerById(Long id) {
        return userAnswerRepository.findById(id).orElse(null);
    }
}