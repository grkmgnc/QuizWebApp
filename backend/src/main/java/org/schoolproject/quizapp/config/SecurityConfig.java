package org.schoolproject.quizapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.POST, "/api/login", "/api/register").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/user-answers/submit").hasAnyRole("USER", "ADMIN")

                                // Quiz GET erişimi
                                .requestMatchers(HttpMethod.GET, "/api/quizzes", "/api/quizzes/**").hasAnyRole("USER", "ADMIN")

                                // Quiz oluşturma/silme sadece admin
                                .requestMatchers(HttpMethod.POST, "/api/quizzes/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/quizzes/**").hasRole("ADMIN")
                                .requestMatchers("/api/quizzes/**").hasRole("ADMIN")

                                // Kullanıcının quiz cevaplarını POST etmesine özel izin
                                .requestMatchers(HttpMethod.POST, "/api/user-answers", "/api/user-answers/submit").hasAnyRole("USER", "ADMIN")
                                // Regular user, solved quiz erişimi
                                .requestMatchers("/api/user-answers/user/solved-quizzes").hasRole("USER")
                                // Tüm user-answer erişimi
                                .requestMatchers("/api/user-answers/**").hasAnyRole("USER", "ADMIN")



                                // Sadece admin için sorular
                                .requestMatchers("/api/questions/**").hasRole("ADMIN")
                                .requestMatchers("/api/questions").hasRole("ADMIN")
                                .requestMatchers("/api/quiz-questions/**").hasRole("ADMIN")

                                // Diğer her şeyde kimlik doğrulama gerek
                                .anyRequest().authenticated()
                        //.anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                //.formLogin(form -> form.disable())
                //.httpBasic(basic -> basic.disable())
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
