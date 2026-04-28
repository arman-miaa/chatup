
import { ChatMessage } from "@/src/types/chat.type";

interface MessageBubbleProps {
  msg: ChatMessage;
  isOwn: boolean;
  formatTime: (d: string) => string;
  onReact: (id: string, r: string) => void;
  onEdit: (id: string, msg: string) => void;
  onDelete: (id: string, forEveryone: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function MessageBubble({ msg, isOwn, formatTime, onReact, onEdit, onDelete }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[70%] group">
        <div className={`relative rounded-2xl px-4 py-2 shadow-sm ${isOwn ? "bg-[#DCF8C6]" : "bg-white"}`}>
          {msg.isDeleted ? (
            <p className="italic text-gray-400 text-sm">Deleted</p>
          ) : (
            <>
              <p className="text-sm">{msg.message}</p>
              {msg.isEdited && <span className="text-xs text-gray-400 ml-1">(edited)</span>}
            </>
          )}
          {msg.reaction && (
            <span className="absolute -bottom-2 -right-2 text-lg bg-white rounded-full px-1 shadow">{msg.reaction}</span>
          )}
        </div>
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
          {isOwn && (
            <span className="text-[10px]">
              {msg.isRead ? (
                <span className="text-blue-500">✓✓</span>
              ) : (
                <span className="text-gray-400">✓</span>
              )}
            </span>
          )}
          {/* Hover Actions */}
          {/* <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition ml-1">
            {["❤️", "👍", "😂"].map((r) => (
              <button key={r} onClick={() => onReact(msg.id, r)} className="text-xs hover:scale-125">{r}</button>
            ))}
            {isOwn && !msg.isDeleted && (
              <>
                <button onClick={() => { const m = prompt("Edit:", msg.message); if (m) onEdit(msg.id, m); }} className="text-xs">✏️</button>
                <button onClick={() => { confirm("Delete for everyone?") ? onDelete(msg.id, true) : onDelete(msg.id, false); }} className="text-xs">🗑️</button>
              </>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}