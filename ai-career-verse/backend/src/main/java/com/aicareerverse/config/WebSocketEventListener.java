package com.aicareerverse.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;

/**
 * Tracks WebSocket session connect/disconnect events.
 * Broadcasts online user count to /topic/presence for the live dashboard.
 */
@Component
public class WebSocketEventListener {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final SimpMessagingTemplate messagingTemplate;

    // Track active sessions
    private final Set<String> activeSessions = ConcurrentHashMap.newKeySet();

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        activeSessions.add(sessionId);

        log.info("🟢 WebSocket connected: session={} (active: {})", sessionId, activeSessions.size());

        broadcastPresence();
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        activeSessions.remove(sessionId);

        log.info("🔴 WebSocket disconnected: session={} (active: {})", sessionId, activeSessions.size());

        broadcastPresence();
    }

    private void broadcastPresence() {
        messagingTemplate.convertAndSend("/topic/presence", Map.of(
                "onlineCount", activeSessions.size(),
                "type", "PRESENCE_UPDATE"
        ));
    }

    public int getOnlineCount() {
        return activeSessions.size();
    }
}
