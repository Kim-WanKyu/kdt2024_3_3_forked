package com.acornshop.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "delivery_member")
@PrimaryKeyJoinColumn(name = "member_id")
public class DeliveryMember extends GeneralMember {
    private Boolean deliveryStatus;  // 배달 가능 상태.

    @OneToMany(mappedBy = "deliveryMan", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DeliveryLocation> deliveryLocations = new ArrayList<>(); // 배달가능주소.
}
