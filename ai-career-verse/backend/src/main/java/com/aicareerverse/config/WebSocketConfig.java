package com.aicareerverse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Central WebSocket Broker configuration for the Role-Mesh ecosystem.
 *
 * Endpoints:
 *   /ws  — STOMP handshake endpoint (SockJS fallback enabled)
 *
 * Broker destinations:
 *   /topic/*     — broadcast channels (e.g. /topic/job-feed)
 *   /user/queue/* — private per-user queues (e.g. /user/queue/requests)
 *
 * Application prefix:
 *   /app         — client-to-server message prefix
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory broker for /topic (broadcast) and /queue (private)
        config.enableSimpleBroker("/topic", "/queue");
        // Prefix for @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
        // Prefix for user-specific destinations (/user/queue/...)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // STOMP endpoint — allow the React dev server origin
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:5173", "http://localhost:*", "*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Register the STOMP auth interceptor to map login header → Principal
        // This is CRITICAL for convertAndSendToUser() to work
        registration.interceptors(new StompAuthInterceptor());
    }
}
