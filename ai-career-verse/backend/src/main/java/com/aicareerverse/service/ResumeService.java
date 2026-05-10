package com.aicareerverse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public ResumeService(GeminiService geminiService, ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.objectMapper = objectMapper;
    }

    /**
     * Extract text from a PDF resume and score it via Gemini AI.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> scoreResume(MultipartFile file) throws Exception {
        // 1. Extract text from PDF using Apache PDFBox
        String resumeText;
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            resumeText = stripper.getText(document);
        }

        log.info("Extracted {} characters from resume PDF", resumeText.length());

        // 2. Build scoring prompt
        String prompt = buildScoringPrompt(resumeText);

        // 3. Get AI score from Gemini
        String response = geminiService.generateContent(prompt);

        // 4. Parse the JSON response
        String jsonStr = extractJson(response);
        return objectMapper.readValue(jsonStr, Map.class);
    }

    private String buildScoringPrompt(String resumeText) {
        return """
            You are an expert ATS Resume Analyzer. Analyze the following resume for a **Python Full Stack Developer** position.
            
            Score the resume on these categories (each out of 100):
            1. Technical Skills Match - How well the skills align with Python Full Stack (Django/Flask, React, PostgreSQL, etc.)
            2. Experience Relevance - Quality and relevance of work experience
            3. Project Impact - Strength of projects and measurable outcomes
            4. Education & Certifications - Academic qualifications
            5. Overall ATS Score - How well the resume would pass ATS filters
            
            Return ONLY valid JSON with this exact structure, no markdown formatting:
            {
              "overallScore": 85,
              "categories": [
                {"name": "Technical Skills", "score": 90, "feedback": "Strong Python and React skills"},
                {"name": "Experience", "score": 80, "feedback": "Relevant experience"},
                {"name": "Projects", "score": 85, "feedback": "Good project portfolio"},
                {"name": "Education", "score": 75, "feedback": "Solid academic background"},
                {"name": "ATS Compatibility", "score": 88, "feedback": "Good keyword usage"}
              ],
              "strengths": ["strength1", "strength2", "strength3"],
              "improvements": ["improvement1", "improvement2", "improvement3"],
              "summary": "Brief 2-sentence overall assessment"
            }
            
            Resume Text:
            """ + resumeText;
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
