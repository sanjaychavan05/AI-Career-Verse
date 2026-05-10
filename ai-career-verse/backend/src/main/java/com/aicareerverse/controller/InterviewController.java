package com.aicareerverse.controller;

import com.aicareerverse.service.InterviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewService interviewService;
    private final ObjectMapper objectMapper;

    public InterviewController(InterviewService interviewService, ObjectMapper objectMapper) {
        this.interviewService = interviewService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/question")
    public ResponseEntity<?> generateQuestion(@RequestBody Map<String, String> request) {
        try {
            String topic = request.getOrDefault("topic", "Python");
            String difficulty = request.getOrDefault("difficulty", "Medium");
            String result = interviewService.generateQuestion(topic, difficulty);
            String json = extractJson(result);
            return ResponseEntity.ok(objectMapper.readValue(json, Map.class));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateAnswer(@RequestBody Map<String, String> request) {
        try {
            String question = request.get("question");
            String answer = request.get("answer");
            if (question == null || answer == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "question and answer are required"));
            }
            String result = interviewService.evaluateAnswer(question, answer);
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
