import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";

function ChatRoom() {
    const location = useLocation();
    const navigate = useNavigate();

    const { nickname: passedNickname, roomTitle } = location.state || {};
    const [nickname] = useState(passedNickname || `익명${Math.floor(Math.random() * 10000)}`);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = (newMessage) => {
        if (newMessage.trim()) {
            setMessages((prev) => [...prev, { sender: nickname, text: newMessage }]);
        }
    };

    const handleTyping = () => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000); // 1초 동안 "입력중" 표시
    };

    const handleLeave = () => {
        // 홈으로 이동할 때 nickname은 남아있게 (따로 초기화 안함)
        navigate("/", { state: { nickname } });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4">
            {/* 상단 타이틀 */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-600">{roomTitle || "채팅방"}</h2>
                    <p className="text-sm text-gray-500">- {nickname}</p>
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
            {isTyping && <TypingIndicator nickname={nickname} />}

            {/* 입력창 */}
            <MessageInput onSend={handleSendMessage} onTyping={handleTyping} />
        </div>
    );
}

export default ChatRoom;
