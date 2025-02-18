package com.acornshop.repository;

import com.acornshop.entity.GeneralMember;
import com.acornshop.entity.Product;
import com.acornshop.entity.ProductCategory;
import jakarta.persistence.Column;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findBySeller(GeneralMember member);     // 판매자.

    List<Product> findByTitleContainingOrDetailContaining(String title, String detail);   // 제목 or 세부설명 포함.

    List<Product> findByPriceLessThanEqualOrderByPriceAsc(Integer price);     // 가격 이하. 오름차순.

    List<Product> findByCategory(ProductCategory productCategory);   // 카테고리.
}
