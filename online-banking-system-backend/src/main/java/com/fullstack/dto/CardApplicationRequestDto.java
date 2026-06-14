package com.fullstack.dto;

import com.fullstack.entity.CardApplication;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.math.BigDecimal;

@Getter
@Setter
public class CardApplicationRequestDto {

    // legacy / primary
    private String cardType;
    private BigDecimal annualIncome;
    private String employmentStatus;

    private Integer customerId;
    private Integer bankId;

    // criteria fields
    private Integer age;
    private String mobileLinkedWithBank;
    private String hasBankAccount;
    private String accountType;

    private String hasAadhaar;
    private String aadhaarNumber;
    private String hasPan;
    private String panNumber;
    private String hasOtherId;

    private String employmentType;
    private BigDecimal monthlySalary;
    private Integer cibilScore;

    private String hasSalarySlips;
    private String hasBankStatement;
    private String bankStatementPdfName;
    private String bankStatementPdfBase64;

    private String hasItr;

    private String businessRole;
    private BigDecimal annualTurnover;
    private String hasGstCertificate;
    private String hasBusinessRegistration;
    private String hasAddressProof;

    public static CardApplication toCardApplicationEntity(CardApplicationRequestDto requestDto) {
        CardApplication entity = new CardApplication();
        BeanUtils.copyProperties(requestDto, entity, "id", "customerId", "bankId", "customer", "bank", "status", "createdAt");
        return entity;
    }
}

