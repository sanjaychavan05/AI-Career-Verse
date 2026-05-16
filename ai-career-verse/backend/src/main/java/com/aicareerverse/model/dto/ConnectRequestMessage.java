package com.aicareerverse.model.dto;

import java.time.Instant;

/**
 * DTO sent to a mentor's private queue (/user/{email}/queue/requests)
 * when a student sends a real-time 'Connect' request.
 */
public class ConnectRequestMessage {

    private String requestId;
    private String studentName;
    private String studentEmail;
    private String mentorEmail;
    private String message;
    private String status;        // PENDING, ACCEPTED, REJECTED
    private Instant timestamp;

    // --- Constructors ---
    public ConnectRequestMessage() {
        this.timestamp = Instant.now();
        this.status = "PENDING";
    }

    // --- Getters / Setters ---
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getMentorEmail() { return mentorEmail; }
    public void setMentorEmail(String mentorEmail) { this.mentorEmail = mentorEmail; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
