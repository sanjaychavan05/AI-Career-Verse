package com.aicareerverse.model.dto;

import java.time.Instant;
import java.util.List;

/**
 * DTO broadcast over /topic/job-feed when a Mentor or Teacher posts a new job.
 */
public class JobFeedMessage {

    private String id;
    private String title;
    private String company;
    private String location;
    private String type;
    private String salary;
    private String experience;
    private String description;
    private List<String> skills;

    private String postedBy;       // name of the poster
    private String postedByRole;   // MENTOR | TEACHER
    private String postedByEmail;
    private Instant timestamp;

    // --- Constructors ---
    public JobFeedMessage() {
        this.timestamp = Instant.now();
    }

    // --- Getters / Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }

    public String getPostedByRole() { return postedByRole; }
    public void setPostedByRole(String postedByRole) { this.postedByRole = postedByRole; }

    public String getPostedByEmail() { return postedByEmail; }
    public void setPostedByEmail(String postedByEmail) { this.postedByEmail = postedByEmail; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
