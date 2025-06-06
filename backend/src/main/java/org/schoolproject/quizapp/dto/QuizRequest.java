package org.schoolproject.quizapp.dto;

import java.util.List;

public class QuizRequest {
    private String quizName;
    private List<QuestionRequest> questions;

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public List<QuestionRequest> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionRequest> questions) {
        this.questions = questions;
    }
}
