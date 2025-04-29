package com.quicktalk.backend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quicktalk.backend.dto.MessageDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MessageDTOTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createAndAccessFields() {
        // given
        MessageDTO message = new MessageDTO(
                "user1",
                "Alex",
                "room123",
                "Hello from frontend!",
                "MESSAGE"
        );

        // when & then
        assertEquals("user1", message.getId());
        assertEquals("Alex", message.getName());
        assertEquals("room123", message.getRoomNumber());
        assertEquals("Hello from frontend!", message.getContent());
        assertEquals("MESSAGE", message.getType());

        System.out.println("DTO 필드 확인: " + message);
    }

    @Test
    void noArgsConstructorAndSetter() {
        // given
        MessageDTO message = new MessageDTO();

        // when
        message.setId("user2");
        message.setName("AlexK1");
        message.setRoomNumber("room456");
        message.setContent("Hello Again");
        message.setType("ENTER");

        // then
        assertEquals("user2", message.getId());
        assertEquals("AlexK2", message.getName());
        assertEquals("room456", message.getRoomNumber());
        assertEquals("Hello Again", message.getContent());
        assertEquals("ENTER", message.getType());

        System.out.println("DTO Setter 사용 결과: " + message);
    }

    @Test
    void serializeToJson() throws JsonProcessingException {
        // given
        MessageDTO message = new MessageDTO(
                "user3",
                "TestUser",
                "room789",
                "Test message",
                "MESSAGE"
        );

        // when
        String json = objectMapper.writeValueAsString(message);

        // then
        assertTrue(json.contains("\"id\":\"user3\""));
        assertTrue(json.contains("\"name\":\"TestUser\""));
        assertTrue(json.contains("\"roomNumber\":\"room789\""));
        assertTrue(json.contains("\"content\":\"Test message\""));
        assertTrue(json.contains("\"type\":\"MESSAGE\""));

        System.out.println("직렬화 결과 JSON: " + json);
    }

    @Test
    void deserializeFromJson() throws JsonProcessingException {
        // given
        String json = """
            {
              "id": "user4",
              "name": "AnotherUser",
              "roomNumber": "room999",
              "content": "Hello World",
              "type": "EXIT"
            }
            """;

        // when
        MessageDTO message = objectMapper.readValue(json, MessageDTO.class);

        // then
        assertEquals("user4", message.getId());
        assertEquals("AnotherUser", message.getName());
        assertEquals("room999", message.getRoomNumber());
        assertEquals("Hello World", message.getContent());
        assertEquals("EXIT", message.getType());

        System.out.println("역직렬화 결과 DTO: " + message);
    }
}

