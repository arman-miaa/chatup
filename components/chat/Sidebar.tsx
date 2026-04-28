/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/src/types/chat.type";
import Image from "next/image";


interface SidebarProps {
  users: User[];
  selectedUser: User | null;
  connected: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectUser: (user: User) => void;
  currentUser: any;
}

export default function Sidebar({
  users,
  selectedUser,
  connected,
  searchQuery,
  onSearchChange,
  onSelectUser,
  currentUser,
}: SidebarProps) {
  const onlineCount = users.filter((u) => u.isOnline).length;

  return (
    <div className="w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">💬 Users</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">🟢 {onlineCount} online</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {connected ? "Live" : "Down"}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Search users..."
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => onSelectUser(u)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
              selectedUser?.id === u.id ? "bg-purple-50 border-l-4 border-l-purple-600" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {u.profileImage ? (
                  <Image src={u.profileImage} alt={u.fullName} width={48} height={48} className="rounded-full object-cover w-12 h-12" />
                ) : (
                  <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {u.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    u.isOnline ? "bg-blue-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">{u.fullName}</h3>
                  <span className="text-xs text-gray-400">{u.isOnline ? "Online" : "Offline"}</span>
                </div>
                {u.lastMessage && <p className="text-xs text-gray-500 truncate">{u.lastMessage}</p>}
              </div>
              {u.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold min-w-5 h-5 flex items-center justify-center rounded-full px-1">
                  {u.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Current User */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          {currentUser?.profileImage ? (
            <Image src={currentUser.profileImage} alt="You" width={40} height={40} className="rounded-full object-cover w-10 h-10" />
          ) : (
            <div className="w-10 h-10 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.fullName?.charAt(0)?.toUpperCase() || "Y"}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{currentUser?.fullName || "You"}</p>
            <p className="text-xs text-blue-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}