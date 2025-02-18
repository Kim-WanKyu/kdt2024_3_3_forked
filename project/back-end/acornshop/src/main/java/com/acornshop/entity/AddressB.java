package com.acornshop.entity;

//import com.acornshop.constant.PolygonConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.data.geo.Polygon;

// 주소 (법정동). 배달 가능 지역에서 시군구읍면동으로 나눌 때 사용.
@Getter
@Entity
@Table(name = "address_b")
public class AddressB {

    @Id
    @Column(name = "b_code")
    private String bCode;       // 법정동(리)코드.

    @Column(name = "address_name")
    private String addressName; // 법정동명.(풀주소)

    @Column(name = "higher_region_code")
    private String higherRegionCode; // 상위지역코드.&

    @Column(name = "lowest_region_name")
    private String lowestRegionName;   // 최하위지역명.
}
