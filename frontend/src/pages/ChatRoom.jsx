import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useWebSocket from "../services/useWebSocket";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";

function ChatRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId, nickname } = location.state || {};

    const { messages, sendMessage, sendTyping, isTyping } = useWebSocket(roomId, nickname);

    const handleSendMessage = (newMessage) => {
        if (newMessage.trim()) {
            sendMessage(newMessage);
        }
    };

    const handleLeave = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4">
            {/* 상단 */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-blue-600">{roomId} 방</h2>
                    <p className="text-sm text-gray-500">{nickname}</p>
                </div>
                <button
                    onClick={handleLeave}
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                >
                    나가기
                </button>
            </div>

            {/* 메시지 리스트 */}
            <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
                <MessageList messages={messages} />
            </div>

            {/* 입력중 표시 */}
            {isTyping && <TypingIndicator nickname="상대방" />}

            {/* 입력창 */}
            <MessageInput onSend={handleSendMessage} onTyping={sendTyping} />
        </div>
    );
}

export default ChatRoom;
