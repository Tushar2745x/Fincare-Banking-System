package com.fullstack.service;

import com.fullstack.entity.LoanApplication;

import java.util.List;

public interface LoanApplicationService {

    LoanApplication addLoanApplication(LoanApplication loanApplication);

    LoanApplication updateLoanApplication(LoanApplication loanApplication);

    LoanApplication getLoanApplicationById(int applicationId);

    List<LoanApplication> getAllLoanApplications();

    List<LoanApplication> getByCustomer(int customerId);

    List<LoanApplication> getByBank(int bankId);

    List<LoanApplication> getByBankAndStatus(int bankId, String status);

    List<LoanApplication> getByStatus(String status);
}
