package org.schoolproject.quizapp.controller;

import org.schoolproject.quizapp.entity.Question;
import org.schoolproject.quizapp.entity.Quiz;
import org.schoolproject.quizapp.entity.QuizQuestion;
import org.schoolproject.quizapp.repository.QuestionRepository;
import org.schoolproject.quizapp.repository.QuizRepository;
import org.schoolproject.quizapp.service.QuizQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quiz-questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizQuestionController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizQuestionService quizQuestionService;

    @PostMapping("/assign")
    public ResponseEntity<String> assignQuestionToQuiz(
            @RequestParam Long quizId,
            @RequestParam Long questionId) {

        var quizOpt = quizRepository.findById(quizId);
        var questionOpt = questionRepository.findById(questionId);

        if (quizOpt.isEmpty() || questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            quizQuestionService.assignQuestionToQuiz(quizOpt.get(), questionOpt.get());
            return ResponseEntity.ok("Question assigned to quiz successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-quiz")
    public ResponseEntity<List<Question>> getQuestionsForQuiz(@RequestParam Long quizId) {
        var quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<QuizQuestion> quizQuestions = quizQuestionService.getQuestionsByQuiz(quizOpt.get());
        List<Question> questions = quizQuestions.stream()
                .map(QuizQuestion::getQuestion)
                .collect(Collectors.toList());

        return ResponseEntity.ok(questions);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeQuestionFromQuiz(
            @RequestParam Long quizId,
            @RequestParam Long questionId) {

        var quizOpt = quizRepository.findById(quizId);
        var questionOpt = questionRepository.findById(questionId);

        if (quizOpt.isEmpty() || questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        quizQuestionService.removeQuestionFromQuiz(quizOpt.get(), questionOpt.get());
        return ResponseEntity.ok("Question removed from quiz.");
    }
}
