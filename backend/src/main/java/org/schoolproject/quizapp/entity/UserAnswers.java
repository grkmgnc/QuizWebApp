package org.schoolproject.quizapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "user_answers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserAnswers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"userAnswers", "quizzes", "password"})
    private Users user;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnoreProperties({"quizQuestions"})
    private Question question;

    @Column(name = "selected_option")
    private Integer selectedOption;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Integer getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(Integer selectedOption) {
        this.selectedOption = selectedOption;
    }
}
