package org.schoolproject.quizapp.service;

import org.schoolproject.quizapp.entity.Quiz;
import org.schoolproject.quizapp.entity.Question;
import org.schoolproject.quizapp.entity.QuizQuestion;
import org.schoolproject.quizapp.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizQuestionService {

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    public List<QuizQuestion> getQuestionsByQuiz(Quiz quiz) {
        return quizQuestionRepository.findByQuiz(quiz);
    }

    public void removeQuestionFromQuiz(Quiz quiz, Question question) {
        Optional<QuizQuestion> existing = quizQuestionRepository.findByQuizAndQuestion(quiz, question);
        existing.ifPresent(quizQuestionRepository::delete);
    }
    public List<Question> getQuestionsByQuizId(Long quizId) {
        System.out.println("Gelen quizId: " + quizId);
        Quiz quiz = new Quiz();
        quiz.setId(quizId);                    //sadece ID veriyoruz

        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuiz(quiz);
        System.out.println("Gelen QuizQuestion listesi: " + quizQuestions.size());
        for (QuizQuestion q : quizQuestions) {
            System.out.println("Quiz ID: " + q.getQuiz().getId());
            System.out.println("Question: " + q.getQuestion().getContent());
        }

        List<Question> questions = new ArrayList<>();

        for (QuizQuestion qq : quizQuestions) {
            questions.add(qq.getQuestion());
        }

        return questions;
    }
    public QuizQuestion assignQuestionToQuiz(Quiz quiz, Question question) {
        Optional<QuizQuestion> existing = quizQuestionRepository.findByQuizAndQuestion(quiz, question);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("This question is already assigned to the quiz.");
        }

        QuizQuestion qq = new QuizQuestion();
        qq.setQuiz(quiz);
        qq.setQuestion(question);
        return quizQuestionRepository.save(qq);
    }
}