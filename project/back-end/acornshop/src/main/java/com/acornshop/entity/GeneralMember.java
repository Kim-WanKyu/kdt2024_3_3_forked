package com.acornshop.entity;

import com.acornshop.constant.MemberRole;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Table(name = "general_member")
@PrimaryKeyJoinColumn(name = "member_id")
public class GeneralMember extends Member {
    @Column(name = "phone_number")
    private String phone; // 전화번호.

    @Column(name = "bank")
    private String bank;   // 계좌은행.

    @Column(name = "account_number")
    private String account;   // 계좌번호.

    @Column(name = "is_blacked", nullable = false)
    private Boolean blacked;  // 블랙여부.

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<MemberAddress> memberAddresses = new ArrayList<>(); // 주소.
}
