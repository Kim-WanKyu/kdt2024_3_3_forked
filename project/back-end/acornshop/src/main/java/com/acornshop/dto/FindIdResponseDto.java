package com.acornshop.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Data
public class FindIdResponseDto {
    private String email;
    private String name;
    private LocalDateTime createdAt;
}