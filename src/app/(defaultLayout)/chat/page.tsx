/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RootState } from "@/redux/store";

// Types
interface User {
  id: string;
  fullName: string;
  profileImage: string;
  isOnline: boolean;
  lastMessage?: string;
  unreadCount: number;
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  images: string[];
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  reaction?: string;
  createdAt: string;
  seenAt?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUser, setTypingUser] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Auto-connect WebSocket
  useEffect(() => {
    if (!token) {
      setIsConnecting(false);
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";

    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
          console.log("✅ WebSocket connected");
          setConnected(true);
          setIsConnecting(false);

          websocket.send(JSON.stringify({ event: "authenticate", token }));

          setTimeout(() => {
            if (websocket.readyState === WebSocket.OPEN) {
              websocket.send(JSON.stringify({ event: "fetchAllUsers" }));
              websocket.send(JSON.stringify({ event: "messageList" }));
            }
          }, 500);
        };

        websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("📩 EVENT:", data.event);
            handleWebSocketMessage(data);
          } catch {
            console.log("Raw:", event.data);
          }
        };

        websocket.onclose = () => {
          setConnected(false);
          setIsConnecting(true);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };

        websocket.onerror = () => setIsConnecting(false);
        wsRef.current = websocket;
      } catch (error) {
        console.error("Connection failed:", error);
        setIsConnecting(false);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [token]);

  // Handle ALL WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    switch (data.event) {
      case "allUsers":
        if (data.data?.users) {
          const usersList = data.data.users
            .filter((u: any) => u.id !== user?.id)
            .map((u: any) => ({
              id: u.id,
              fullName: u.fullName || "Unknown",
              profileImage: u.profileImage || "",
              isOnline: u.isOnline || false,
              lastMessage: "",
              unreadCount: 0,
              lastSeen: u.isOnline ? "Online" : "Offline",
            }));

          usersList.sort((a: User, b: User) => {
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            return a.fullName.localeCompare(b.fullName);
          });

          setAllUsers(usersList);
        }
        break;

      case "messageList":
        if (data.data?.userWithLastMessages) {
          const chatUserIds = new Map();
          data.data.userWithLastMessages.forEach((item: any) => {
            if (item.user) {
              chatUserIds.set(item.user.id, {
                lastMessage: item.lastMessage?.message || "",
                unreadCount: item.unreadCount || 0,
                isOnline: item.isOnline || false,
              });
            }
          });

          setAllUsers((prev) =>
            prev.map((u) => ({
              ...u,
              lastMessage: chatUserIds.get(u.id)?.lastMessage || u.lastMessage || "",
              unreadCount: chatUserIds.get(u.id)?.unreadCount || 0,
              isOnline: chatUserIds.get(u.id)?.isOnline ?? u.isOnline,
              lastSeen: chatUserIds.get(u.id)?.isOnline ? "Online" : u.lastSeen || "Offline",
            }))
          );
        }
        break;

      case "fetchChats":
        console.log("📥 fetchChats RAW data:", JSON.stringify(data.data));
        if (data.data?.chats && Array.isArray(data.data.chats)) {
          console.log("✅ Setting", data.data.chats.length, "messages to chatMessages");
          setChatMessages(data.data.chats);
          setTimeout(scrollToBottom, 100);
        } else {
          console.log("⚠️ No chats array, setting empty. Data:", data.data);
          setChatMessages([]);
        }
        break;

      case "message":
        console.log("💬 New message:", data.data?.message);
        setChatMessages((prev) => {
          if (prev.find((m) => m.id === data.data.id)) return prev;
          return [...prev, data.data];
        });
        setTimeout(scrollToBottom, 100);
        
        // Refresh sidebarde
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ event: "messageList" }));
        }
        break;

      case "typing":
        if (data.data.userId !== user?.id) {
          setTypingUser(data.data.isTyping ? data.data.userId : "");
        }
        break;

      case "userStatus":
        updateUserStatus(data.data.userId, data.data.isOnline);
        break;

      default:
        break;
    }
  };

  const updateUserStatus = (userId: string, isOnline: boolean) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, isOnline, lastSeen: isOnline ? "Online" : "Just now" }
          : u
      )
    );
    setSelectedUser((prev) =>
      prev?.id === userId
        ? { ...prev, isOnline, lastSeen: isOnline ? "Online" : "Just now" }
        : prev
    );
  };

  // Select user & fetch chat history
  const selectUser = (chatUser: User) => {
    console.log("👆 SELECTED:", chatUser.fullName, chatUser.id);
    
    // Set selected user first
    setSelectedUser(chatUser);
    
    // Clear old messages
    setChatMessages([]);
    
    // Reset unread
    setAllUsers((prev) =>
      prev.map((u) => (u.id === chatUser.id ? { ...u, unreadCount: 0 } : u))
    );

    // Fetch chat history
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = { event: "fetchChats", receiverId: chatUser.id };
      console.log("📤 Sending:", payload);
      wsRef.current.send(JSON.stringify(payload));
    } else {
      console.log("❌ WebSocket not open");
    }
  };

  // Send message
  const sendMessage = () => {
    if (!selectedUser || !messageInput.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      event: "message",
      receiverId: selectedUser.id,
      message: messageInput.trim(),
      images: [],
    };
    
    console.log("📤 Sending message:", payload);
    wsRef.current.send(JSON.stringify(payload));
    setMessageInput("");
    messageInputRef.current?.focus();
  };

  const handleTyping = (isTyping: boolean) => {
    if (!wsRef.current || !selectedUser) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    wsRef.current.send(
      JSON.stringify({ event: "typing", receiverId: selectedUser.id, isTyping })
    );
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => handleTyping(false), 2000);
    }
  };

  const deleteMessage = (messageId: string, forEveryone = false) => {
    if (!wsRef.current) return;
    wsRef.current.send(
      JSON.stringify({ event: "deleteMessage", messageId, deleteForEveryone: forEveryone })
    );
  };

  const editMessage = (messageId: string, newMessage: string) => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ event: "editMessage", messageId, newMessage }));
  };

  const reactToMessage = (messageId: string, reaction: string) => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ event: "reactToMessage", messageId, reaction }));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString()
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const filteredUsers = allUsers.filter((u) =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = allUsers.filter((u) => u.isOnline).length;

  // Not logged in
  if (!token && !isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">You need to login</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (isConnecting && !connected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">💬 Users</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">🟢 {onlineCount} online</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {connected ? "Live" : "Down"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search users..."
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((chatUser) => (
            <div
              key={chatUser.id}
              onClick={() => selectUser(chatUser)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedUser?.id === chatUser.id ? "bg-purple-50 border-l-4 border-l-purple-600" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {chatUser.profileImage ? (
                    <Image src={chatUser.profileImage} alt={chatUser.fullName} width={48} height={48} className="rounded-full object-cover w-12 h-12" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {chatUser.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${chatUser.isOnline ? "bg-blue-500" : "bg-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">{chatUser.fullName}</h3>
                    <span className="text-xs text-gray-400">{chatUser.isOnline ? "Online" : "Offline"}</span>
                  </div>
                  {chatUser.lastMessage && <p className="text-xs text-gray-500 truncate">{chatUser.lastMessage}</p>}
                </div>
                {chatUser.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1">{chatUser.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <Image src={user.profileImage} alt="You" width={40} height={40} className="rounded-full object-cover w-10 h-10" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.fullName?.charAt(0)?.toUpperCase() || "Y"}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm">{user?.fullName || "You"}</p>
              <p className="text-xs text-blue-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {selectedUser.profileImage ? (
                    <Image src={selectedUser.profileImage} alt={selectedUser.fullName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedUser.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${selectedUser.isOnline ? "bg-blue-500" : "bg-gray-400"}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-xs text-gray-500">{typingUser === selectedUser.id ? "Typing..." : selectedUser.isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#E5DDD5] bg-opacity-50">
              {/* DEBUG */}
              <div style={{fontSize:"10px",color:"gray",textAlign:"center"}}>
                Messages: {chatMessages.length} | Selected: {selectedUser.fullName}
              </div>
              
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p className="text-5xl mb-3">👋</p>
                    <p className="text-lg">Start a conversation!</p>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%] group">
                      <div className={`relative rounded-2xl px-4 py-2 shadow-sm ${msg.senderId === user?.id ? "bg-[#DCF8C6]" : "bg-white"}`}>
                        {msg.isDeleted ? (
                          <p className="italic text-gray-400 text-sm">Deleted</p>
                        ) : (
                          <p className="text-sm">{msg.message}</p>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-1 ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                        {msg.senderId === user?.id && <span className="text-[10px] text-blue-400">{msg.isRead ? "✓✓" : "✓"}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-gray-100 border-t border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => { setMessageInput(e.target.value); handleTyping(true); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button onClick={sendMessage} disabled={!messageInput.trim()} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <p className="text-8xl mb-4">💬</p>
              <p className="text-2xl font-semibold">Select a user to chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}