package com.aicareerverse.controller;

import com.aicareerverse.model.UserProfile;
import com.aicareerverse.repository.UserProfileRepository;
import com.aicareerverse.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final UserProfileRepository userRepo;

    public RoadmapController(RoadmapService roadmapService, UserProfileRepository userRepo) {
        this.roadmapService = roadmapService;
        this.userRepo = userRepo;
    }

    /**
     * Get dynamic roadmap based on user's actual skills (gap analysis).
     * Defaults to userId=1 (Arjun Mehta) if no param specified.
     */
    @GetMapping
    public ResponseEntity<?> getRoadmap(@RequestParam(defaultValue = "1") Long userId) {
        UserProfile user = userRepo.findById(userId).orElse(null);
        String skills = (user != null && user.getSkills() != null)
                ? user.getSkills()
                : "Python,Django,Flask,React.js,Node.js,PostgreSQL,Docker,JavaScript,Git";

        Map<String, Object> roadmap = roadmapService.analyzeGaps(skills);
        return ResponseEntity.ok(roadmap);
    }

    /**
     * Run gap analysis with custom skill set (for preview/testing).
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeGaps(@RequestBody Map<String, String> body) {
        String skills = body.getOrDefault("skills", "");
        return ResponseEntity.ok(roadmapService.analyzeGaps(skills));
    }
}
