package com.acornshop.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@SuperBuilder
@Entity
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Table(name = "product")
public class Product extends BaseEntity {

    @Id
    @Column(name="product_id", updatable = false)
    private String productId; // 게시글(상품)id.

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false, updatable = false)
    private GeneralMember seller;     // 판매자.

    @Column(nullable = false)
    private String title;   // 제목.

    private Integer price;     // 가격.

    private String detail;  // 세부설명.

    private String tradePlace;  // 거래 희망 위치.

    private Boolean isDelivery; // 직거래/배달여부.

    private Boolean isNegotiable;   // 가격 제안 가능 여부.

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category; // 상품카테고리.

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<ProductImage> productImages = new ArrayList<>(); // 상품 이미지들.
}
