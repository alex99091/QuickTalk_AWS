package com.quicktalk.backend.consumer;

import com.quicktalk.backend.entity.AlertLog;
import com.quicktalk.backend.repository.AlertLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertKafkaConsumer {

    private final AlertLogRepository alertLogRepository;

    @KafkaListener(topics = "danger-alert-topic", groupId = "alert-group")
    public void listen(String message) {
        log.warn("⚠️ 위험 메시지 감지: {}", message);

        AlertLog alert = new AlertLog();
        alert.setContent(message);
        alert.setCreatedAt(LocalDateTime.now());

        alertLogRepository.save(alert);
    }
}
