package com.fullstack.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String number;

	private String ifscCode;

	private String type; // saving or current

	private BigDecimal balance;

	private String creationDate;

	private String status; // open, in-operative, deleted

	// Many-to-One mapping with Bank
	@ManyToOne
	@JoinColumn(name = "bank_id")
	private Bank bank;

	// One-to-One mapping with User
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user; // 1 user can 1 bank account
}
