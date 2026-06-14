package com.fullstack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // legacy / primary
    private String cardType; // DEBIT_CARD / CREDIT_CARD / BUSINESS_CARD
    private BigDecimal annualIncome;
    private String employmentStatus;

    // criteria fields
    private Integer age;
    private String mobileLinkedWithBank; // YES / NO
    private String hasBankAccount; // YES / NO
    private String accountType; // SAVINGS / CURRENT

    private String hasAadhaar; // YES / NO
    private String aadhaarNumber;
    private String hasPan; // YES / NO
    private String panNumber;
    private String hasOtherId; // YES / NO

    private String employmentType; // SALARIED / SELF_EMPLOYED
    private BigDecimal monthlySalary;
    private Integer cibilScore;

    private String hasSalarySlips; // YES / NO
    private String hasBankStatement; // YES / NO
    private String bankStatementPdfName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String bankStatementPdfBase64;

    private String hasItr; // YES / NO

    private String businessRole; // OWNER / DIRECTOR / PARTNER / SELF_EMPLOYED_PRO
    private BigDecimal annualTurnover;
    private String hasGstCertificate; // YES / NO
    private String hasBusinessRegistration; // YES / NO
    private String hasAddressProof; // YES / NO

    private String status; // PENDING / APPROVED / REJECTED
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Bank bank;
}

