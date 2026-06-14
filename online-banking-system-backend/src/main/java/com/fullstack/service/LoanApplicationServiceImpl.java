package com.fullstack.service;

import com.fullstack.dao.LoanApplicationDao;
import com.fullstack.entity.LoanApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanApplicationServiceImpl implements LoanApplicationService {

    @Autowired
    private LoanApplicationDao loanApplicationDao;

    @Override
    public LoanApplication addLoanApplication(LoanApplication loanApplication) {
        return this.loanApplicationDao.save(loanApplication);
    }

    @Override
    public LoanApplication updateLoanApplication(LoanApplication loanApplication) {
        return this.loanApplicationDao.save(loanApplication);
    }

    @Override
    public LoanApplication getLoanApplicationById(int applicationId) {
        return this.loanApplicationDao.findById(applicationId).orElse(null);
    }

    @Override
    public List<LoanApplication> getAllLoanApplications() {
        return this.loanApplicationDao.findAll();
    }

    @Override
    public List<LoanApplication> getByCustomer(int customerId) {
        return this.loanApplicationDao.findByCustomer_Id(customerId);
    }

    @Override
    public List<LoanApplication> getByBank(int bankId) {
        return this.loanApplicationDao.findByBank_Id(bankId);
    }

    @Override
    public List<LoanApplication> getByBankAndStatus(int bankId, String status) {
        return this.loanApplicationDao.findByBank_IdAndStatus(bankId, status);
    }

    @Override
    public List<LoanApplication> getByStatus(String status) {
        return this.loanApplicationDao.findByStatus(status);
    }
}
