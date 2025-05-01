package com.quicktalk.backend.producer;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatKafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public static final String TOPIC = "chat-monitor-topic";

    public void sendMessage(String message) {
        kafkaTemplate.send(TOPIC, message);
    }
}
