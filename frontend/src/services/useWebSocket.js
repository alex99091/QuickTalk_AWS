import { useEffect, useRef, useState } from "react";

const useWebSocket = (roomId, nickname) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!roomId || !nickname) return;

    const socket = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${encodeURIComponent(roomId)}&nickname=${encodeURIComponent(nickname)}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");

      // 서버에 입장 알림 보내기
      socket.send(JSON.stringify({
        type: "ENTER",
        roomId: roomId.toString(),   // ✅ 수정: roomId를 URL이 아니라 "번호"로 보내기
        sender: nickname,
        message: "",
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "MESSAGE") {
        setMessages((prev) => [...prev, { sender: data.sender, text: data.message }]);
      } else if (data.type === "TYPING") {
        if (data.sender !== nickname) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 1000);
        }
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      socket.close();
    };
  }, [roomId, nickname]);

  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("✅ 메시지 전송 시도:", text);

      socketRef.current.send(JSON.stringify({
        type: "MESSAGE",
        roomId: roomId.toString(),   // ✅ 수정
        sender: nickname,
        message: text,
      }));
    } else {
      console.log("❌ 소켓 연결 안됨");
    }
  };

  const sendTyping = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "TYPING",
        roomId: roomId.toString(),   // ✅ 수정
        sender: nickname,
        message: "",
      }));
    }
  };

  return { messages, sendMessage, sendTyping, isTyping };
};

export default useWebSocket;
