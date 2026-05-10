package com.aicareerverse.service;

import com.aicareerverse.model.MentorshipRequest;
import com.aicareerverse.model.MentorshipRequest.RequestStatus;
import com.aicareerverse.model.UserProfile;
import com.aicareerverse.model.UserRole;
import com.aicareerverse.repository.MentorshipRequestRepository;
import com.aicareerverse.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MentorshipService {

    private static final Logger log = LoggerFactory.getLogger(MentorshipService.class);

    private final MentorshipRequestRepository requestRepo;
    private final UserProfileRepository userRepo;

    public MentorshipService(MentorshipRequestRepository requestRepo,
                              UserProfileRepository userRepo) {
        this.requestRepo = requestRepo;
        this.userRepo = userRepo;
    }

    /**
     * Student sends a mentorship request to a mentor.
     */
    @Transactional
    public Map<String, Object> createRequest(Long studentId, Long mentorId, String message) {
        UserProfile student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        UserProfile mentor = userRepo.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        if (mentor.getRole() != UserRole.MENTOR) {
            throw new RuntimeException("Target user is not a mentor");
        }

        // Check for existing pending request
        List<MentorshipRequest> existing = requestRepo.findByStudentIdAndMentorId(studentId, mentorId);
        boolean hasPending = existing.stream().anyMatch(r -> r.getStatus() == RequestStatus.PENDING);
        if (hasPending) {
            throw new RuntimeException("A pending request already exists");
        }

        MentorshipRequest request = new MentorshipRequest(
                studentId, mentorId, message,
                student.getName(), mentor.getName()
        );
        requestRepo.save(request);

        log.info("Mentorship request created: {} -> {}", student.getName(), mentor.getName());

        return Map.of(
                "id", request.getId(),
                "status", "PENDING",
                "message", "Request sent successfully"
        );
    }

    /**
     * Mentor responds to a request (accept/reject).
     */
    @Transactional
    public Map<String, Object> respondToRequest(Long requestId, Long mentorId, boolean accept) {
        MentorshipRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getMentorId().equals(mentorId)) {
            throw new RuntimeException("Not authorized to respond to this request");
        }
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request already responded to");
        }

        request.setStatus(accept ? RequestStatus.ACCEPTED : RequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());
        requestRepo.save(request);

        log.info("Mentorship request {} {}", requestId, accept ? "ACCEPTED" : "REJECTED");

        return Map.of(
                "id", request.getId(),
                "status", request.getStatus().name(),
                "message", accept ? "Request accepted!" : "Request rejected."
        );
    }

    /**
     * Get pending requests for a mentor.
     */
    public List<Map<String, Object>> getPendingRequests(Long mentorId) {
        return requestRepo.findByMentorIdAndStatus(mentorId, RequestStatus.PENDING)
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    /**
     * Get all requests for a student.
     */
    public List<Map<String, Object>> getStudentRequests(Long studentId) {
        return requestRepo.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    /**
     * Get all mentors available.
     */
    public List<Map<String, Object>> getAvailableMentors() {
        return userRepo.findByRole(UserRole.MENTOR).stream()
                .map(m -> Map.<String, Object>of(
                        "id", m.getId(),
                        "name", m.getName(),
                        "title", m.getTitle() != null ? m.getTitle() : "",
                        "xp", m.getXp(),
                        "skills", m.getSkills() != null ? m.getSkills() : ""
                ))
                .collect(Collectors.toList());
    }

    private Map<String, Object> toMap(MentorshipRequest req) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", req.getId());
        map.put("studentId", req.getStudentId());
        map.put("mentorId", req.getMentorId());
        map.put("studentName", req.getStudentName());
        map.put("mentorName", req.getMentorName());
        map.put("message", req.getMessage());
        map.put("status", req.getStatus().name());
        map.put("createdAt", req.getCreatedAt().toString());
        map.put("respondedAt", req.getRespondedAt() != null ? req.getRespondedAt().toString() : null);
        return map;
    }
}
