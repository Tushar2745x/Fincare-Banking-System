package com.fullstack.dto;

import com.fullstack.entity.LoanApplication;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

@Getter
@Setter
public class LoanApplicationRequestDto {

    private String loanType;

    private Double amount;

    private String term;

    private String purpose;

    private String monthlyIncome;

    private String employmentStatus;

    private String interestRate;

    private Double emi;

    private Double totalAmount;

    private Double totalInterest;

    private int customerId;

    private int bankId;

    public static LoanApplication toLoanApplicationEntity(LoanApplicationRequestDto request) {
        LoanApplication loanApplication = new LoanApplication();
        BeanUtils.copyProperties(request, loanApplication, "customerId", "bankId");
        if (request.getAmount() != null) {
            loanApplication.setAmount(java.math.BigDecimal.valueOf(request.getAmount()));
        }
        if (request.getEmi() != null) {
            loanApplication.setEmi(java.math.BigDecimal.valueOf(request.getEmi()));
        }
        if (request.getTotalAmount() != null) {
            loanApplication.setTotalAmount(java.math.BigDecimal.valueOf(request.getTotalAmount()));
        }
        if (request.getTotalInterest() != null) {
            loanApplication.setTotalInterest(java.math.BigDecimal.valueOf(request.getTotalInterest()));
        }
        return loanApplication;
    }
}
