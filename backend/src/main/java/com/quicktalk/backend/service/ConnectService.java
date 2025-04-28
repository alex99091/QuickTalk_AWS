package com.quicktalk.backend.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConnectService {

    // TODO: 대기열 (waiting users)
    private final Queue<String> waitingQueue = new LinkedList<>();

    // TODO: 매칭된 사용자 쌍 (userId -> matchedUserId)
    private final Map<String, String> matchedUsers = new HashMap<>();

    // TODO: 사용자 연결 메소드
    public String connectUser(String userId) {
        if (waitingQueue.isEmpty()) {
            // 대기열이 비어있으면 본인을 대기열에 추가
            waitingQueue.add(userId);
            return "Waiting for another user...";
        } else {
            // 대기열에 다른 사용자가 있으면 매칭
            String matchedUser = waitingQueue.poll();
            matchedUsers.put(userId, matchedUser);
            matchedUsers.put(matchedUser, userId);
            return "Matched with user: " + matchedUser;
        }
    }

    // TODO: 사용자 연결 해제 메소드
    public String disconnectUser(String userId) {
        if (matchedUsers.containsKey(userId)) {
            // 매칭된 상대방도 연결 해제
            String partnerId = matchedUsers.get(userId);
            matchedUsers.remove(userId);
            matchedUsers.remove(partnerId);
            return "Disconnected from matched user: " + partnerId;
        } else {
            // 대기열에 있던 사용자면 제거
            waitingQueue.remove(userId);
            return "Disconnected from waiting queue.";
        }
    }

    // TODO: 메시지 전송 메소드 (임시 구조)
    public String sendMessage(String fromUserId, String message) {
        if (!matchedUsers.containsKey(fromUserId)) {
            return "You are not matched with anyone.";
        }
        String toUserId = matchedUsers.get(fromUserId);
        // 실제로는 WebSocket으로 메시지 전송할 예정
        return "Message sent to " + toUserId + ": " + message;
    }
}
