import { useState } from "react";

function MessageInput({ onSend, onTyping }) {
    const [input, setInput] = useState("");

    const handleChange = (e) => {
        setInput(e.target.value);
        if (typeof onTyping === 'function') {
            onTyping(); // 안전하게 호출
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (trimmed) {
            onSend(trimmed); // 실제 메시지 전송
            setInput("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="메시지를 입력하세요..."
                className="flex-1 p-3 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 transition"
            >
                전송
            </button>
        </form>
    );
}

export default MessageInput;
