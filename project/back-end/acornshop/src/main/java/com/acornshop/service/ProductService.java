package com.acornshop.service;

import com.acornshop.dto.ProductPostFormDto;
import com.acornshop.dto.ProductUpdateFormDto;
import com.acornshop.entity.Product;
import com.acornshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
//
    @Autowired
    private ProductRepository productRepository;
//
    public Optional<Product> findById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public Page<Product> getAllProductsWithPagination(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    public Product save(ProductPostFormDto productPostFormDto) {
        return productRepository.save(productPostFormDto.toEntity());
    }

    @Transactional
    public Product updateProduct(Product product) {
        Product p = productRepository.findById(product.getProductId()).orElse(null);
        if (p != null) {
            productRepository.save(product);
        }

        return p;
    }
    @Transactional
    public Product update(ProductUpdateFormDto productUpdateFormDto) {
        Product p = productRepository.findById(productUpdateFormDto.getProductId()).orElse(null);
        if (p != null) {
            productRepository.save(productUpdateFormDto.toEntity());
        }
        return p;
    }

    @Transactional
    public Product deleteProduct(String id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            productRepository.delete(product);
        }

        return product;
    }

}
