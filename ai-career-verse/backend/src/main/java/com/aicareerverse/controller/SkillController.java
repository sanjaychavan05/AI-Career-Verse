package com.aicareerverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSkillConstellation() {
        List<Map<String, Object>> nodes = List.of(
                Map.of("id", "react", "label", "React.js", "category", "frontend", "proficiency", 92, "x", 50, "y", 30),
                Map.of("id", "node", "label", "Node.js", "category", "backend", "proficiency", 88, "x", 75, "y", 55),
                Map.of("id", "postgres", "label", "PostgreSQL", "category", "database", "proficiency", 82, "x", 25, "y", 55),
                Map.of("id", "python", "label", "Python", "category", "backend", "proficiency", 95, "x", 50, "y", 70),
                Map.of("id", "django", "label", "Django", "category", "backend", "proficiency", 87, "x", 35, "y", 85),
                Map.of("id", "js", "label", "JavaScript", "category", "frontend", "proficiency", 90, "x", 65, "y", 15),
                Map.of("id", "html", "label", "HTML/CSS", "category", "frontend", "proficiency", 94, "x", 30, "y", 15),
                Map.of("id", "git", "label", "Git", "category", "tools", "proficiency", 85, "x", 85, "y", 30),
                Map.of("id", "docker", "label", "Docker", "category", "tools", "proficiency", 72, "x", 85, "y", 75),
                Map.of("id", "flask", "label", "Flask", "category", "backend", "proficiency", 84, "x", 65, "y", 85),
                Map.of("id", "tailwind", "label", "Tailwind", "category", "frontend", "proficiency", 88, "x", 15, "y", 35),
                Map.of("id", "mongodb", "label", "MongoDB", "category", "database", "proficiency", 76, "x", 10, "y", 70)
        );

        List<Map<String, String>> edges = List.of(
                Map.of("source", "react", "target", "js"),
                Map.of("source", "react", "target", "node"),
                Map.of("source", "react", "target", "tailwind"),
                Map.of("source", "node", "target", "postgres"),
                Map.of("source", "node", "target", "mongodb"),
                Map.of("source", "python", "target", "django"),
                Map.of("source", "python", "target", "flask"),
                Map.of("source", "python", "target", "postgres"),
                Map.of("source", "js", "target", "html"),
                Map.of("source", "node", "target", "docker"),
                Map.of("source", "node", "target", "git"),
                Map.of("source", "django", "target", "postgres"),
                Map.of("source", "flask", "target", "mongodb")
        );

        return ResponseEntity.ok(Map.of("nodes", nodes, "edges", edges));
    }
}
