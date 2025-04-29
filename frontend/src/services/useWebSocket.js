import { useEffect, useRef, useState } from "react";

const useWebSocket = (roomId, nickname) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    console.log("🧩 [디버깅] useWebSocket 호출됨", { roomId, nickname });

    // roomId나 nickname이 없으면 연결 시도 안함
    if (!roomId || !nickname) {
      console.log("🛑 roomId 또는 nickname이 없습니다.", { roomId, nickname });
      return;
    }

    try {
      const socket = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${encodeURIComponent(roomId)}&nickname=${encodeURIComponent(nickname)}`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket Connected");

        // 연결되자마자 서버에 "입장" 알림
        socket.send(JSON.stringify({
          type: "ENTER",
          roomId: roomId.toString(),
          sender: nickname,
          message: "",
        }));
      };

      socket.onmessage = (event) => {
        console.log("📩 수신한 메시지:", event.data);

        const data = JSON.parse(event.data);

        if (data.type === "MESSAGE") {
          setMessages(prev => [...prev, { sender: data.sender, text: data.message }]);
        } else if (data.type === "TYPING") {
          if (data.sender !== nickname) {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
          }
        }
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket Error 발생:", error);
      };

      socket.onclose = () => {
        console.log("❌ WebSocket Disconnected");
      };

    } catch (error) {
      console.error("❌ WebSocket 연결 에러:", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, nickname]);

  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        id: chatInfo.id || 'anonymous',
        name: chatInfo.name || '익명',
        roomNumber: chatInfo.roomNumber || '❌실패', // 여기에 'default'가 나오면 chatInfo 문제!
        content: text,
        type: 'MESSAGE',
      };
      console.log('📤 보내는 메시지:', payload);
      socketRef.current.send(JSON.stringify(payload));
    }
  };
  
  const sendTyping = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("🟣 [입력중 알림 전송]");

      socketRef.current.send(JSON.stringify({
        type: "TYPING",
        roomId,
        sender: nickname,
        message: "",
      }));
    }
  };

  return { messages, sendMessage, sendTyping, isTyping };
};

export default useWebSocket;
