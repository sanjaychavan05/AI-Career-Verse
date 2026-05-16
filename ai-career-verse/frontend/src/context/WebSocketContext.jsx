import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const WebSocketContext = createContext(null);

const WS_URL = 'http://localhost:8080/ws';
const API_BASE = 'http://localhost:8080';

/**
 * Central WebSocket provider — manages the STOMP connection lifecycle.
 *
 * On connect, it ALSO fetches historical data via REST endpoints so that
 * requests/responses/jobs persist across role switches (single-browser demo).
 *
 * Provides:
 *   - connected, onlineCount
 *   - jobFeed, connectRequests, connectResponses, sentRequests
 *   - postJobToFeed, sendConnectRequest, respondToConnect, dismissConnectResponse
 */
export function WebSocketProvider({ children, userEmail }) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [jobFeed, setJobFeed] = useState([]);
  const [connectRequests, setConnectRequests] = useState([]);
  const [connectResponses, setConnectResponses] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // ── Load historical state from REST when user changes ──
  const loadHistoricalState = useCallback(async (email) => {
    try {
      // Load requests targeted at this user (for mentors)
      const [reqRes, sentRes, respRes, jobsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/api/ws/requests`, { params: { email } }),
        axios.get(`${API_BASE}/api/ws/sent`, { params: { email } }),
        axios.get(`${API_BASE}/api/ws/responses`, { params: { email } }),
        axios.get(`${API_BASE}/api/ws/jobs`),
      ]);

      if (reqRes.status === 'fulfilled' && reqRes.value.data.length > 0) {
        setConnectRequests((prev) => {
          const existingIds = new Set(prev.map((r) => r.requestId));
          const newRequests = reqRes.value.data.filter((r) => !existingIds.has(r.requestId));
          return [...newRequests, ...prev];
        });
      }

      if (sentRes.status === 'fulfilled' && sentRes.value.data.length > 0) {
        setSentRequests((prev) => {
          const existingIds = new Set(prev.map((r) => r.requestId));
          const newSent = sentRes.value.data.filter((r) => !existingIds.has(r.requestId));
          return [...newSent, ...prev];
        });
      }

      if (respRes.status === 'fulfilled' && respRes.value.data.length > 0) {
        setConnectResponses((prev) => {
          const existingIds = new Set(prev.map((r) => r.requestId));
          const newResponses = respRes.value.data.filter((r) => !existingIds.has(r.requestId));
          return [...newResponses, ...prev];
        });
      }

      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.length > 0) {
        setJobFeed((prev) => {
          const existingIds = new Set(prev.map((j) => j.id));
          const newJobs = jobsRes.value.data.filter((j) => !existingIds.has(j.id));
          return [...newJobs, ...prev];
        });
      }

      console.log('📦 Historical state loaded for:', email);
    } catch (err) {
      console.warn('Could not load historical state:', err.message);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    // Reset state when user changes
    setConnectRequests([]);
    setConnectResponses([]);
    setSentRequests([]);
    setJobFeed([]);

    // Load historical data from REST
    loadHistoricalState(userEmail);

    // Load SockJS from CDN to avoid Vite ESM/global issues
    let sockJSLoaded = typeof window.SockJS === 'function';
    const initStomp = () => {
      const client = new Client({
        webSocketFactory: () => new window.SockJS(WS_URL),
        connectHeaders: {
          login: userEmail,
        },
        debug: (str) => {
          if (!str.includes('PING') && !str.includes('PONG') && !str.includes('heart-beat')) {
            console.log('[STOMP]', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
      });

      client.onConnect = () => {
        console.log('🟢 STOMP Connected as:', userEmail);
        setConnected(true);

        // ── Subscribe to broadcast: job-feed ──
        client.subscribe('/topic/job-feed', (message) => {
          const job = JSON.parse(message.body);
          console.log('📢 New job on feed:', job.title);
          setJobFeed((prev) => {
            if (prev.find((j) => j.id === job.id)) return prev;
            return [job, ...prev];
          });
        });

        // ── Subscribe to broadcast: presence ──
        client.subscribe('/topic/presence', (message) => {
          const data = JSON.parse(message.body);
          if (data.onlineCount !== undefined) {
            setOnlineCount(data.onlineCount);
          }
        });

        // ── Subscribe to private queue: connect requests ──
        client.subscribe('/user/queue/requests', (message) => {
          const request = JSON.parse(message.body);
          console.log('🔗 Connect request received:', request);
          setConnectRequests((prev) => {
            if (prev.find((r) => r.requestId === request.requestId)) return prev;
            return [request, ...prev];
          });
          // If this is the echo-back of a request we sent, update sentRequests
          if (request.studentEmail === userEmail) {
            setSentRequests((prev) => {
              if (prev.find((r) => r.requestId === request.requestId)) return prev;
              // Remove the optimistic entry and replace with server version
              const withoutOptimistic = prev.filter(
                (r) => !(r.mentorEmail === request.mentorEmail && !r.requestId)
              );
              return [...withoutOptimistic, { ...request }];
            });
          }
        });

        // ── Subscribe to private queue: connect responses ──
        client.subscribe('/user/queue/responses', (message) => {
          const response = JSON.parse(message.body);
          console.log('✅ Connect response received:', response);
          setConnectResponses((prev) => {
            if (prev.find((r) => r.requestId === response.requestId)) return prev;
            return [response, ...prev];
          });
          // Update request status locally
          setConnectRequests((prev) =>
            prev.map((r) =>
              r.requestId === response.requestId
                ? { ...r, status: response.status }
                : r
            )
          );
          // Also update sentRequests status
          setSentRequests((prev) =>
            prev.map((r) =>
              r.requestId === response.requestId
                ? { ...r, status: response.status }
                : r
            )
          );
        });
      };

      client.onDisconnect = () => {
        console.log('🔴 STOMP Disconnected');
        setConnected(false);
      };

      client.onStompError = (frame) => {
        console.error('STOMP Error:', frame.headers?.['message'], frame.body);
      };

      client.activate();
      clientRef.current = client;
    };

    if (sockJSLoaded) {
      initStomp();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js';
      script.async = true;
      script.onload = () => {
        console.log('SockJS loaded from CDN');
        initStomp();
      };
      script.onerror = () => {
        console.error('Failed to load SockJS from CDN, falling back to native WebSocket');
        const fallbackClient = new Client({
          brokerURL: 'ws://localhost:8080/ws',
          connectHeaders: { login: userEmail },
          debug: () => {},
          reconnectDelay: 5000,
        });
        fallbackClient.onConnect = () => {
          setConnected(true);
          console.log('🟢 STOMP Connected (native WS) as:', userEmail);
        };
        fallbackClient.activate();
        clientRef.current = fallbackClient;
      };
      document.head.appendChild(script);
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [userEmail, loadHistoricalState]);

  // ── Publish a message to a destination ──
  const publish = useCallback((destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn('STOMP not connected, cannot publish to', destination);
    }
  }, []);

  // ── Post a job (Mentor/Teacher → /topic/job-feed) ──
  const postJobToFeed = useCallback((jobData) => {
    publish('/app/job.post', jobData);
  }, [publish]);

  // ── Send a connect request (Student → Mentor private queue) ──
  const sendConnectRequest = useCallback((requestData) => {
    // Track optimistically (will be replaced by server echo)
    setSentRequests((prev) => {
      if (prev.find((r) => r.mentorEmail === requestData.mentorEmail && r.status !== 'REJECTED')) {
        return prev;
      }
      return [...prev, { ...requestData, status: 'PENDING', timestamp: new Date().toISOString() }];
    });
    publish('/app/connect.send', requestData);
  }, [publish]);

  // ── Respond to a connect request (Mentor → Student private queue) ──
  const respondToConnect = useCallback((responseData) => {
    publish('/app/connect.respond', responseData);
    // Optimistically update the local request status
    setConnectRequests((prev) =>
      prev.map((r) =>
        r.requestId === responseData.requestId
          ? { ...r, status: responseData.status }
          : r
      )
    );
  }, [publish]);

  // ── Clear a specific notification ──
  const dismissConnectResponse = useCallback((requestId) => {
    setConnectResponses((prev) => prev.filter((r) => r.requestId !== requestId));
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        onlineCount,
        jobFeed,
        connectRequests,
        connectResponses,
        sentRequests,
        postJobToFeed,
        sendConnectRequest,
        respondToConnect,
        dismissConnectResponse,
        publish,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
}
