package com.acornshop.service;

import com.acornshop.constant.MemberRole;
import com.acornshop.dto.FindIdResponseDto;
import com.acornshop.entity.DeliveryMember;
import com.acornshop.entity.GeneralMember;
import com.acornshop.entity.Member;
import com.acornshop.repository.DeliveryManRepository;
import com.acornshop.repository.GeneralMemberRepository;
import com.acornshop.repository.MemberRepository;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeneralMemberService {
    @Autowired
    private GeneralMemberRepository generalMemberRepository;

    @Autowired
    private DeliveryManRepository deliveryManRepository;

    @Autowired
    private MemberRepository memberRepository;


    @Autowired
    private FirebaseAuthService firebaseAuthService;


    public GeneralMember saveMember(GeneralMember member) {
        return generalMemberRepository.save(member);
    }

    @Transactional
    public GeneralMember deleteMember(String uid) throws FirebaseAuthException {

        // 배달부인 경우, 배달부 테이블에서 삭제.
        DeliveryMember deliveryMember = deliveryManRepository.findByMemberId(uid);
        if (deliveryMember != null) {
            deliveryManRepository.delete(deliveryMember);
        }
        // 일반 회원 테이블에서 삭제.
        GeneralMember generalMember = generalMemberRepository.findByMemberId(uid);
        if (generalMember != null) {
            generalMemberRepository.delete(generalMember);
        }
        // Members 테이블에서도 삭제.
        memberRepository.deleteById(uid);
        // firebase 에서 삭제.
        firebaseAuthService.deleteUser(uid); // 삭제 실패 시 FirebaseAuthException 발생.

        return generalMember;
    }

    @Transactional
    public GeneralMember updateMember(GeneralMember member) {
        GeneralMember m = generalMemberRepository.findByMemberId(member.getMemberId());
        if (m != null) {
            generalMemberRepository.save(member);
        }

        return m;
    }

    public GeneralMember findByUid(String uid) {
        return generalMemberRepository.findByMemberId(uid);
    }

    public List<FindIdResponseDto> findId(String name, String phone) {
        List<GeneralMember> foundMembers = generalMemberRepository.findByNameAndPhone(name, phone);

        List<FindIdResponseDto> result = new ArrayList<>();
        for (GeneralMember member : foundMembers) {
            FindIdResponseDto idResponse = new FindIdResponseDto();
            idResponse.setEmail(member.getEmail());
            idResponse.setName(member.getName());
            idResponse.setCreatedAt(member.getCreateDate());

            result.add(idResponse);
        }

        return result;
    }

    public List<GeneralMember> getAllMember() {
        return generalMemberRepository.findAll();
    }
    public Page<GeneralMember> getAllMemberWithPagination(Pageable pageable) {
        return generalMemberRepository.findAll(pageable);
    }
}
