package org.schoolproject.quizapp.entity;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("REGULAR")
public class RegularUser extends Users {

    public RegularUser() {}

    public RegularUser(Long id, String username, String password, String email) {
        super(id, username, password, email);
    }
}