// src/hooks/useChattingWebSocket.js

import { useEffect, useRef, useContext } from 'react';
import ChattingContext from '../contexts/ChattingContext';
import ChattingInfo from '../models/ChattingInfo';

function useChattingWebSocket(url) {
  const { chatInfo, setChatInfo } = useContext(ChattingContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    // ✅ 기존 소켓이 있으면 닫기
    if (socketRef.current) {
      socketRef.current.close();
    }

    // ✅ 새 소켓 연결
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log('📩 받은 메시지:', msg);

        setChatInfo((prev) => {
          const updated = new ChattingInfo(prev);
          updated.addMessage(msg);
          return updated;
        });
      } catch (err) {
        console.error('❌ 메시지 파싱 실패:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket 에러:', error);
    };

    socket.onclose = () => {
      console.log('⚠️ WebSocket 연결 종료');
    };

    return () => {
      socket.close(); // ✅ 언마운트 시 정리
    };
  }, [url]);

  // ✅ 외부에서 소켓 수동 종료용 함수
  const closeSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
      console.log('❌ WebSocket 수동 종료');
    }
  };

  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        id: chatInfo.id || 'anonymous',
        name: chatInfo.name || '익명',
        roomNumber: chatInfo.roomNumber || 'default',
        content: text,
        type: 'MESSAGE',
      };
      socketRef.current.send(JSON.stringify(payload));
      console.log('📤 보낸 메시지:', payload);
    }
  };

  return { sendMessage, sendTyping: () => {}, isTyping: false, closeSocket };
}

export default useChattingWebSocket;