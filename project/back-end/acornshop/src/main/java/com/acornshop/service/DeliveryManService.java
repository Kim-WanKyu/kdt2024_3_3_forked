package com.acornshop.service;

import com.acornshop.repository.DeliveryManRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class DeliveryManService {
    @Autowired
    private DeliveryManRepository deliveryManRepository;
}
