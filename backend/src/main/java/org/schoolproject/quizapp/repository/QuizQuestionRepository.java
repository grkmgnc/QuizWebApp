package org.schoolproject.quizapp.repository;

import org.schoolproject.quizapp.entity.Question;
import org.schoolproject.quizapp.entity.Quiz;
import org.schoolproject.quizapp.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    boolean existsByQuizAndQuestion(Quiz quiz, Question question);
    List<QuizQuestion> findByQuiz(Quiz quiz);
    Optional<QuizQuestion> findByQuizAndQuestion(Quiz quiz, Question question);
    List<QuizQuestion> findByQuiz_Id(Long quizId);
    List<QuizQuestion> findByQuestionIdIn(Set<Long> questionIds);
}