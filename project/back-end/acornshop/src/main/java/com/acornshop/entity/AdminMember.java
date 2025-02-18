package com.acornshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "admin_member")
@PrimaryKeyJoinColumn(name = "member_id")
public class AdminMember extends Member {

}
