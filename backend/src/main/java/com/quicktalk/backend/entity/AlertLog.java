package com.quicktalk.backend.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "alert_logs")
public class AlertLog {

    @Id
    private String id;

    private String content;
    private LocalDateTime createdAt;
}
