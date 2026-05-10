package com.aicareerverse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private static final Logger log = LoggerFactory.getLogger(RoadmapService.class);

    /**
     * Senior Developer benchmark skills — the full skill set expected.
     */
    private static final Map<String, List<String>> SENIOR_BENCHMARK = Map.of(
            "Foundation", List.of("Python", "HTML/CSS", "JavaScript", "Git"),
            "Backend", List.of("Django", "Flask", "REST APIs", "PostgreSQL"),
            "Frontend", List.of("React.js", "Tailwind CSS", "Redux", "TypeScript"),
            "Full Stack", List.of("Full Stack Projects", "Docker", "CI/CD", "AWS"),
            "Advanced", List.of("Microservices", "System Design", "Redis", "Kafka"),
            "Senior", List.of("Tech Leadership", "Mentoring", "Architecture", "Open Source")
    );

    private static final List<String> PHASE_ORDER = List.of(
            "Foundation", "Backend", "Frontend", "Full Stack", "Advanced", "Senior"
    );

    /**
     * Analyze user skills against the Senior Developer benchmark.
     * Returns a dynamic roadmap with statuses set based on actual skill coverage.
     */
    public Map<String, Object> analyzeGaps(String userSkillsCSV) {
        Set<String> userSkills = parseSkills(userSkillsCSV);
        List<Map<String, Object>> milestones = new ArrayList<>();
        int completedPhases = 0;
        int totalSkillNodes = 0;
        int completedSkillNodes = 0;
        boolean foundInProgress = false;

        for (int i = 0; i < PHASE_ORDER.size(); i++) {
            String phase = PHASE_ORDER.get(i);
            List<String> required = SENIOR_BENCHMARK.get(phase);
            if (required == null) continue;

            totalSkillNodes += required.size();

            // Count how many skills in this phase the user has
            long matched = required.stream()
                    .filter(skill -> userSkills.stream()
                            .anyMatch(us -> us.equalsIgnoreCase(skill) || us.contains(skill.toLowerCase()) || skill.toLowerCase().contains(us.toLowerCase())))
                    .count();

            completedSkillNodes += (int) matched;
            double coverage = (double) matched / required.size();

            String status;
            if (coverage >= 0.75) {
                status = "completed";
                completedPhases++;
            } else if (!foundInProgress && coverage > 0) {
                status = "in-progress";
                foundInProgress = true;
            } else if (!foundInProgress) {
                status = "in-progress";
                foundInProgress = true;
            } else {
                status = "upcoming";
            }

            // Find missing skills for this phase
            List<String> missing = required.stream()
                    .filter(skill -> userSkills.stream()
                            .noneMatch(us -> us.equalsIgnoreCase(skill) || us.contains(skill.toLowerCase()) || skill.toLowerCase().contains(us.toLowerCase())))
                    .collect(Collectors.toList());

            String[] periods = {"Month 1-3", "Month 4-6", "Month 7-9", "Month 10-12", "Month 13-18", "Month 19-24"};
            String[] titles = {
                    "Python & Web Fundamentals", "Django & Flask Mastery",
                    "React & Modern Frontend", "End-to-End Applications",
                    "System Design & Architecture", "Senior Developer & Beyond"
            };
            String[] descs = {
                    "Master core programming and web fundamentals",
                    "Build production-grade backend services",
                    "Create responsive dynamic user interfaces",
                    "Deploy complete applications to production",
                    "Design scalable distributed systems",
                    "Lead teams and drive technical decisions"
            };

            Map<String, Object> milestone = new LinkedHashMap<>();
            milestone.put("id", i + 1);
            milestone.put("phase", phase);
            milestone.put("title", titles[i]);
            milestone.put("period", periods[i]);
            milestone.put("status", status);
            milestone.put("skills", required);
            milestone.put("missingSkills", missing);
            milestone.put("description", descs[i]);
            milestone.put("coverage", Math.round(coverage * 100));
            milestones.add(milestone);
        }

        int overallProgress = totalSkillNodes > 0
                ? (int) Math.round((double) completedSkillNodes / totalSkillNodes * 100)
                : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("title", "Python Full Stack → Senior Developer");
        result.put("totalPhases", PHASE_ORDER.size());
        result.put("currentPhase", completedPhases + 1);
        result.put("overallProgress", overallProgress);
        result.put("completedSkillNodes", completedSkillNodes);
        result.put("totalSkillNodes", totalSkillNodes);
        result.put("milestones", milestones);

        // Determine "Next Phase" recommendations
        List<String> nextPhaseSkills = milestones.stream()
                .filter(m -> "upcoming".equals(m.get("status")) || "in-progress".equals(m.get("status")))
                .flatMap(m -> ((List<String>) m.get("missingSkills")).stream())
                .limit(6)
                .collect(Collectors.toList());
        result.put("nextPhaseSkills", nextPhaseSkills);

        return result;
    }

    private Set<String> parseSkills(String csv) {
        if (csv == null || csv.isBlank()) return Set.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
