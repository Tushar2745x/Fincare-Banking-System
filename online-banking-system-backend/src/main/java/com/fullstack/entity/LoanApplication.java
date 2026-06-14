package com.fullstack.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String loanType;

    private BigDecimal amount;

    private String term;

    private Integer termInMonths;

    private String purpose;

    private String employmentStatus;

    private String interestRate;

    private BigDecimal emi;

    private BigDecimal totalAmount;

    private BigDecimal totalInterest;

    private String status;

    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Bank bank;
}
