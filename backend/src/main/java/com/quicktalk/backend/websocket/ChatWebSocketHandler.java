package com.quicktalk.backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Set<WebSocketSession>> chatRooms = new HashMap<>();
    private final Map<String, String> sessionNicknames = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String query = Optional.ofNullable(session.getUri())
                .map(uri -> uri.getQuery())
                .orElse("");

        Map<String, String> params = parseQueryParams(query);
        String roomId = params.getOrDefault("roomId", "defaultRoom");
        String nickname = params.getOrDefault("nickname", "익명" + session.getId().substring(0, 5));

        session.getAttributes().put("roomId", roomId);
        session.getAttributes().put("nickname", nickname);

        chatRooms.computeIfAbsent(roomId, k -> new HashSet<>()).add(session);
        sessionNicknames.put(session.getId(), nickname);

        System.out.println("✅ " + nickname + "님이 [" + roomId + "] 방에 입장했습니다.");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("📨 수신 메시지: " + payload);

        Map<String, Object> data = objectMapper.readValue(payload, Map.class);
        String type = (String) data.get("type");
        String text = (String) data.get("message");

        String roomId = (String) session.getAttributes().get("roomId");
        String sender = (String) session.getAttributes().get("nickname");

        if (roomId == null || sender == null) {
            System.out.println("⚠️ roomId 또는 sender가 null입니다. 세션 ID: " + session.getId());
            return;
        }

        if ("MESSAGE".equals(type) || "TYPING".equals(type)) {
            broadcastMessage(roomId, type, sender, text);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = (String) session.getAttributes().get("roomId");
        if (roomId != null && chatRooms.containsKey(roomId)) {
            chatRooms.get(roomId).remove(session);
            if (chatRooms.get(roomId).isEmpty()) {
                chatRooms.remove(roomId); // 방에 아무도 없으면 삭제
            }
        }
        sessionNicknames.remove(session.getId());

        System.out.println("❌ 연결 종료: " + session.getId());
    }

    private void broadcastMessage(String roomId, String type, String sender, String text) throws Exception {
        if (!chatRooms.containsKey(roomId)) return;

        Map<String, Object> message = new HashMap<>();
        message.put("type", type);
        message.put("sender", sender);
        message.put("message", text);

        String json = objectMapper.writeValueAsString(message);

        for (WebSocketSession s : chatRooms.get(roomId)) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(json));
            }
        }
    }

    private Map<String, String> parseQueryParams(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null || query.isEmpty()) return result;

        for (String param : query.split("&")) {
            String[] parts = param.split("=", 2);
            if (parts.length == 2) {
                result.put(parts[0], URLDecoder.decode(parts[1], StandardCharsets.UTF_8));
            }
        }
        return result;
    }
}