package com.acornshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Table(name = "product_category")
public class ProductCategory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "product_category_id")
    private Long id;

    @Column(unique = true)
    private String name;
}

//1 "디지털/가전",
//2 "가구/인테리어",
//3 "유아동/유아도서",
//4 "생활/가공식품",
//5 "스포츠/레저",
//6 "여성잡화",
//7 "여성의류",
//8 "남성패션/잡화",
//9 "게임/취미",
//10 "미용",
//11 "반려동물용품",
//12 "식물",
//13 "기타"
