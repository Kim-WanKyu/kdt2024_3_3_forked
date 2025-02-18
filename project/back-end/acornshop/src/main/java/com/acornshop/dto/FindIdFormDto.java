package com.acornshop.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class FindIdFormDto {
    private String name;
    private String phone;
}