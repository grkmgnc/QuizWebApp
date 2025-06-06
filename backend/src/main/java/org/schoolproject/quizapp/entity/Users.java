package org.schoolproject.quizapp.entity;

import jakarta.persistence.*;

//@Entity
//@Table(name = "users")
//@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
public class Users extends UserAbstract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Users() {}

    public Users(Long id, String username, String password, String email) {
        super(username, password, email);
        this.id = id;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Override
    @Column(unique = true, nullable = false)
    public String getUsername() {
        return super.getUsername();
    }

    @Override
    @Column(unique = true, nullable = false)
    public String getEmail() {
        return super.getEmail();
    }
}