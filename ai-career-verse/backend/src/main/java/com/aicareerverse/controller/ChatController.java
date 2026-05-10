package com.aicareerverse.controller;

import com.aicareerverse.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            if (message == null || message.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "message is required"));
            }

            String systemPrompt = """
                You are "Aura", an elite AI Career Mentor built into the AI Career Verse platform.
                You specialize in guiding Python Full Stack Developers toward senior-level careers.
                
                Your personality: Warm, encouraging, but direct. You give actionable advice.
                Your knowledge: Tech careers, interview prep, resume optimization, skill development,
                salary negotiation, project ideas, and industry trends.
                
                Keep responses concise (2-4 paragraphs max). Use bullet points for actionable items.
                If asked about non-career topics, gently redirect to career-related discussion.
                
                User message: """ + message;

            String response = geminiService.generateContent(systemPrompt);
            return ResponseEntity.ok(Map.of("reply", response, "mentor", "Aura"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "AI Mentor unavailable: " + e.getMessage()));
        }
    }
}
