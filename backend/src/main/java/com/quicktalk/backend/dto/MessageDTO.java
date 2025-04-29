package com.quicktalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private String id;         // 유저 ID
    private String name;       // 유저 닉네임
    private String roomNumber; // 방 번호
    private String content;    // 메시지 내용
    private String type;       // "ENTER", "MESSAGE", "EXIT" 구분
}
