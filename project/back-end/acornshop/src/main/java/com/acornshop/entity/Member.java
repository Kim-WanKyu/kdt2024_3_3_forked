package com.acornshop.entity;


import com.acornshop.constant.MemberRole;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "members")
@Inheritance(strategy = InheritanceType.JOINED) // 조인 전략
public abstract class Member extends BaseEntity {

    @Id
    @Column(name = "member_id", nullable = false, updatable = false)
    private String memberId; //회원 uid.

    private String email;   // 이메일.

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(updatable = false)
    private MemberRole role;  // 역할(일반회원/배달부/관리자).

}
