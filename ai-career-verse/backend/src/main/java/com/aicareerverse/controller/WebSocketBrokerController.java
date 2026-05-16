package com.aicareerverse.controller;

import com.aicareerverse.model.dto.ConnectRequestMessage;
import com.aicareerverse.model.dto.ConnectResponseMessage;
import com.aicareerverse.model.dto.JobFeedMessage;
import com.aicareerverse.service.WebSocketStateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Central WebSocket Controller — the "Role-Mesh" Broker.
 *
 * Handles three STOMP message flows + REST endpoints for loading historical state.
 *
 * STOMP:
 *   1. POST JOB → /app/job.post      → broadcasts to /topic/job-feed
 *   2. CONNECT  → /app/connect.send   → delivers to /user/{email}/queue/requests
 *   3. RESPOND  → /app/connect.respond → delivers to /user/{email}/queue/responses
 *
 * REST (for loading persisted state on login):
 *   4. GET /api/ws/requests?email=...   → returns requests for this user
 *   5. GET /api/ws/sent?email=...       → returns requests sent by this user
 *   6. GET /api/ws/responses?email=...  → returns responses for this user
 *   7. GET /api/ws/jobs                 → returns all posted jobs
 */
@Controller
public class WebSocketBrokerController {

    private static final Logger log = LoggerFactory.getLogger(WebSocketBrokerController.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final WebSocketStateService stateService;

    public WebSocketBrokerController(SimpMessagingTemplate messagingTemplate,
                                     WebSocketStateService stateService) {
        this.messagingTemplate = messagingTemplate;
        this.stateService = stateService;
    }

    // ═══════════════════════════════════════════════
    //  STOMP MESSAGE HANDLERS
    // ═══════════════════════════════════════════════

    // ─────────────────────────────────────────────
    //  1.  Mentor/Teacher posts a job → broadcast to /topic/job-feed
    // ─────────────────────────────────────────────
    @MessageMapping("/job.post")
    public void handleJobPost(@Payload JobFeedMessage job) {
        job.setId(UUID.randomUUID().toString());
        job.setTimestamp(Instant.now());

        log.info("📢 Job posted by {} ({}): {} @ {}",
                job.getPostedBy(), job.getPostedByRole(), job.getTitle(), job.getCompany());

        // Persist server-side
        stateService.saveJob(job);

        // Broadcast to ALL subscribers on /topic/job-feed
        messagingTemplate.convertAndSend("/topic/job-feed", job);
    }

    // ─────────────────────────────────────────────
    //  2.  Student sends a 'Connect' request → private queue to mentor
    // ─────────────────────────────────────────────
    @MessageMapping("/connect.send")
    public void handleConnectRequest(@Payload ConnectRequestMessage request) {
        request.setRequestId(UUID.randomUUID().toString());
        request.setTimestamp(Instant.now());
        request.setStatus("PENDING");

        log.info("🔗 Connect request: {} ({}) → mentor {}",
                request.getStudentName(), request.getStudentEmail(), request.getMentorEmail());

        // Persist server-side so it survives session switches
        stateService.saveRequest(request);

        // Try real-time delivery to the specific mentor's private queue
        messagingTemplate.convertAndSendToUser(
                request.getMentorEmail(),
                "/queue/requests",
                request
        );

        // Also echo back to the student so they see the pending state
        messagingTemplate.convertAndSendToUser(
                request.getStudentEmail(),
                "/queue/requests",
                request
        );
    }

    // ─────────────────────────────────────────────
    //  3.  Mentor responds (accept/reject) → private queue to student
    // ─────────────────────────────────────────────
    @MessageMapping("/connect.respond")
    public void handleConnectResponse(@Payload ConnectResponseMessage response) {
        response.setTimestamp(Instant.now());

        log.info("✅ Connect response from {} → student {}: {}",
                response.getMentorName(), response.getStudentEmail(), response.getStatus());

        // Update the request status server-side
        stateService.updateRequestStatus(response.getRequestId(), response.getStatus());

        // Persist the response
        stateService.saveResponse(response);

        // Deliver response to the student's private queue
        messagingTemplate.convertAndSendToUser(
                response.getStudentEmail(),
                "/queue/responses",
                response
        );

        // Also echo back to the mentor so their UI updates
        messagingTemplate.convertAndSendToUser(
                response.getMentorEmail(),
                "/queue/responses",
                response
        );
    }

    // ─────────────────────────────────────────────
    //  4.  Broadcast online presence (optional heartbeat)
    // ─────────────────────────────────────────────
    @MessageMapping("/presence.ping")
    public void handlePresencePing(@Payload java.util.Map<String, String> payload) {
        messagingTemplate.convertAndSend("/topic/presence", payload);
    }

    // ═══════════════════════════════════════════════
    //  REST ENDPOINTS — Load persisted state on login
    // ═══════════════════════════════════════════════

    /**
     * Get all connect requests for a user (as mentor receiving requests).
     */
    @GetMapping("/api/ws/requests")
    @ResponseBody
    public ResponseEntity<List<ConnectRequestMessage>> getRequests(@RequestParam String email) {
        return ResponseEntity.ok(stateService.getRequestsForMentor(email));
    }

    /**
     * Get all connect requests sent by a student.
     */
    @GetMapping("/api/ws/sent")
    @ResponseBody
    public ResponseEntity<List<ConnectRequestMessage>> getSentRequests(@RequestParam String email) {
        return ResponseEntity.ok(stateService.getRequestsByStudent(email));
    }

    /**
     * Get all connect responses for a student.
     */
    @GetMapping("/api/ws/responses")
    @ResponseBody
    public ResponseEntity<List<ConnectResponseMessage>> getResponses(@RequestParam String email) {
        return ResponseEntity.ok(stateService.getResponsesForStudent(email));
    }

    /**
     * Get all posted jobs.
     */
    @GetMapping("/api/ws/jobs")
    @ResponseBody
    public ResponseEntity<List<JobFeedMessage>> getJobs() {
        return ResponseEntity.ok(stateService.getAllJobs());
    }
}
