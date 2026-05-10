package com.aicareerverse.controller;

import com.aicareerverse.model.GamificationEvent.ActionType;
import com.aicareerverse.service.GamificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    private final GamificationService gamificationService;

    public GamificationController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    /**
     * Get XP, streak, level, and recent activity for a user.
     */
    @GetMapping("/stats/{userId}")
    public ResponseEntity<?> getStats(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(gamificationService.getStats(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Award XP for an action.
     * Body: { "userId": 1, "action": "GITHUB_SYNC", "description": "Synced repos" }
     */
    @PostMapping("/award")
    public ResponseEntity<?> awardXP(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            ActionType action = ActionType.valueOf(request.get("action").toString());
            String description = (String) request.getOrDefault("description", "");

            Map<String, Object> result = gamificationService.awardXP(userId, action, description);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get leaderboard (all users ranked by XP).
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        return ResponseEntity.ok(gamificationService.getLeaderboard());
    }
}
