package com.fullstack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USER_DETAILS")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String name;

	private String email;

	@JsonIgnore
	private String password;

	private String roles;

	private String gender;

	private String contact;

	private String street;

	private String city;

	private String pincode;

	@Column(name = "aadhaar_card", length = 12)
	private String aadhaarCard;

	@ManyToOne
	@JoinColumn(name = "bank_id")
	private Bank bank;

	private String isAccountLinked; // Yes, No

	private String status; // active, deactivated
}
