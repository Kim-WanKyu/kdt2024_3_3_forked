//package com.acornshop.controller;
//
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/auth")
//public class AuthController {
//
//    @GetMapping("/validate-token")
//    public String validateToken(HttpServletRequest request) {
//        // Authorization 헤더에서 Bearer 토큰 추출
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return "토큰이 없습니다.";
//        }
//
//        String idToken = authHeader.substring(7); // "Bearer " 부분 제거
//        try {
//            // Firebase에서 토큰 검증
//            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
//            String uid = decodedToken.getUid(); // Firebase 사용자 UID 가져오기
//            return "토큰 검증 성공, UID: " + uid;
//        } catch (Exception e) {
//            return "토큰 검증 실패: " + e.getMessage();
//        }
//    }
//}
