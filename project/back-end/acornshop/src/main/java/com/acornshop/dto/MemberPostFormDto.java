package com.acornshop.dto;

import com.acornshop.constant.MemberRole;
import com.acornshop.entity.MemberAddress;
import lombok.*;

@Getter
@Setter
@ToString
@Data
public class MemberPostFormDto {
    private String uid;
    private String email;
    private String name;
    private String phone;
    private String bank;
    private String account;
    private MemberAddress address;
    private MemberRole role;
}
