package org.schoolproject.quizapp.controller;

import org.schoolproject.quizapp.dto.QuizRequest;
import org.schoolproject.quizapp.dto.QuestionRequest;
import org.schoolproject.quizapp.entity.Question;
import org.schoolproject.quizapp.entity.Quiz;
import org.schoolproject.quizapp.entity.Admin;
import org.schoolproject.quizapp.entity.QuizQuestion;
import org.schoolproject.quizapp.repository.QuestionRepository;
import org.schoolproject.quizapp.repository.QuizRepository;
import org.schoolproject.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.schoolproject.quizapp.service.QuizQuestionService;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    @Autowired private QuizRepository quizRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuizQuestionService quizQuestionService;

    @PostMapping("/generate")
    public ResponseEntity<String> createQuiz(@RequestBody QuizRequest request, @RequestParam Long userId) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        var user = userOpt.get();
        if (!(user instanceof Admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can generate quizzes.");
        }

        Quiz quiz = new Quiz();
        quiz.setName(request.getQuizName());
        quiz.setDescription("Created by admin");

        //quizRepository.save(quiz); // quiz'i önce kaydet
        quizRepository.saveAndFlush(quiz);
        // Soruları kaydet

        // 1-4 -> A-D eşlemesi
//            switch (q.getCorrectOption()) {
//                case 1 -> question.setCorrectAnswer("A");
//                case 2 -> question.setCorrectAnswer("B");
//                case 3 -> question.setCorrectAnswer("C");
//                case 4 -> question.setCorrectAnswer("D");
//                default -> question.setCorrectAnswer("A");
//            }
        for (QuestionRequest q : request.getQuestions()) {
            Question question = mapToEntity(q);
            questionRepository.save(question);
            quizQuestionService.assignQuestionToQuiz(quiz, question);
        }
        return ResponseEntity.ok("Quiz and questions created.");
    }
    private Question mapToEntity(QuestionRequest dto) {
        Question question = new Question();
        question.setContent(dto.getQuestionText());
        question.setOptionA(dto.getOption1());
        question.setOptionB(dto.getOption2());
        question.setOptionC(dto.getOption3());
        question.setOptionD(dto.getOption4());
        question.setCorrectAnswer(dto.getCorrectOption());
        return question;
    }


    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return ResponseEntity.ok(quizzes);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        if (!quizRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Quiz not found.");
        }

        quizRepository.deleteById(id);
        return ResponseEntity.ok("Quiz deleted.");
    }
    @GetMapping("/getQuizQuestById/{quizId}")
    public ResponseEntity<List<Question>> getQuizQuestionsById(@PathVariable Long quizId) {
        List<Question> questions = quizQuestionService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }
}