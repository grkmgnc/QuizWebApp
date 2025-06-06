package org.schoolproject.quizapp.repository;

import org.schoolproject.quizapp.entity.UserAnswers;
import org.schoolproject.quizapp.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswers, Long> {
    List<UserAnswers> findByUserId(Long userId);
}