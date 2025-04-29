import { useContext, useEffect, useState } from 'react'; // ✅ useState 추가됨
import { useLocation, useNavigate } from 'react-router-dom';
import ChattingContext from '../contexts/ChattingContext';
import useChattingWebSocket from '../hooks/useChattingWebSocket';
import ChattingInfo from '../models/ChattingInfo';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';

function ChatRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatInfo, setChatInfo } = useContext(ChattingContext);
  const [ready, setReady] = useState(false); // ✅ WebSocket 연결 조건

  useEffect(() => {
    const { roomId, nickname, roomTitle } = location.state || {};
    console.log("⛳️ useEffect 진입:", roomId, nickname, roomTitle);
  
    if (roomId && nickname) {
      const info = new ChattingInfo({
        id: Date.now().toString(),
        name: nickname,
        roomNumber: roomTitle || roomId,
        messages: []
      });
  
      console.log("📦 새 ChattingInfo 객체:", info);  // ← 여기 반드시 확인!
      setChatInfo(info);
      setReady(true);
    }
  }, [location, setChatInfo]);
  
  const url = ready ? `ws://localhost:8080/ws` : null;
  const { sendMessage, sendTyping, isTyping, closeSocket } = useChattingWebSocket(url);

  const handleSendMessage = (newMessage) => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
    }
  };

  const handleLeave = () => {
    closeSocket(); // ✅ 소켓 닫기
    setChatInfo(new ChattingInfo()); // ✅ 상태 초기화
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-blue-600">{chatInfo.roomNumber || "대화방"}</h2>
          <p className="text-sm text-gray-500">{chatInfo.name || "닉네임"}</p>
        </div>
        <button
          onClick={handleLeave}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          나가기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
        <MessageList messages={chatInfo.messages} />
      </div>

      {isTyping && <TypingIndicator nickname="상대방" />}

      <MessageInput onSend={handleSendMessage} onTyping={sendTyping} />
    </div>
  );
}

export default ChatRoom;
