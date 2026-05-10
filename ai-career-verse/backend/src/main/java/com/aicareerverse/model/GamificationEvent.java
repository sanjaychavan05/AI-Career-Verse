package com.aicareerverse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gamification_events")
public class GamificationEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType action;

    @Column(nullable = false)
    private int xpEarned;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String description;

    // --- Constructors ---
    public GamificationEvent() {}

    public GamificationEvent(Long userId, ActionType action, int xpEarned, String description) {
        this.userId = userId;
        this.action = action;
        this.xpEarned = xpEarned;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    // --- Getters / Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public ActionType getAction() { return action; }
    public void setAction(ActionType action) { this.action = action; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public enum ActionType {
        GITHUB_SYNC,       // +50 XP
        INTERVIEW_COMPLETE, // +200 XP
        CAREER_DNA_ANALYSIS, // +100 XP
        ACHIEVEMENT,       // variable XP
        COURSE_COMPLETE    // +75 XP
    }
}
