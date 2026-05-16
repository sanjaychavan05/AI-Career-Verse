package com.aicareerverse.service;

import com.aicareerverse.model.dto.ConnectRequestMessage;
import com.aicareerverse.model.dto.ConnectResponseMessage;
import com.aicareerverse.model.dto.JobFeedMessage;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * In-memory store for WebSocket state — persists connect requests, responses,
 * and job feed across user sessions.
 *
 * This is critical for a single-browser demo app where only one user is online
 * at a time. Without this, messages sent to offline users would be lost.
 */
@Service
public class WebSocketStateService {

    private final CopyOnWriteArrayList<ConnectRequestMessage> allRequests = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<ConnectResponseMessage> allResponses = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<JobFeedMessage> allJobs = new CopyOnWriteArrayList<>();

    // ── Connect Requests ──

    public void saveRequest(ConnectRequestMessage request) {
        allRequests.add(request);
    }

    /** Get requests targeted at a mentor (by mentor email) */
    public List<ConnectRequestMessage> getRequestsForMentor(String mentorEmail) {
        return allRequests.stream()
                .filter(r -> mentorEmail.equals(r.getMentorEmail()))
                .collect(Collectors.toList());
    }

    /** Get requests sent by a student (by student email) */
    public List<ConnectRequestMessage> getRequestsByStudent(String studentEmail) {
        return allRequests.stream()
                .filter(r -> studentEmail.equals(r.getStudentEmail()))
                .collect(Collectors.toList());
    }

    /** Get all requests involving a user (as mentor or student) */
    public List<ConnectRequestMessage> getRequestsForUser(String email) {
        return allRequests.stream()
                .filter(r -> email.equals(r.getMentorEmail()) || email.equals(r.getStudentEmail()))
                .collect(Collectors.toList());
    }

    /** Update request status when mentor responds */
    public void updateRequestStatus(String requestId, String status) {
        allRequests.stream()
                .filter(r -> requestId.equals(r.getRequestId()))
                .findFirst()
                .ifPresent(r -> r.setStatus(status));
    }

    // ── Connect Responses ──

    public void saveResponse(ConnectResponseMessage response) {
        allResponses.add(response);
    }

    /** Get responses for a student */
    public List<ConnectResponseMessage> getResponsesForStudent(String studentEmail) {
        return allResponses.stream()
                .filter(r -> studentEmail.equals(r.getStudentEmail()))
                .collect(Collectors.toList());
    }

    /** Get responses sent by a mentor */
    public List<ConnectResponseMessage> getResponsesByMentor(String mentorEmail) {
        return allResponses.stream()
                .filter(r -> mentorEmail.equals(r.getMentorEmail()))
                .collect(Collectors.toList());
    }

    // ── Job Feed ──

    public void saveJob(JobFeedMessage job) {
        allJobs.add(job);
    }

    /** Get all posted jobs */
    public List<JobFeedMessage> getAllJobs() {
        return List.copyOf(allJobs);
    }
}
