package com.acornshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.geo.Point;

@Getter
@Setter
@Entity
@Table(name = "member_address")
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
public class MemberAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "member_id")
    private GeneralMember member;

    private String roadAddress;     // 주소.(도로명주소).
    private String detailAddress;   // 주소 세부주소.
    private String bCode;      // 법정동코드.

    @Override
    public String toString() {
        return "roadAddress: " + roadAddress +
                "detailAddress: " + detailAddress +
                "bCode: " + bCode;
    }
}
