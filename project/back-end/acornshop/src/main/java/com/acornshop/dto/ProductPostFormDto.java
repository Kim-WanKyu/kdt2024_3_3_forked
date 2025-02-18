package com.acornshop.dto;

import com.acornshop.entity.Product;
import com.acornshop.entity.ProductImage;
import com.acornshop.service.GeneralMemberService;
import com.acornshop.service.ProductCategoryService;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@Data
@AllArgsConstructor
// 상품 등록 dto.
public class ProductPostFormDto {
    private String productId;
    private String seller;              // 판매자 uid. (등록할 때의, 유저 uid)
    private Integer price;              // 가격.
    private String title;               // 제목.
    private String detail;              // 세부설명.
    private String tradePlace;          // 거래 희망 위치. // 주소.위치.지역.수정.필요.
    private Boolean isDelivery;         // 직거래/배달 여부.
    private Boolean isNegotiable;       // 가격 제안 가능 여부.
    private String category;            // 상품카테고리명.

    private List<ProductImage> productImages;   // 상품이미지들.


    public Product toEntity() {
        return Product.builder()
                .seller(new GeneralMemberService().findByUid(seller))
                .price(price)
                .title(title)
                .detail(detail)
                .tradePlace(tradePlace) // 주소.위치.지역.수정.필요.
                .isDelivery(isDelivery)
                .isNegotiable(isNegotiable)
                .category(new ProductCategoryService().findByName(category))
                .productImages(productImages)
                .build();
    }
}
