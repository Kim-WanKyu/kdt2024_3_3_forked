package com.acornshop.repository;

import com.acornshop.entity.GeneralMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneralMemberRepository extends JpaRepository<GeneralMember, String> {
    GeneralMember findByMemberId(String memberId);

    List<GeneralMember> findByNameAndPhone(String name, String phone);
//    List<Member> findAll();

}
