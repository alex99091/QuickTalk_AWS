package com.quicktalk.backend;

import com.quicktalk.backend.handler.ChatWebSocketHandler;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@SpringBootTest
public class ChatWebSocketHandlerTest {

    @Autowired
    private ChatWebSocketHandler chatWebSocketHandler;

    @Test
    public void testHandleTextMessage_withDangerMessage() throws Exception {
        // given
        WebSocketSession mockSession = Mockito.mock(WebSocketSession.class);
        Mockito.when(mockSession.isOpen()).thenReturn(true);
        Mockito.when(mockSession.getId()).thenReturn("test-session");

        String dangerJson = """
        {
          "id": "tester-123",
          "name": "Tester",
          "roomNumber": "room1",
          "content": "죽고싶어",
          "type": "MESSAGE"
        }
        """;


        TextMessage message = new TextMessage(dangerJson);

        // when
        chatWebSocketHandler.afterConnectionEstablished(mockSession); // 연결 시뮬레이션
        chatWebSocketHandler.handleTextMessage(mockSession, message); // 메시지 전송 시뮬레이션

        // then
        // 이후 Kafka → Consumer → MongoDB에 저장되었는지 확인
        // (MongoDB에서 직접 db.alert_logs.find() 또는 JPA로 검증 가능)
    }
}
