package com.wiki.config;

import com.wiki.entity.User;
import com.wiki.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String seedData = System.getenv("SEED_DATA");
            if (!"true".equalsIgnoreCase(seedData)) return;

            seedUser(userRepository, passwordEncoder, "admin@wiki.local", "Admin1234!", "Admin User", "admin");
            seedUser(userRepository, passwordEncoder, "editor@wiki.local", "Editor1234!", "Editor User", "editor");
            seedUser(userRepository, passwordEncoder, "viewer@wiki.local", "Viewer1234!", "Viewer User", "viewer");
        };
    }

    private void seedUser(UserRepository repo, PasswordEncoder encoder, String email, String password,
                           String name, String role) {
        if (!repo.existsByEmail(email)) {
            User user = new User();
            user.setEmail(email);
            user.setPasswordHash(encoder.encode(password));
            user.setName(name);
            user.setRole(role);
            repo.save(user);
        }
    }
}
