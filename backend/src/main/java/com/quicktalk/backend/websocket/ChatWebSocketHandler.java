package com.quicktalk.backend.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Set<WebSocketSession>> chatRooms = new HashMap<>();
    private final Map<String, String> nicknames = new HashMap<>(); // sessionId -> nickname 저장

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("✅ 클라이언트 소켓 연결됨! 세션 ID: " + session.getId());

        // URI에서 roomId, nickname 파싱
        String query = session.getUri().getQuery(); // 예: roomId=xxx&nickname=yyy
        if (query != null) {
            Map<String, String> paramMap = Arrays.stream(query.split("&"))
                    .map(param -> param.split("="))
                    .filter(pair -> pair.length == 2)
                    .collect(Collectors.toMap(pair -> pair[0], pair -> pair[1]));

            String roomId = paramMap.get("roomId");
            String nickname = paramMap.get("nickname");

            if (roomId != null && nickname != null) {
                chatRooms.putIfAbsent(roomId, new HashSet<>());
                chatRooms.get(roomId).add(session);

                nicknames.put(session.getId(), nickname);
                System.out.println("✅ " + nickname + "님이 " + roomId + " 방에 입장했습니다.");
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("수신된 메시지: " + payload);

        Map<String, Object> data = objectMapper.readValue(payload, Map.class);

        String type = (String) data.get("type");
        String roomId = (String) data.get("roomId");
        String sender = (String) data.get("sender");
        Object msgObj = data.get("message");

        if ("ENTER".equals(type)) {
            chatRooms.putIfAbsent(roomId, new HashSet<>());
            chatRooms.get(roomId).add(session);

            nicknames.put(session.getId(), sender); // 세션별 닉네임 저장

            System.out.println(sender + "님이 " + roomId + " 방에 입장했습니다.");
        } else if ("MESSAGE".equals(type) || "TYPING".equals(type)) {
            if (chatRooms.containsKey(roomId)) {
                for (WebSocketSession s : chatRooms.get(roomId)) {
                    if (s.isOpen()) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("type", type);
                        response.put("sender", nicknames.get(session.getId())); // 세션으로부터 닉네임 가져오기

                        if (msgObj instanceof Map) {
                            // message 안의 text만 꺼내서 전송
                            Map<String, Object> msgMap = (Map<String, Object>) msgObj;
                            response.put("text", msgMap.get("text"));
                        } else {
                            response.put("text", msgObj);
                        }

                        String json = objectMapper.writeValueAsString(response);
                        s.sendMessage(new TextMessage(json));
                    }
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("❌ 웹소켓 연결 종료: " + session.getId());
        nicknames.remove(session.getId());
        for (Set<WebSocketSession> sessions : chatRooms.values()) {
            sessions.remove(session);
        }
    }
}
