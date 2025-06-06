package org.schoolproject.quizapp.controller;
import org.schoolproject.quizapp.dto.QuestionRequest;
import org.schoolproject.quizapp.entity.Question;
import org.schoolproject.quizapp.entity.Admin;
import org.schoolproject.quizapp.repository.QuestionRepository;
import org.schoolproject.quizapp.repository.UserRepository;
import org.schoolproject.quizapp.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createQuestion(@RequestBody QuestionRequest questionRequest, @RequestParam Long userId) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        var user = userOpt.get();
        if (!(user instanceof Admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can create questions.");
        }

        // DTO'dan Entity'ye dönüştürme
        Question question = new Question();
        question.setContent(questionRequest.getQuestionText());
        question.setOptionA(questionRequest.getOption1());
        question.setOptionB(questionRequest.getOption2());
        question.setOptionC(questionRequest.getOption3());
        question.setOptionD(questionRequest.getOption4());
        question.setCorrectAnswer(questionRequest.getCorrectOption());

        questionService.saveQuestion(question);
        return ResponseEntity.ok("Question created successfully.");
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionRequest updatedQuestionDto,
            @RequestParam Long userId) {

        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        if (!(userOpt.get() instanceof Admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can update questions.");
        }

        var existingQuestionOpt = questionRepository.findById(id);
        if (existingQuestionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found.");
        }

        var existing = existingQuestionOpt.get();
        existing.setContent(updatedQuestionDto.getQuestionText());
        existing.setOptionA(updatedQuestionDto.getOption1());
        existing.setOptionB(updatedQuestionDto.getOption2());
        existing.setOptionC(updatedQuestionDto.getOption3());
        existing.setOptionD(updatedQuestionDto.getOption4());
        existing.setCorrectAnswer(updatedQuestionDto.getCorrectOption());

        questionService.saveQuestion(existing);
        return ResponseEntity.ok("Question updated successfully.");
    }

    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        return ResponseEntity.ok(questionRepository.findAll());
    }

}
