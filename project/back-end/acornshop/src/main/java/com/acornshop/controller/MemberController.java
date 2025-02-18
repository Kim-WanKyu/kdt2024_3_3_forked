package com.acornshop.controller;

import com.acornshop.dto.FindIdResponseDto;
import com.acornshop.dto.MemberUpdateFormDto;
import com.acornshop.entity.Member;
import com.acornshop.entity.MemberAddress;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.acornshop.entity.GeneralMember;
import com.acornshop.service.GeneralMemberService;
import com.acornshop.dto.MemberPostFormDto;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MemberController {

    @Autowired
    private GeneralMemberService generalMemberService;

    // 유저 조회.
    @GetMapping("/member/{uid}")
    public ResponseEntity<GeneralMember> getMember(@PathVariable String uid) {
        System.out.print("getMember - (" + uid + ")");
        GeneralMember member = generalMemberService.findByUid(uid);
        if (member == null) {
            System.out.println("getMember - isEmpty . notFound.");
            return ResponseEntity.notFound().build();
        }
        System.out.println("getMember - ok. " + member);
        return ResponseEntity.ok(member);
    }

    // 유저 삭제.
    @DeleteMapping("/member/{uid}")
    public ResponseEntity<GeneralMember>  deleteMember(@PathVariable String uid) throws FirebaseAuthException {
        System.out.print("deleteMember - (" + uid + ")");

        try {
            GeneralMember member = generalMemberService.deleteMember(uid);

            System.out.print("deleteMember(uid) = " + member + "(" + uid + ")");
            if (member == null) {
                System.out.println(" - null");
                return ResponseEntity.notFound().build();
            }

            System.out.println(" - ok");
            return ResponseEntity.ok(member);
        } catch (FirebaseAuthException e) {
            // deleteMember 에러 발생.
            System.out.println("deleteMember - internalServerError. (FirebaseAuthException)");
            return ResponseEntity.internalServerError().build();
        }
    }

    // 전체 유저 조회. (페이징) // 요청보낼 때 ?page={페이지번호(1~)}&size={크기} => /member?page={1}&{10}
    @GetMapping("/member")
    public ResponseEntity<Page<GeneralMember>> getMembers(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        System.out.println("getMembers= => /member?page={1}&{10}@GetMapping(/member)");
        System.out.println("getMembers=page: " + page + "size: " + size);
        if (page < 1 || size < 1) {
            // page, size 가 1보다 작으면, 잘못된 요청 반환.
            System.out.println("getMembers= if page, size < 1 .badRequest");
            return ResponseEntity.badRequest().build();
        }
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<GeneralMember> members = generalMemberService.getAllMemberWithPagination(pageable);
        System.out.println("getMembers=members: " + members);
        if (members.isEmpty()) {
            // 비어있으면, 찾을 수 없음 반환.
            System.out.println("getMembers= isEmpty . notFound.");
            return ResponseEntity.notFound().build();
        }
        System.out.println("getMembers= ok. " + members);
        return ResponseEntity.ok(members);
    }

    // 전체 유저 조회. (단순 리스트)
    @GetMapping("/all_members")
    public ResponseEntity<List<GeneralMember>> getAllMembers() {
        List<GeneralMember> members = generalMemberService.getAllMember();
        if (members.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(members);
    }

    // 유저 생성.
    @PostMapping("/member")
    public ResponseEntity<GeneralMember> createMember(@RequestBody MemberPostFormDto memberPostFormDto) {
        System.out.println("createMember - Received data: " + memberPostFormDto);

        // Member 생성.
        GeneralMember member = new GeneralMember();
        member.setMemberId(memberPostFormDto.getUid());
        member.setEmail(memberPostFormDto.getEmail());
        member.setName(memberPostFormDto.getName());
        member.setPhone(memberPostFormDto.getPhone());
        member.setBank(memberPostFormDto.getBank());
        member.setAccount(memberPostFormDto.getAccount());
        member.setBlacked(false);
        member.setRole(memberPostFormDto.getRole());

        List<MemberAddress> newAddresses = new ArrayList<>();
        MemberAddress newMemberAddress = memberPostFormDto.getAddress();
        newMemberAddress.setMember(member);
        System.out.println("newMemberAddress: " + newMemberAddress);

        newAddresses.add(newMemberAddress);

        member.setMemberAddresses(newAddresses);

        // Member 저장.
        GeneralMember savedMember = generalMemberService.saveMember(member);

        return ResponseEntity.ok(savedMember);
    }

    // 유저 정보 수정.
    @PutMapping("/member/{uid}")
    public ResponseEntity<GeneralMember> updateMember(@PathVariable String uid, @RequestBody MemberUpdateFormDto memberUpdateFormDto) {
        System.out.println("updateMember - " + "uid: " + uid +" - Received data: " + memberUpdateFormDto);
        GeneralMember member = generalMemberService.findByUid(uid);
        if (member == null) {
            System.out.println("updateMember - 찾는 멤버 없음. notFound;");
            return ResponseEntity.notFound().build();
        }

        System.out.println("updateMember -before- member: " + member);

        if (memberUpdateFormDto.getName() != null)
            member.setName(memberUpdateFormDto.getName());
        if (memberUpdateFormDto.getPhone() != null)
            member.setPhone(memberUpdateFormDto.getPhone());
        if (memberUpdateFormDto.getBank() != null)
            member.setBank(memberUpdateFormDto.getBank());
        if (memberUpdateFormDto.getAccount() != null)
            member.setAccount(memberUpdateFormDto.getAccount());


        GeneralMember updatedMember = generalMemberService.updateMember(member);
        System.out.println("updateMember -after- member: " + updatedMember);

        System.out.println("updateMember - ok; " + updatedMember);
        return ResponseEntity.ok(updatedMember);
    }

    // 유저 아이디(이메일) 찾기. name, phone
    //  // 요청보낼 때 ?name={name}&phone={phone} => /member/id?name={name}&phone={phone}
    @GetMapping("/member/id")
    public ResponseEntity<List<FindIdResponseDto>> findId(@RequestParam String name, @RequestParam String phone) {
        if (name.isBlank() || phone.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<FindIdResponseDto> responseList = generalMemberService.findId(name, phone);
        if (responseList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(responseList);
    }

    // 유저 블랙. // 요청보낼 때 ?value={t/f} => /member/{uid}/black?value={value}
    @PutMapping("/member/{uid}/black")
    public ResponseEntity<GeneralMember> blackMember(@PathVariable String uid, @RequestParam(defaultValue = "f") String value) {
        System.out.println("blackMember - " + "uid: " + uid +" - value: " + value);
        GeneralMember member = generalMemberService.findByUid(uid);
        if (member == null) {
            System.out.println("blackMember - 찾는 멤버 없음. notFound;");
            return ResponseEntity.notFound().build();
        }
        if (!(value.equals("t") || value.equals("f"))) {
            System.out.println("blackMember - value 잘못됨 (t/f 아님.). badRequest;");
            return ResponseEntity.badRequest().build();
        }

        member.setBlacked(value.equals("t"));

        System.out.println("blackMember -  ok; " + member);
        GeneralMember updatedMember = generalMemberService.updateMember(member);

        return ResponseEntity.ok(updatedMember);
    }
}
