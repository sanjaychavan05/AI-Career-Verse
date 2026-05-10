package com.aicareerverse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CareerDNAService {

    private static final Logger log = LoggerFactory.getLogger(CareerDNAService.class);
    private final GeminiService geminiService;

    public CareerDNAService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String analyzeTraits(String skills, String experience, String interests) {
        String prompt = String.format("""
            You are an expert Career DNA Analyst. Analyze this developer's profile and generate a comprehensive Career DNA report.
            
            Skills: %s
            Experience: %s
            Interests: %s
            
            Return ONLY valid JSON (no markdown):
            {
              "traits": {
                "problemSolving": 88,
                "creativity": 75,
                "leadership": 65,
                "communication": 80,
                "technicalDepth": 92,
                "adaptability": 78
              },
              "dominantArchetype": "The Builder",
              "archetypeDescription": "You thrive on creating robust systems from the ground up.",
              "compatibilityScores": [
                {"role": "Backend Engineer", "score": 94, "reason": "Strong Python and system design skills"},
                {"role": "Full Stack Developer", "score": 91, "reason": "Excellent breadth across frontend and backend"},
                {"role": "DevOps Engineer", "score": 72, "reason": "Good fundamentals, room to grow in CI/CD"},
                {"role": "ML Engineer", "score": 68, "reason": "Python expertise is a strong foundation"}
              ],
              "helixSequence": ["Build", "Analyze", "Optimize", "Ship", "Iterate", "Scale"],
              "growthAreas": ["System Design", "Cloud Architecture", "Team Leadership"],
              "summary": "A 2-3 sentence career DNA summary"
            }
            """, skills, experience, interests);
        return geminiService.generateContent(prompt);
    }
}
