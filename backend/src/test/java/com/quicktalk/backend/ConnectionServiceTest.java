package com.quicktalk.backend;

import com.quicktalk.backend.service.ConnectService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ConnectServiceTest {

    private final ConnectService connectService = new ConnectService();

    @Test
    void connectUser_whenWaitingQueueIsEmpty_thenUserAdded() {
        // given
        String userId = "userA";

        // when
        String result = connectService.connectUser(userId);

        // then
        assertEquals("Waiting for another user...", result);
    }

    @Test
    void connectUser_whenWaitingQueueNotEmpty_thenUsersMatched() {
        // given
        connectService.connectUser("userA");
        String userB = "userB";

        // when
        String result = connectService.connectUser(userB);

        // then
        assertTrue(result.contains("Matched with user: userA"));
    }

    @Test
    void disconnectUser_whenMatched_thenBothDisconnected() {
        // given
        connectService.connectUser("userA");
        connectService.connectUser("userB");

        // when
        String result = connectService.disconnectUser("userA");

        // then
        assertTrue(result.contains("Disconnected from matched user:"));
    }

    @Test
    void disconnectUser_whenNotMatched_thenRemovedFromQueue() {
        // given
        connectService.connectUser("userC");

        // when
        String result = connectService.disconnectUser("userC");

        // then
        assertEquals("Disconnected from waiting queue.", result);
    }

    @Test
    void sendMessage_whenMatched_thenReturnSuccessMessage() {
        // given
        connectService.connectUser("userA");
        connectService.connectUser("userB");

        // when
        String result = connectService.sendMessage("userA", "Hello B!");

        // then
        assertTrue(result.contains("Message sent to userB"));
    }

    @Test
    void sendMessage_whenNotMatched_thenReturnErrorMessage() {
        // given
        String result = connectService.sendMessage("unknownUser", "Hello?");

        // then
        assertEquals("You are not matched with anyone.", result);
    }
}
