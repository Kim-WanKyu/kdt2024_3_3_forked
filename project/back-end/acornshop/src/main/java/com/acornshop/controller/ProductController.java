package com.acornshop.controller;

import com.acornshop.dto.ProductCategoryPostFormDto;
import com.acornshop.dto.ProductPostFormDto;
import com.acornshop.dto.ProductUpdateFormDto;
import com.acornshop.entity.Product;
import com.acornshop.entity.ProductCategory;
import com.acornshop.entity.ProductImage;
import com.acornshop.service.GeneralMemberService;
import com.acornshop.service.ProductCategoryService;
import com.acornshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private GeneralMemberService memberService;
    @Autowired
    private ProductService productService;

    @Autowired
    private ProductCategoryService productCategoryService;

    // 상품 카테고리 조회.
    @GetMapping("product/category/{id}")
    public ResponseEntity<ProductCategory> getProductCategory(@PathVariable Long id) {
        ProductCategory category = productCategoryService.findById(id).orElse(null);
        if (category == null) {
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }

    // 상품 카테고리 전체 조회.
    @GetMapping("/product/category")
    public ResponseEntity<Page<ProductCategory>> getProductCategories(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {

        if (page < 1 || size < 1) {
            // page 가 1보다 작으면, 잘못된 요청 반환.
            return ResponseEntity.badRequest().build();
        }
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<ProductCategory> categories = productCategoryService.getAllProductCategoriesWithPagination(pageable);
        if (categories.isEmpty()) {
            // 비어있으면, 찾을 수 없음 반환.
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categories);
    }

    // 상품 카테고리 추가.
    @PostMapping("/product/category")
    public ResponseEntity<ProductCategory> createProductCategory(@RequestBody ProductCategoryPostFormDto productCategoryPostFormDto) {
        // Product 생성.
        ProductCategory productCategory = new ProductCategory();
        productCategory.setName(productCategoryPostFormDto.getName());
        // Product 저장.
        ProductCategory savedProductCategory = productCategoryService.saveProductCategory(productCategory);

        return ResponseEntity.ok(savedProductCategory);
    }
    // 상품 카테고리 수정.
    @PutMapping("/product/category/{id}")
    public ResponseEntity<ProductCategory> updateProductCategory(@PathVariable Long id, @RequestBody ProductCategoryPostFormDto productCategoryPostFormDto) {
        ProductCategory productCategory = productCategoryService.findById(id).orElse(null);
        if (productCategory == null) {
            return ResponseEntity.notFound().build();
        }
//        if (productCategoryService.findByName(productCategory.getName()).getName().isBlank()) {
//            return ResponseEntity.badRequest().build();
//        }

        productCategory.setName(productCategoryPostFormDto.getName());

        ProductCategory updatedProduct = productCategoryService.updateProductCategory(productCategory);

        return ResponseEntity.ok(updatedProduct);
    }

    // 상품 카테고리 삭제.
    @DeleteMapping("/product/category/{id}")
    public ResponseEntity<ProductCategory> deleteProductCategory(@PathVariable Long id) {
        ProductCategory category = productCategoryService.deleteProductCategory(id);
        if (category == null) {
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }
    ///////////////////////////////////////

    // 상품 조회.
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id) {
        System.out.print("getProduct - (" + id + ")");
        Product product = productService.findById(id).orElse(null);
        if (product == null) {
            System.out.println("getProduct - isEmpty . notFound.");
            return ResponseEntity.notFound().build();
        }
        System.out.println("getProduct - ok. " + product);
        return ResponseEntity.ok(product);
    }



    // 상품 삭제.
    @DeleteMapping("/product/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable String id) {
        System.out.print("deleteProduct - (" + id + ")");
        Product product = productService.deleteProduct(id);
        System.out.print("deleteProduct(uid) = " + product + "(" + id + ")");
        if (product == null) {
            System.out.println(" -> null");
            return ResponseEntity.notFound().build();
        }
        System.out.println(" -> ok");
        return ResponseEntity.ok(product);
    }

    // 전체 상품 조회. (페이징) // 요청보낼 때 ?page={페이지번호(1~)} => /member?page={1}
    @GetMapping("/product")
    public ResponseEntity<Page<Product>> getProducts(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        System.out.println("getProducts=page: " + page + "size: " + size);
        if (page < 1 || size < 1) {
            // page 가 1보다 작으면, 잘못된 요청 반환.
            System.out.println("getProducts= if page, size < 1 .badRequest");
            return ResponseEntity.badRequest().build();
        }
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<Product> products = productService.getAllProductsWithPagination(pageable);
        System.out.println("getProducts=products: " + products);
        if (products.isEmpty()) {
            // 비어있으면, 찾을 수 없음 반환.
            System.out.println("getProducts= isEmpty . notFound.");
            return ResponseEntity.notFound().build();
        }
        System.out.println("getProducts= ok. " + products);
        return ResponseEntity.ok(products);
    }

    // 전체 상품 조회. (단순 리스트)
    @GetMapping("/all_products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        if (products.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(products);
    }

    // 상품 생성.
    @PostMapping("/product")
    public ResponseEntity<Product> createProduct(@RequestBody ProductPostFormDto productFormDto) {
        System.out.println("createProduct - Received data: " + productFormDto);

        // Product 생성.
        Product product = new Product();
        product.setProductId(productFormDto.getProductId());
        product.setSeller(memberService.findByUid(productFormDto.getSeller()));
        product.setTitle(productFormDto.getTitle());
        product.setPrice(productFormDto.getPrice());
        product.setDetail(productFormDto.getDetail());
        product.setTradePlace(productFormDto.getTradePlace());
        product.setCategory(productCategoryService.findByName(productFormDto.getCategory()));
        product.setIsDelivery(productFormDto.getIsDelivery());
        product.setIsNegotiable(productFormDto.getIsNegotiable());

        List<ProductImage> productImages = productFormDto.getProductImages();
        if (!productFormDto.getProductImages().isEmpty()) {
            for (ProductImage productImage : productFormDto.getProductImages()) {
                productImage.setProduct(product);
                System.out.println("new productImage: " + productImage);
            }
        }
        product.setProductImages(productImages);

        // Product 저장.
        Product savedProduct = productService.saveProduct(product);

        return ResponseEntity.ok(savedProduct);
    }

    // 상품 정보 수정.
    @PutMapping("/product/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody ProductPostFormDto productFormDto) {
        Product product = productService.findById(id).orElse(null);
        if (product == null) {
            // id 에 해당하는 상품이 없는 경우.
            System.out.println("updateProduct - notFound. id: " + id);
            return ResponseEntity.notFound().build();
        }

        // 상품 판매자와 수정하려는 form 의 유저가 다른 경우.
        if (!product.getSeller().getMemberId().equals(productFormDto.getSeller())) {
            System.out.println("updateProduct - badRequest. !product.seller.uid != productFormDto.seller(uid) ");
            return  ResponseEntity.badRequest().build();
        }

        product.setTitle(productFormDto.getTitle());
        product.setDetail(productFormDto.getDetail());
        product.setPrice(productFormDto.getPrice());
        product.setCategory(productCategoryService.findByName(productFormDto.getCategory()));
        product.setTradePlace(productFormDto.getTradePlace());
        product.setIsDelivery(productFormDto.getIsDelivery());
        product.setIsNegotiable(productFormDto.getIsNegotiable());

        product.setProductImages(productFormDto.getProductImages());

        Product updatedProduct = productService.updateProduct(product);

        return ResponseEntity.ok(updatedProduct);
    }
}
