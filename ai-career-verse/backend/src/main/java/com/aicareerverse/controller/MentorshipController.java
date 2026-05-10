package com.aicareerverse.controller;

import com.aicareerverse.service.MentorshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mentorship")
public class MentorshipController {

    private final MentorshipService mentorshipService;

    public MentorshipController(MentorshipService mentorshipService) {
        this.mentorshipService = mentorshipService;
    }

    /**
     * Student requests mentorship.
     * Body: { "studentId": 1, "mentorId": 2, "message": "..." }
     */
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> body) {
        try {
            Long studentId = Long.valueOf(body.get("studentId").toString());
            Long mentorId = Long.valueOf(body.get("mentorId").toString());
            String message = (String) body.getOrDefault("message", "");
            return ResponseEntity.ok(mentorshipService.createRequest(studentId, mentorId, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Mentor responds to a request.
     * Body: { "mentorId": 2, "accept": true }
     */
    @PutMapping("/respond/{requestId}")
    public ResponseEntity<?> respondToRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> body) {
        try {
            Long mentorId = Long.valueOf(body.get("mentorId").toString());
            boolean accept = Boolean.parseBoolean(body.get("accept").toString());
            return ResponseEntity.ok(mentorshipService.respondToRequest(requestId, mentorId, accept));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get pending requests for a mentor.
     */
    @GetMapping("/pending/{mentorId}")
    public ResponseEntity<?> getPendingRequests(@PathVariable Long mentorId) {
        return ResponseEntity.ok(mentorshipService.getPendingRequests(mentorId));
    }

    /**
     * Get all requests made by a student.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentRequests(@PathVariable Long studentId) {
        return ResponseEntity.ok(mentorshipService.getStudentRequests(studentId));
    }

    /**
     * Get list of available mentors.
     */
    @GetMapping("/mentors")
    public ResponseEntity<?> getAvailableMentors() {
        return ResponseEntity.ok(mentorshipService.getAvailableMentors());
    }
}
