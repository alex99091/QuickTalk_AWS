package com.quicktalk.backend.controller;

import com.quicktalk.backend.service.ConnectService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConnectController {

    private final ConnectService connectService;

    public ConnectController(ConnectService connectService) {
        this.connectService = connectService;
    }

    @GetMapping("/connect")
    public String connectUser(@RequestParam String userId) {
        return connectService.connectUser(userId);
    }

    @GetMapping("/disconnect")
    public String disconnectUser(@RequestParam String userId) {
        return connectService.disconnectUser(userId);
    }
}
