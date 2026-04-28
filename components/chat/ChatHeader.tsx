import { User } from "@/src/types/chat.type";
import Image from "next/image";


interface ChatHeaderProps {
  user: User;
  typingUser: string;
  onClose: () => void;
}

export default function ChatHeader({ user, typingUser, onClose }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
      <div className="flex items-center gap-3">
        <div className="relative">
          {user.profileImage ? (
            <Image src={user.profileImage} alt={user.fullName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
          ) : (
            <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.isOnline ? "bg-blue-500" : "bg-gray-400"}`} />
        </div>
        <div>
          <h3 className="font-semibold">{user.fullName}</h3>
          <p className="text-xs text-gray-500">
            {typingUser === user.id ? "Typing..." : user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 text-xl">✕</button>
    </div>
  );
}