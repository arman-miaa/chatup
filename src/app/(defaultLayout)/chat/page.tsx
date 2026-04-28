/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { ChatMessage, User } from "@/src/types/chat.type";
import { useWebSocket } from "@/src/hooks/useWebSocket";
import ChatArea from "@/components/chat/ChatArea";
import Sidebar from "@/components/chat/Sidebar";

export default function ChatPage() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { wsRef, connected, isConnecting, sendMessage } = useWebSocket(token ?? undefined);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedChatUser");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (selectedUser) localStorage.setItem("selectedChatUser", JSON.stringify(selectedUser));
    else localStorage.removeItem("selectedChatUser");
  }, [selectedUser]);

  const handleMessage = useCallback((data: any) => {
    switch (data.event) {
      case "allUsers":
        if (data.data?.users) {
          const list: User[] = data.data.users
            .filter((u: any) => u.id !== user?.id)
            .map((u: any) => ({
              id: u.id, fullName: u.fullName || "Unknown",
              profileImage: u.profileImage || "", isOnline: u.isOnline || false,
              lastMessage: "", unreadCount: 0,
              lastSeen: u.isOnline ? "Online" : "Offline",
            }));
          setAllUsers(list.sort((a, b) => (a.isOnline && !b.isOnline ? -1 : !a.isOnline && b.isOnline ? 1 : a.fullName.localeCompare(b.fullName))));
        }
        break;
      case "messageList":
        if (data.data?.userWithLastMessages) {
          const map = new Map();
          data.data.userWithLastMessages.forEach((i: any) => {
            if (i.user) map.set(i.user.id, { lastMessage: i.lastMessage?.message || "", unreadCount: i.unreadCount || 0, isOnline: i.isOnline || false });
          });
          setAllUsers((prev) => prev.map((u) => ({ ...u, ...map.get(u.id), lastSeen: (map.get(u.id)?.isOnline ?? u.isOnline) ? "Online" : "Offline" })));
        }
        break;
      case "fetchChats":
        setChatMessages(data.data?.chats || []);
        break;
      case "message":

        setChatMessages((prev) => {
          const withoutTemp = prev.filter((m) => !m.id.startsWith("temp-"));
          const exists = withoutTemp.find((m) => m.id === data.data.id);
          if (exists) return prev.map((m) => m.id.startsWith("temp-") && m.message === data.data.message ? data.data : m);
          return [...prev.filter((m) => !(m.id.startsWith("temp-") && m.message === data.data.message)), data.data];
        });
        if (selectedUser && data.data.senderId === selectedUser.id) sendMessage("markAsSeen", { messageId: data.data.id });
        sendMessage("messageList");
        break;
      case "messageSeen":
        setChatMessages((prev) => prev.map((m) => m.id === data.data.messageId ? { ...m, isRead: true } : m));
        break;
      case "messagesSeen":
        setChatMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
        break;
      case "messageEdited":
        setChatMessages((prev) => prev.map((m) => m.id === data.data.id ? { ...m, message: data.data.message, isEdited: true } : m));
        break;
      case "messageDeleted":
        data.data.deletedForEveryone
          ? setChatMessages((prev) => prev.map((m) => m.id === data.data.messageId ? { ...m, isDeleted: true, message: "Deleted" } : m))
          : setChatMessages((prev) => prev.filter((m) => m.id !== data.data.messageId));
        break;
      case "typing":
        if (data.data.userId !== user?.id) setTypingUser(data.data.isTyping ? data.data.userId : "");
        break;
      case "userStatus":
        setAllUsers((prev) => prev.map((u) => u.id === data.data.userId ? { ...u, isOnline: data.data.isOnline } : u));
        setSelectedUser((prev) => prev?.id === data.data.userId ? { ...prev, isOnline: data.data.isOnline } as User : prev);
        break;
    }
  }, [user?.id, selectedUser, sendMessage]);

  useEffect(() => {
    if (!wsRef.current) return;
    wsRef.current.onmessage = (event) => { try { handleMessage(JSON.parse(event.data)); } catch {} };
  }, [wsRef.current, handleMessage]);

  useEffect(() => {
    if (connected && !initialized.current) {
      initialized.current = true;
      sendMessage("fetchAllUsers");
      sendMessage("messageList");
      const saved = localStorage.getItem("selectedChatUser");
      if (saved) sendMessage("fetchChats", { receiverId: JSON.parse(saved).id });
    }
  }, [connected, sendMessage]);

  const selectUser = (u: User) => {
    setSelectedUser(u);
    setChatMessages([]);
    sendMessage("fetchChats", { receiverId: u.id });
  };


  const handleSend = () => {
    if (!selectedUser || !messageInput.trim()) return;
    const text = messageInput.trim();
    

    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: user?.id || "", receiverId: selectedUser.id,
      message: text, images: [], isRead: false,
      isEdited: false, isDeleted: false, createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, tempMsg]);
    setMessageInput("");


    sendMessage("message", { receiverId: selectedUser.id, message: text, images: [] });
  };

  const handleTyping = (t: boolean) => {
    if (!selectedUser) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendMessage("typing", { receiverId: selectedUser.id, isTyping: t });
    if (t) typingTimeoutRef.current = setTimeout(() => handleTyping(false), 2000);
  };

  const formatTime = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toDateString() === new Date().toDateString()
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const filteredUsers = allUsers.filter((u) => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!token && !isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-purple-600 to-blue-500">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <button onClick={() => router.push("/login")} className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold mt-4">Go to Login</button>
        </div>
      </div>
    );
  }

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
      <Sidebar users={filteredUsers} selectedUser={selectedUser} connected={connected} searchQuery={searchQuery} onSearchChange={setSearchQuery} onSelectUser={selectUser} currentUser={user} />
      <ChatArea
        selectedUser={selectedUser} messages={chatMessages} typingUser={typingUser}
        currentUserId={user?.id} messageInput={messageInput} onMessageChange={setMessageInput}
        onSend={handleSend} onTyping={handleTyping}
        onClose={() => { setSelectedUser(null); localStorage.removeItem("selectedChatUser"); }}
        onReact={(id, r) => sendMessage("reactToMessage", { messageId: id, reaction: r })}
        onEdit={(id, m) => sendMessage("editMessage", { messageId: id, newMessage: m })}
        onDelete={(id, fe) => sendMessage("deleteMessage", { messageId: id, deleteForEveryone: fe })}
        formatTime={formatTime}
      />
    </div>
  );
}