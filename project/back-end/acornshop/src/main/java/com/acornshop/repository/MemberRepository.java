package com.acornshop.repository;

import com.acornshop.entity.GeneralMember;
import com.acornshop.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    Member findByMemberId(String memberId);
}
