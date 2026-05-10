package com.aicareerverse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GitHubService {

    private static final Logger log = LoggerFactory.getLogger(GitHubService.class);

    @Value("${github.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public GitHubService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch a GitHub user's public profile.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getProfile(String username) {
        String url = baseUrl + "/users/" + username;
        log.info("Fetching GitHub profile for: {}", username);
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return response.getBody();
    }

    /**
     * Fetch a user's top repositories, sorted by most recently updated.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRepositories(String username) {
        String url = baseUrl + "/users/" + username + "/repos?sort=updated&per_page=6";
        log.info("Fetching repositories for: {}", username);
        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
        return response.getBody();
    }

    /**
     * Aggregate language usage across a user's repositories.
     */
    public Map<String, Object> getFullProfile(String username) {
        Map<String, Object> profile = getProfile(username);
        List<Map<String, Object>> repos = getRepositories(username);

        // Aggregate languages
        Map<String, Integer> languages = new LinkedHashMap<>();
        for (Map<String, Object> repo : repos) {
            String lang = (String) repo.get("language");
            if (lang != null) {
                languages.merge(lang, 1, Integer::sum);
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("profile", profile);
        result.put("repositories", repos);
        result.put("languages", languages);
        result.put("totalRepos", profile.get("public_repos"));
        result.put("followers", profile.get("followers"));
        result.put("following", profile.get("following"));

        return result;
    }
}
