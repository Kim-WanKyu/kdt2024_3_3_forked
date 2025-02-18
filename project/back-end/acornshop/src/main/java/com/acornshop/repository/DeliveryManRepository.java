package com.acornshop.repository;

import com.acornshop.entity.DeliveryMember;
import com.acornshop.entity.GeneralMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryManRepository extends JpaRepository<DeliveryMember, String> {
    DeliveryMember findByMemberId(String memberId);

}
