package com.aicareerverse.model.dto;

import java.time.Instant;

/**
 * DTO sent back to a student's private queue (/user/{email}/queue/responses)
 * when a mentor accepts or rejects a connect request.
 */
public class ConnectResponseMessage {

    private String requestId;
    private String mentorName;
    private String mentorEmail;
    private String studentEmail;
    private String status;        // ACCEPTED | REJECTED
    private String message;
    private Instant timestamp;

    public ConnectResponseMessage() {
        this.timestamp = Instant.now();
    }

    // --- Getters / Setters ---
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }

    public String getMentorEmail() { return mentorEmail; }
    public void setMentorEmail(String mentorEmail) { this.mentorEmail = mentorEmail; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
