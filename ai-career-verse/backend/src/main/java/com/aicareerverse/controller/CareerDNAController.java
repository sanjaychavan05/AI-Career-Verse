package com.aicareerverse.controller;

import com.aicareerverse.service.CareerDNAService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/career-dna")
public class CareerDNAController {

    private final CareerDNAService careerDNAService;
    private final ObjectMapper objectMapper;

    public CareerDNAController(CareerDNAService careerDNAService, ObjectMapper objectMapper) {
        this.careerDNAService = careerDNAService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeCareerDNA(@RequestBody Map<String, String> request) {
        try {
            String skills = request.getOrDefault("skills", "Python, React, Node.js, PostgreSQL");
            String experience = request.getOrDefault("experience", "Full Stack Developer, 2 years");
            String interests = request.getOrDefault("interests", "AI, Web Development, System Design");
            String result = careerDNAService.analyzeTraits(skills, experience, interests);
            String json = extractJson(result);
            return ResponseEntity.ok(objectMapper.readValue(json, Map.class));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private String extractJson(String response) {
        String cleaned = response.trim();
        if (cleaned.contains("```json")) {
            cleaned = cleaned.substring(cleaned.indexOf("```json") + 7);
            cleaned = cleaned.substring(0, cleaned.indexOf("```"));
        } else if (cleaned.contains("```")) {
            cleaned = cleaned.substring(cleaned.indexOf("```") + 3);
            cleaned = cleaned.substring(0, cleaned.indexOf("```"));
        }
        return cleaned.trim();
    }
}
