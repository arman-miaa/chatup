/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function useWebSocket(token: string | undefined) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<any[]>([]);

  const connect = useCallback(() => {
    if (!token) {
      setIsConnecting(false);
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
      setIsConnecting(false);

      websocket.send(JSON.stringify({ event: "authenticate", token }));

      if (messageQueueRef.current.length > 0) {
        console.log("📤 Sending queued messages:", messageQueueRef.current.length);
        messageQueueRef.current.forEach((msg) => {
          websocket.send(JSON.stringify(msg));
        });
        messageQueueRef.current = [];
      }
    };

    websocket.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
      setIsConnecting(true);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    websocket.onerror = () => setIsConnecting(false);
    wsRef.current = websocket;

    return websocket;
  }, [token]);

  useEffect(() => {
    const ws = connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const sendMessage = useCallback((event: string, data: any = {}) => {
    const payload = { event, ...data };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      console.log("⏳ Queueing message:", event);
      messageQueueRef.current.push(payload);
    }
  }, []);

  return { wsRef, connected, isConnecting, sendMessage };
}