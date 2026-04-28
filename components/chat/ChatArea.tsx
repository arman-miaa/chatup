import { useRef, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ChatMessage, User } from "@/src/types/chat.type";

interface ChatAreaProps {
  selectedUser: User | null;
  messages: ChatMessage[];
  typingUser: string;
  currentUserId?: string;
  messageInput: string;
  onMessageChange: (v: string) => void;
  onSend: () => void;
  onTyping: (t: boolean) => void;
  onClose: () => void;
  onReact: (id: string, r: string) => void;
  onEdit: (id: string, msg: string) => void;
  onDelete: (id: string, forEveryone: boolean) => void;
  formatTime: (d: string) => string;
}

export default function ChatArea({
  selectedUser,
  messages,
  typingUser,
  currentUserId,
  messageInput,
  onMessageChange,
  onSend,
  onTyping,
  onClose,
  onReact,
  onEdit,
  onDelete,
  formatTime,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <p className="text-8xl mb-4">💬</p>
          <p className="text-2xl font-semibold">Select a user to chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader user={selectedUser} typingUser={typingUser} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#E5DDD5] bg-opacity-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-5xl mb-3">👋</p>
              <p className="text-lg">Start a conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOwn={msg.senderId === currentUserId}
              formatTime={formatTime}
              onReact={onReact}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        value={messageInput}
        onChange={onMessageChange}
        onSend={onSend}
        onTyping={onTyping}
      />
    </div>
  );
}