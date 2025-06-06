package org.schoolproject.quizapp.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends Users {

    public Admin() {}

    public Admin(Long id, String username, String password, String email) {
        super(id, username, password, email);
    }
}