"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  type: "sent" | "received" | "system" | "error";
  text: string;
  timestamp: string;
}

export default function WebSocketTest() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [wsUrl, setWsUrl] = useState("ws://localhost:5000");
  const [messageInput, setMessageInput] = useState("");
  const [token, setToken] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = useCallback((type: Message["type"], text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const connect = () => {
    if (ws) {
      ws.close();
    }

    try {
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        setConnected(true);
        addMessage("system", `✅ Connected to ${wsUrl}`);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addMessage("received", JSON.stringify(data, null, 2));
        } catch {
          addMessage("received", event.data);
        }
      };

      websocket.onclose = () => {
        setConnected(false);
        addMessage("system", "❌ Disconnected");
      };

      websocket.onerror = (error) => {
        addMessage("error", "⚠️ WebSocket Error");
      };

      setWs(websocket);
    } catch (error) {
      addMessage("error", `Connection failed: ${error}`);
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
      setWs(null);
      setConnected(false);
    }
  };

  const sendMessage = (message: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      addMessage("error", "Not connected!");
      return;
    }

    try {
      JSON.parse(message);
      ws.send(message);
      addMessage("sent", message);
    } catch {
      addMessage("error", "Invalid JSON format!");
    }
  };

  const quickTests = {
    authenticate: () => {
      if (!token) {
        addMessage("error", "Please enter JWT token first!");
        return;
      }
      sendMessage(
        JSON.stringify({
          event: "authenticate",
          token: token,
        })
      );
    },
    message: () => {
      if (!receiverId) {
        addMessage("error", "Please enter receiver ID first!");
        return;
      }
      sendMessage(
        JSON.stringify({
          event: "message",
          receiverId: receiverId,
          message: "Hello! Test message " + Date.now(),
          images: [],
        })
      );
    },
    typing: () => {
      if (!receiverId) {
        addMessage("error", "Please enter receiver ID first!");
        return;
      }
      sendMessage(
        JSON.stringify({
          event: "typing",
          receiverId: receiverId,
          isTyping: true,
        })
      );
    },
    fetchChats: () => {
      if (!receiverId) {
        addMessage("error", "Please enter receiver ID first!");
        return;
      }
      sendMessage(
        JSON.stringify({
          event: "fetchChats",
          receiverId: receiverId,
        })
      );
    },
    messageList: () => {
      sendMessage(
        JSON.stringify({
          event: "messageList",
        })
      );
    },
    unReadMessages: () => {
      if (!receiverId) {
        addMessage("error", "Please enter receiver ID first!");
        return;
      }
      sendMessage(
        JSON.stringify({
          event: "unReadMessages",
          receiverId: receiverId,
        })
      );
    },
    totalUnreadCount: () => {
      sendMessage(
        JSON.stringify({
          event: "totalUnreadCount",
        })
      );
    },
    markAsSeen: () => {
      sendMessage(
        JSON.stringify({
          event: "markAsSeen",
          messageId: "message_id_here",
          markAll: true,
        })
      );
    },
    deleteMessage: () => {
      sendMessage(
        JSON.stringify({
          event: "deleteMessage",
          messageId: "message_id_here",
          deleteForEveryone: false,
        })
      );
    },
    editMessage: () => {
      sendMessage(
        JSON.stringify({
          event: "editMessage",
          messageId: "message_id_here",
          newMessage: "Edited message content",
        })
      );
    },
    reactToMessage: () => {
      sendMessage(
        JSON.stringify({
          event: "reactToMessage",
          messageId: "message_id_here",
          reaction: "❤️",
        })
      );
    },
    giftPopup: () => {
      sendMessage(
        JSON.stringify({
          event: "giftPopup",
        })
      );
    },
    project: () => {
      sendMessage(
        JSON.stringify({
          event: "project",
        })
      );
    },
    checkOnlineStatus: () => {
      if (!receiverId) {
        addMessage("error", "Please enter receiver ID first!");
        return;
      }
      sendMessage(
        JSON.stringify({
          event: "checkOnlineStatus",
          userId: receiverId,
        })
      );
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          🔌 WebSocket Test Client
        </h1>

        {/* Connection Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold">WebSocket URL:</label>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="border rounded px-3 py-2 flex-1 min-w-[200px]"
              placeholder="ws://localhost:5000"
            />
            <button
              onClick={connect}
              disabled={connected}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 font-semibold"
            >
              Connect
            </button>
            <button
              onClick={disconnect}
              disabled={!connected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 font-semibold"
            >
              Disconnect
            </button>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                connected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {connected ? "🟢 Connected" : "🔴 Disconnected"}
            </span>
          </div>
        </div>

        {/* Auth & Config */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold mb-3">⚙️ Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                JWT Token (First Authenticate):
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                className="border rounded px-3 py-2 w-full h-20 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Receiver ID:
              </label>
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="6834af803f5f6b46dc734d3e"
                className="border rounded px-3 py-2 w-full"
              />
              <label className="block text-sm font-semibold mb-1 mt-3">
                Your User ID (after auth):
              </label>
              <input
                type="text"
                readOnly
                placeholder="Will appear after authentication"
                className="border rounded px-3 py-2 w-full bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Test Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold mb-3">
            🚀 Quick Test Events
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <button
              onClick={quickTests.authenticate}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 font-semibold"
            >
              1️⃣ Authenticate
            </button>
            <button
              onClick={quickTests.message}
              className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 font-semibold"
            >
              2️⃣ Send Message
            </button>
            <button
              onClick={quickTests.typing}
              className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 font-semibold"
            >
              3️⃣ Typing
            </button>
            <button
              onClick={quickTests.fetchChats}
              className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 font-semibold"
            >
              4️⃣ Fetch Chats
            </button>
            <button
              onClick={quickTests.messageList}
              className="px-3 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 font-semibold"
            >
              5️⃣ Message List
            </button>
            <button
              onClick={quickTests.unReadMessages}
              className="px-3 py-2 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 font-semibold"
            >
              6️⃣ Unread Messages
            </button>
            <button
              onClick={quickTests.totalUnreadCount}
              className="px-3 py-2 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 font-semibold"
            >
              7️⃣ Total Unread
            </button>
            <button
              onClick={quickTests.markAsSeen}
              className="px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 font-semibold"
            >
              8️⃣ Mark as Seen
            </button>
            <button
              onClick={quickTests.deleteMessage}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 font-semibold"
            >
              9️⃣ Delete Message
            </button>
            <button
              onClick={quickTests.editMessage}
              className="px-3 py-2 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600 font-semibold"
            >
              🔟 Edit Message
            </button>
            <button
              onClick={quickTests.reactToMessage}
              className="px-3 py-2 bg-rose-500 text-white rounded text-sm hover:bg-rose-600 font-semibold"
            >
              ❤️ React
            </button>
            <button
              onClick={quickTests.checkOnlineStatus}
              className="px-3 py-2 bg-lime-500 text-white rounded text-sm hover:bg-lime-600 font-semibold"
            >
              🟢 Online Status
            </button>
            <button
              onClick={quickTests.giftPopup}
              className="px-3 py-2 bg-fuchsia-500 text-white rounded text-sm hover:bg-fuchsia-600 font-semibold"
            >
              🎁 Gift Popup
            </button>
            <button
              onClick={quickTests.project}
              className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 font-semibold"
            >
              🔧 Connection Test
            </button>
          </div>
        </div>

        {/* Custom Message */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold mb-3">✉️ Custom Message</h2>
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder='{"event": "message", "receiverId": "123", "message": "Hello!"}'
            className="border rounded px-3 py-2 w-full h-24 font-mono text-sm"
          />
          <button
            onClick={() => sendMessage(messageInput)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
          >
            Send Custom Message
          </button>
        </div>

        {/* Messages Display */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">📨 Messages Log</h2>
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 font-semibold"
            >
              Clear Log
            </button>
          </div>
          <div className="bg-gray-900 rounded p-4 h-[500px] overflow-y-auto font-mono text-sm">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                No messages yet. Connect and start testing!
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded ${
                    msg.type === "sent"
                      ? "bg-blue-900/50 border-l-4 border-blue-500"
                      : msg.type === "received"
                      ? "bg-green-900/50 border-l-4 border-green-500"
                      : msg.type === "error"
                      ? "bg-red-900/50 border-l-4 border-red-500"
                      : "bg-gray-800/50 border-l-4 border-gray-500"
                  }`}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span
                      className={`font-semibold ${
                        msg.type === "sent"
                          ? "text-blue-400"
                          : msg.type === "received"
                          ? "text-green-400"
                          : msg.type === "error"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.type.toUpperCase()}
                    </span>
                    <span className="text-gray-500">{msg.timestamp}</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-all text-gray-300">
                    {msg.text}
                  </pre>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}