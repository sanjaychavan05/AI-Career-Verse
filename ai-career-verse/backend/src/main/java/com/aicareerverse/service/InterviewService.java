package com.aicareerverse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);
    private final GeminiService geminiService;

    public InterviewService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String generateQuestion(String topic, String difficulty) {
        String prompt = String.format("""
            You are a senior technical interviewer at a top tech company.
            Generate ONE interview question for a **Python Full Stack Developer** candidate.
            
            Topic: %s
            Difficulty: %s
            
            Return ONLY valid JSON (no markdown):
            {
              "question": "The interview question text",
              "hints": ["hint1", "hint2"],
              "expectedTopics": ["topic1", "topic2"],
              "timeEstimate": "5 minutes"
            }
            """, topic, difficulty);
        return geminiService.generateContent(prompt);
    }

    public String evaluateAnswer(String question, String answer) {
        String prompt = String.format("""
            You are a senior technical interviewer evaluating a Python Full Stack Developer candidate.
            
            Question: %s
            Candidate's Answer: %s
            
            Evaluate thoroughly and return ONLY valid JSON (no markdown):
            {
              "score": 78,
              "maxScore": 100,
              "rating": "Good",
              "strengths": ["strength1", "strength2"],
              "weaknesses": ["area1", "area2"],
              "idealAnswer": "A brief model answer",
              "feedback": "2-3 sentence overall feedback"
            }
            """, question, answer);
        return geminiService.generateContent(prompt);
    }
}
