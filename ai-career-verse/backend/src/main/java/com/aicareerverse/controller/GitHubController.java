package com.aicareerverse.controller;

import com.aicareerverse.service.GitHubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/github")
public class GitHubController {

    private final GitHubService gitHubService;

    public GitHubController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getFullProfile(@PathVariable String username) {
        Map<String, Object> profile = gitHubService.getFullProfile(username);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{username}/repos")
    public ResponseEntity<?> getRepositories(@PathVariable String username) {
        return ResponseEntity.ok(gitHubService.getRepositories(username));
    }
}
