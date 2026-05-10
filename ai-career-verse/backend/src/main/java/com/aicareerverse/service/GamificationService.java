package com.aicareerverse.service;

import com.aicareerverse.model.GamificationEvent;
import com.aicareerverse.model.GamificationEvent.ActionType;
import com.aicareerverse.model.UserProfile;
import com.aicareerverse.repository.GamificationEventRepository;
import com.aicareerverse.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GamificationService {

    private static final Logger log = LoggerFactory.getLogger(GamificationService.class);

    /** XP values per action type */
    private static final Map<ActionType, Integer> XP_MAP = Map.of(
            ActionType.GITHUB_SYNC, 50,
            ActionType.INTERVIEW_COMPLETE, 200,
            ActionType.CAREER_DNA_ANALYSIS, 100,
            ActionType.COURSE_COMPLETE, 75
    );

    private final UserProfileRepository userRepo;
    private final GamificationEventRepository eventRepo;

    public GamificationService(UserProfileRepository userRepo,
                                GamificationEventRepository eventRepo) {
        this.userRepo = userRepo;
        this.eventRepo = eventRepo;
    }

    /**
     * Award XP for a specific action. Updates streak if needed.
     */
    @Transactional
    public Map<String, Object> awardXP(Long userId, ActionType action, String description) {
        UserProfile user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        int xpAmount = XP_MAP.getOrDefault(action, 0);

        // Special case: achievements carry custom XP
        if (action == ActionType.ACHIEVEMENT && description != null && description.contains(":")) {
            try {
                xpAmount = Integer.parseInt(description.split(":")[0].trim());
                description = description.substring(description.indexOf(":") + 1).trim();
            } catch (NumberFormatException ignored) {}
        }

        // Award XP
        user.setXp(user.getXp() + xpAmount);
        user.recalculateLevel();

        // Update streak
        updateStreak(user);

        userRepo.save(user);

        // Record event
        GamificationEvent event = new GamificationEvent(userId, action, xpAmount, description);
        eventRepo.save(event);

        log.info("Awarded {} XP to user {} for {}", xpAmount, userId, action);

        return Map.of(
                "xp", user.getXp(),
                "level", user.getLevel(),
                "streak", user.getStreak(),
                "xpEarned", xpAmount,
                "action", action.name()
        );
    }

    /**
     * Get gamification stats for a user.
     */
    public Map<String, Object> getStats(Long userId) {
        UserProfile user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<GamificationEvent> recentEvents = eventRepo.findTop20ByUserIdOrderByTimestampDesc(userId);

        List<Map<String, Object>> eventMaps = recentEvents.stream()
                .map(e -> Map.<String, Object>of(
                        "action", e.getAction().name(),
                        "xpEarned", e.getXpEarned(),
                        "description", e.getDescription() != null ? e.getDescription() : "",
                        "timestamp", e.getTimestamp().toString()
                ))
                .collect(Collectors.toList());

        return Map.of(
                "xp", user.getXp(),
                "level", user.getLevel(),
                "streak", user.getStreak(),
                "name", user.getName(),
                "role", user.getRole().name(),
                "careerReadiness", user.getCareerReadiness(),
                "recentEvents", eventMaps
        );
    }

    /**
     * Get leaderboard sorted by XP.
     */
    public List<Map<String, Object>> getLeaderboard() {
        return userRepo.findAllByOrderByXpDesc().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "name", u.getName(),
                        "xp", u.getXp(),
                        "streak", u.getStreak(),
                        "level", u.getLevel(),
                        "role", u.getRole().name(),
                        "careerReadiness", u.getCareerReadiness()
                ))
                .collect(Collectors.toList());
    }

    private void updateStreak(UserProfile user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null || ChronoUnit.DAYS.between(lastActive, today) > 1) {
            // Streak broken or first activity
            user.setStreak(1);
        } else if (ChronoUnit.DAYS.between(lastActive, today) == 1) {
            // Consecutive day
            user.setStreak(user.getStreak() + 1);
        }
        // Same day = no change
        user.setLastActiveDate(today);
    }
}
