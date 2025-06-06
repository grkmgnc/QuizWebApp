package org.schoolproject.quizapp.controller;

import org.schoolproject.quizapp.entity.*;
import org.schoolproject.quizapp.repository.QuizQuestionRepository;
import org.schoolproject.quizapp.repository.UserAnswerRepository;
import org.schoolproject.quizapp.repository.UserRepository;
import org.schoolproject.quizapp.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Objects;

@RestController
@RequestMapping("/api/user-answers")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAnswerController {

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @PostMapping("/submit")
    public ResponseEntity<String> submitAnswer(@RequestBody UserAnswers answerDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // JWT'den "sub"

        Optional<Users> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı bulunamadı");
        }

        Users user = userOpt.get();
        if (!(user instanceof RegularUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sadece normal kullanıcılar yanıtlayabilir.");
        }

        //if (!user.getId().equals(answerDto.getUser().getId())) {
            //return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User ID mismatch."); }

        var questionOpt = questionRepository.findById(answerDto.getQuestion().getId());
        if (questionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Soru bulunamadı.");
        }

        answerDto.setUser(user);
        answerDto.setQuestion(questionOpt.get());
        userAnswerRepository.save(answerDto);
        return ResponseEntity.ok("Cevap başarıyla gönderildi.");
    }

    @GetMapping
    public ResponseEntity<?> getUserAnswers(@RequestParam(required = false) Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        Optional<Users> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Users currentUser = optionalUser.get();
        boolean isAdmin = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Eğer admin ise ve userId parametresi gönderilmemişse, tüm cevapları getir
        if (isAdmin && userId == null) {
            List<UserAnswers> allAnswers = userAnswerRepository.findAll();
            return ResponseEntity.ok(allAnswers);
        }

        // Admin değilse ve kendi userId'si dışında veri istiyorsa izin verme
        if (!isAdmin) {
            if (userId == null || !currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Erişim reddedildi.");
            }
        }


        // Belirli bir kullanıcıya ait cevapları getir
        List<UserAnswers> answers = userAnswerRepository.findByUserId(userId);
        return ResponseEntity.ok(answers);
    }
    @GetMapping("/user/solved-quizzes")
    public ResponseEntity<?> getSolvedQuizzes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Optional<Users> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Users currentUser = optionalUser.get();

        List<UserAnswers> userAnswers = userAnswerRepository.findByUserId(currentUser.getId());

        // Cevaplanan soruların ID'lerini al
        Set<Long> answeredQuestionIds = userAnswers.stream()
                .map(ua -> ua.getQuestion().getId())
                .collect(Collectors.toSet());

        // Bu sorulara karşılık gelen quizQuestion'lardan quiz'leri al
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuestionIdIn(answeredQuestionIds);

        Set<Quiz> solvedQuizzes = quizQuestions.stream()
                .map(QuizQuestion::getQuiz)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(solvedQuizzes);
    }


}