import { useContext, useEffect } from 'react';
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

    // 채팅방 번호와 닉네임 세팅
    useEffect(() => {
        const { roomId, nickname } = location.state || {};
        if (roomId && nickname) {
            setChatInfo(prev => ({
                ...prev,
                roomNumber: roomId,
            name: nickname,
        }));
        }
    }, [location, setChatInfo]);

    const url = `ws://localhost:8080/ws`; // 실서버 주소로 바꿔야 함
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
              <h2 className="text-xl font-bold text-blue-600">{chatInfo.roomNumber} 방</h2>
              <p className="text-sm text-gray-500">{chatInfo.name}</p>
            </div>
            <button onClick={handleLeave} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500">
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
