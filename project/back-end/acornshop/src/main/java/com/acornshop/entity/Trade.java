package com.acornshop.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "trade")
public class Trade extends BaseEntity {

    // 거래 id.
    @Id
    @Column(name = "trade_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // 게시글(상품) id.
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // 구매자 id.
    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private GeneralMember buyer;

    // 거래장소.
    private String location;

    // 거래 일자.
    private LocalDateTime tradeTime;

    // 거래 상태.
    private String status;

    // 배달 여부.
    private Boolean isDelivery;

    // 배달 ID.
    @OneToOne
    @JoinColumn(name = "delivery_id", unique = true)
    private Delivery deliveryId;
}
