import { useRef } from "react";

interface MessageInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onTyping: (t: boolean) => void;
}

export default function MessageInput({ value, onChange, onSend, onTyping }: MessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-gray-100 border-t border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); onTyping(true); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onSend(); } }}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}