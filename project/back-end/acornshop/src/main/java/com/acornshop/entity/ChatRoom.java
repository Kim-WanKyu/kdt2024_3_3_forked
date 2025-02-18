package com.acornshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@ToString
@SuperBuilder
@Entity
@NoArgsConstructor
@Table(name = "chat_room")
public class ChatRoom extends BaseEntity {

    // id.
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long roomId;

    @Column(unique = true)
    private String uid;

    // buyer.
    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private GeneralMember buyer;

    // product.
    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    // seller.
    @ManyToOne
    @JoinColumn(name = "seller_id")
    private GeneralMember seller;
}
