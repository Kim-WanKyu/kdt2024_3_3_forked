package com.acornshop.dto;

import com.acornshop.constant.MemberRole;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MemberUpdateFormDto {
    private String name;
    private String phone;
    private String bank;
    private String account;
//    private String zipCode;
//    private String address;
}
