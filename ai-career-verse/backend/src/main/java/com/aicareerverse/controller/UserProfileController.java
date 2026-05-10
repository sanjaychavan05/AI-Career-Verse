package com.aicareerverse.controller;

import com.aicareerverse.model.UserProfile;
import com.aicareerverse.model.UserRole;
import com.aicareerverse.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileRepository userRepo;

    public UserProfileController(UserProfileRepository userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Get user profile by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return userRepo.findById(id)
                .map(u -> ResponseEntity.ok(toMap(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update user profile (including role).
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return userRepo.findById(id).map(user -> {
            if (body.containsKey("name")) user.setName(body.get("name").toString());
            if (body.containsKey("title")) user.setTitle(body.get("title").toString());
            if (body.containsKey("bio")) user.setBio(body.get("bio").toString());
            if (body.containsKey("location")) user.setLocation(body.get("location").toString());
            if (body.containsKey("github")) user.setGithub(body.get("github").toString());
            if (body.containsKey("website")) user.setWebsite(body.get("website").toString());
            if (body.containsKey("skills")) user.setSkills(body.get("skills").toString());
            if (body.containsKey("role")) {
                try {
                    user.setRole(UserRole.valueOf(body.get("role").toString().toUpperCase()));
                } catch (IllegalArgumentException ignored) {}
            }
            userRepo.save(user);
            return ResponseEntity.ok(toMap(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toMap(UserProfile u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("email", u.getEmail());
        m.put("title", u.getTitle());
        m.put("location", u.getLocation());
        m.put("github", u.getGithub());
        m.put("website", u.getWebsite());
        m.put("bio", u.getBio());
        m.put("xp", u.getXp());
        m.put("level", u.getLevel());
        m.put("streak", u.getStreak());
        m.put("role", u.getRole().name());
        m.put("skills", u.getSkills());
        m.put("careerReadiness", u.getCareerReadiness());
        return m;
    }
}
