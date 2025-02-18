package com.acornshop.entity;

import jakarta.persistence.*;
import lombok.ToString;

@Entity
@Table(name = "wishlist")
public class Wishlist extends BaseEntity {
    @Id
    @Column(name = "wishlist_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    @ToString.Exclude
    private GeneralMember member;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
