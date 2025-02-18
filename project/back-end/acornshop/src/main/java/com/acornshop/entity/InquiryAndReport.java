package com.acornshop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inquiry_report")
public class InquiryAndReport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "inquiry_member_id")
    GeneralMember inquiryMember;

    String inquiryDetail;

    @ManyToOne
    @JoinColumn(name = "answered_admin_id")
    AdminMember answeredAdmin;

    String answer;

    Boolean isReport;

    @ManyToOne
    @JoinColumn(name = "reported_member_id")
    GeneralMember reportedMember;
}
