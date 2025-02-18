package com.acornshop.service;

import com.acornshop.entity.Product;
import com.acornshop.entity.ProductCategory;
import com.acornshop.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service

public class ProductCategoryService {
    @Autowired
    private ProductCategoryRepository productCategoryRepository;


    public ProductCategory findByName(String name) {
        return productCategoryRepository.findByName(name);
    }
    public Optional<ProductCategory> findById(Long id) {
        return productCategoryRepository.findById(id);
    }

    public Page<ProductCategory> getAllProductCategoriesWithPagination(Pageable pageable) {
        return productCategoryRepository.findAll(pageable);
    }


    public ProductCategory saveProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Transactional
    public ProductCategory updateProductCategory(ProductCategory productCategory) {
        ProductCategory p = productCategoryRepository.findById(productCategory.getId()).orElse(null);
        if (p != null) {
            productCategoryRepository.save(productCategory);
        }

        return p;
    }
    @Transactional
    public ProductCategory deleteProductCategory(Long id) {
        ProductCategory product = productCategoryRepository.findById(id).orElse(null);
        if (product != null) {
            productCategoryRepository.delete(product);
        }

        return product;
    }
}
