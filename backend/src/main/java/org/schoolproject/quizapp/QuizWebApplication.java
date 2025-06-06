package org.schoolproject.quizapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@EntityScan(basePackages = "org.schoolproject.quizapp.entity")
@SpringBootApplication
public class QuizWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizWebApplication.class, args);
    }
}