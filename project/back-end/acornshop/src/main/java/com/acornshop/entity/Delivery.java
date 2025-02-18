package com.acornshop.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "delivery_man_id")
    private DeliveryMember deliveryMan;

    private String location;

    private LocalDateTime deliveryTime;

    private String deliveryStatus;

//    private Long price;
}
