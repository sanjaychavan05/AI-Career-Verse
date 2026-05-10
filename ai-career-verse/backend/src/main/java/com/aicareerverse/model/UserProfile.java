package com.aicareerverse.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String title;
    private String location;
    private String github;
    private String website;
    private String bio;

    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int streak = 0;

    @Column(nullable = false)
    private int level = 1;

    private LocalDate lastActiveDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.STUDENT;

    /** Comma-separated list of technical skills */
    @Column(length = 2000)
    private String skills;

    private int careerReadiness = 85;

    // --- Constructors ---
    public UserProfile() {}

    public UserProfile(String name, String email, String title, UserRole role) {
        this.name = name;
        this.email = email;
        this.title = title;
        this.role = role;
        this.lastActiveDate = LocalDate.now();
    }

    // --- Getters / Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public LocalDate getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDate lastActiveDate) { this.lastActiveDate = lastActiveDate; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public int getCareerReadiness() { return careerReadiness; }
    public void setCareerReadiness(int careerReadiness) { this.careerReadiness = careerReadiness; }

    /** Recalculate level from XP (every 1000 XP = 1 level) */
    public void recalculateLevel() {
        this.level = 1 + (this.xp / 1000);
    }
}
