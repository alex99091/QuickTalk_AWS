import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket from "../services/useWebSocket";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";

function ChatRoom() {
    const location = useLocation();
    const navigate = useNavigate();

    const rawNickname = location.state?.nickname?.trim();
    const [nickname] = useState(rawNickname ? rawNickname : `익명${Math.floor(Math.random() * 10000)}`);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const { sendMessage } = useWebSocket("ws://localhost:8080/ws/chat", (data) => {
        if (data.type === "message") {
            setMessages(prev => [...prev, { sender: data.sender, text: data.text }]);
        } else if (data.type === "typing") {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
        }
    });

    const handleSendMessage = (newMessage) => {
        if (newMessage.trim()) {
            sendMessage({ type: "message", sender: nickname, text: newMessage });
        }
    };

    const handleTyping = () => {
        sendMessage({ type: "typing", sender: nickname });
    };

    const handleLeave = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-600">채팅방 - {nickname}</h2>
                <button
                    onClick={handleLeave}
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                >
                    나가기
                </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
                <MessageList messages={messages} />
            </div>

            {isTyping && <TypingIndicator nickname="상대방" />}

            <MessageInput onSend={handleSendMessage} onTyping={handleTyping} />
        </div>
    );
}

export default ChatRoom;
