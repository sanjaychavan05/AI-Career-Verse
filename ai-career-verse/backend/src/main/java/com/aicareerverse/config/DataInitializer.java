package com.aicareerverse.config;

import com.aicareerverse.model.GamificationEvent;
import com.aicareerverse.model.GamificationEvent.ActionType;
import com.aicareerverse.model.UserProfile;
import com.aicareerverse.model.UserRole;
import com.aicareerverse.repository.GamificationEventRepository;
import com.aicareerverse.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner seedData(UserProfileRepository userRepo,
                                GamificationEventRepository eventRepo) {
        return args -> {
            if (userRepo.count() > 0) {
                log.info("Database already seeded, skipping initialization.");
                return;
            }

            log.info("Seeding initial data...");

            // --- Arjun Mehta (STUDENT, primary user) ---
            UserProfile arjun = new UserProfile("Arjun Mehta", "arjun.mehta@email.com", "Python Full Stack Engineer", UserRole.STUDENT);
            arjun.setXp(12450);
            arjun.setStreak(23);
            arjun.setLevel(12);
            arjun.setLocation("India");
            arjun.setGithub("github.com/arjunmehta");
            arjun.setWebsite("arjunmehta.dev");
            arjun.setBio("Passionate Python Full Stack Developer building scalable web applications. Code Bharat 2025 finalist. Exploring AI/ML and system design.");
            arjun.setSkills("Python,Django,Flask,React.js,Node.js,PostgreSQL,Docker,JavaScript,Git,HTML/CSS,Tailwind CSS,MongoDB");
            arjun.setLastActiveDate(LocalDate.now());
            arjun.setCareerReadiness(85);
            userRepo.save(arjun);

            // --- Anusha M (MENTOR) ---
            UserProfile anusha = new UserProfile("Anusha M", "anusha.m@email.com", "Senior Full Stack Developer", UserRole.MENTOR);
            anusha.setXp(11200);
            anusha.setStreak(18);
            anusha.setLevel(11);
            anusha.setLocation("Bangalore, India");
            anusha.setSkills("React.js,Node.js,TypeScript,AWS,System Design,Python,Docker,Kubernetes,PostgreSQL,Redis");
            anusha.setLastActiveDate(LocalDate.now());
            anusha.setCareerReadiness(92);
            anusha.setBio("Senior developer at a FAANG company. Passionate about mentoring the next generation.");
            userRepo.save(anusha);

            // --- Rahul Patel (MENTOR) ---
            UserProfile rahul = new UserProfile("Rahul Patel", "rahul.patel@email.com", "Backend Engineer", UserRole.MENTOR);
            rahul.setXp(9800);
            rahul.setStreak(15);
            rahul.setLevel(10);
            rahul.setLocation("Mumbai, India");
            rahul.setSkills("Java,Spring Boot,Microservices,System Design,Kafka,PostgreSQL,Docker,AWS");
            rahul.setLastActiveDate(LocalDate.now());
            rahul.setCareerReadiness(88);
            rahul.setBio("Backend architect with 5+ years experience. Love breaking down complex system design.");
            userRepo.save(rahul);

            // --- Sneha Reddy (STUDENT) ---
            UserProfile sneha = new UserProfile("Sneha Reddy", "sneha.reddy@email.com", "DevOps Engineer", UserRole.STUDENT);
            sneha.setXp(8900);
            sneha.setStreak(12);
            sneha.setLevel(9);
            sneha.setSkills("Python,Docker,Kubernetes,Terraform,AWS,Linux,CI/CD,Ansible");
            sneha.setLastActiveDate(LocalDate.now());
            sneha.setCareerReadiness(79);
            userRepo.save(sneha);

            // --- Kavya Nair (STUDENT) ---
            UserProfile kavya = new UserProfile("Kavya Nair", "kavya.nair@email.com", "ML Engineer", UserRole.STUDENT);
            kavya.setXp(7600);
            kavya.setStreak(9);
            kavya.setLevel(8);
            kavya.setSkills("Python,TensorFlow,PyTorch,Pandas,NumPy,SQL,Docker,Flask");
            kavya.setLastActiveDate(LocalDate.now());
            kavya.setCareerReadiness(74);
            userRepo.save(kavya);

            // --- Prof. Manjunath Patil (TEACHER) ---
            UserProfile teacher = new UserProfile("Prof. Manjunath Patil", "manjunath.patil@email.com", "Professor - Computer Science", UserRole.TEACHER);
            teacher.setXp(5000);
            teacher.setStreak(30);
            teacher.setLevel(6);
            teacher.setSkills("Data Structures,Algorithms,System Design,Databases,Software Engineering");
            teacher.setLastActiveDate(LocalDate.now());
            teacher.setCareerReadiness(95);
            teacher.setBio("Professor of CS with 15 years experience. Head of Placement Cell.");
            userRepo.save(teacher);

            // Seed some gamification events for Arjun
            eventRepo.save(new GamificationEvent(1L, ActionType.ACHIEVEMENT, 500, "3rd Place — Code Bharat Hackathon 2025"));
            eventRepo.save(new GamificationEvent(1L, ActionType.GITHUB_SYNC, 50, "Synced GitHub repositories"));
            eventRepo.save(new GamificationEvent(1L, ActionType.INTERVIEW_COMPLETE, 200, "Completed Python mock interview"));
            eventRepo.save(new GamificationEvent(1L, ActionType.CAREER_DNA_ANALYSIS, 100, "Career DNA analysis completed"));
            eventRepo.save(new GamificationEvent(1L, ActionType.INTERVIEW_COMPLETE, 200, "Completed System Design interview"));
            eventRepo.save(new GamificationEvent(1L, ActionType.GITHUB_SYNC, 50, "Synced GitHub repositories"));

            log.info("Data seeding complete: {} users, {} events", userRepo.count(), eventRepo.count());
        };
    }
}
