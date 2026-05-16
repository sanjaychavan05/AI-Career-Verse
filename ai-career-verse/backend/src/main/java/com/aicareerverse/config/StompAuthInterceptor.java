package com.aicareerverse.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import java.security.Principal;

/**
 * Intercepts STOMP CONNECT frames to extract the 'login' header
 * and assign it as the session Principal.
 *
 * This is required for convertAndSendToUser(email, ...) to route
 * messages to the correct WebSocket session.
 */
public class StompAuthInterceptor implements ChannelInterceptor {

    private static final Logger log = LoggerFactory.getLogger(StompAuthInterceptor.class);

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Read the 'login' header sent by the STOMP client
            String userEmail = accessor.getLogin();
            if (userEmail != null && !userEmail.isBlank()) {
                // Set the principal for this session — used by convertAndSendToUser()
                accessor.setUser(new StompPrincipal(userEmail));
                log.info("🔐 STOMP CONNECT — principal set to: {}", userEmail);
            } else {
                log.warn("⚠️ STOMP CONNECT with no login header");
            }
        }

        return message;
    }

    /**
     * Simple Principal implementation wrapping the user email.
     */
    public static class StompPrincipal implements Principal {
        private final String name;

        public StompPrincipal(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }
    }
}
