package com.quicktalk.backend.handler;

import com.quicktalk.backend.dto.MessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quicktalk.backend.producer.ChatKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
    private final ChatKafkaProducer chatKafkaProducer;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("새 연결: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        MessageDTO msg = objectMapper.readValue(payload, MessageDTO.class);

        System.out.println("받은 메시지: " + msg.getContent());

        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("연결 끊김: " + session.getId());
    }
}
