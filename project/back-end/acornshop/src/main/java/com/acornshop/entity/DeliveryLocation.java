package com.acornshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "delivery_location")
public class DeliveryLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "delivery_man_id")
    private DeliveryMember deliveryMan;

    @ManyToOne
    @JoinColumn(name = "bCode")
    private AddressB addressB;
}
