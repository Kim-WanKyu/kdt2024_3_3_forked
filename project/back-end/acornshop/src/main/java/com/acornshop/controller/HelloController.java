package com.acornshop.controller;

import com.acornshop.entity.GeneralMember;
import com.acornshop.service.FirebaseAuthService;
import com.acornshop.service.GeneralMemberService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {
    private final ObjectMapper objectMapper = new ObjectMapper();


    @Autowired
    private FirebaseAuthService firebaseAuthService;



    @GetMapping("/hello")
    public String hello() throws JsonProcessingException {
        Map<String, String> map = new HashMap<>();
        String hello = "안녕하세요. 현재 서버시간은 " + new Date() + "입니다.";
        map.put("result", hello);

        return objectMapper.writeValueAsString(map);
    }


    @PostMapping("/data")
    public ResponseEntity<String> receiveData(@RequestBody Map<String, String> payload) {
        System.out.println("Received data: " + payload);
        return ResponseEntity.ok(payload.toString());
    }


    @GetMapping("/hello-2/{uid}")
    public ResponseEntity<UserRecord> hello2(@PathVariable String uid) {
        try {
            System.out.println("hello2 - " + uid);
            UserRecord a = firebaseAuthService.getUserByUid(uid);
            return ResponseEntity.ok(a);
        } catch (Exception e) {
            System.out.println("UserRecord badRequest. = " + e);
            return ResponseEntity.badRequest().build();
        }
    }
}
