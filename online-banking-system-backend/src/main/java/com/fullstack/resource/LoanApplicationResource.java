package com.fullstack.resource;

import com.fullstack.dto.CommonApiResponse;
import com.fullstack.dto.LoanApplicationRequestDto;
import com.fullstack.dto.LoanApplicationResponseDto;
import com.fullstack.entity.Bank;
import com.fullstack.entity.BankAccount;
import com.fullstack.entity.BankAccountTransaction;
import com.fullstack.entity.LoanApplication;
import com.fullstack.entity.User;
import com.fullstack.service.BankAccountService;
import com.fullstack.service.BankAccountTransactionService;
import com.fullstack.service.BankService;
import com.fullstack.service.LoanApplicationService;
import com.fullstack.service.UserService;
import com.fullstack.utility.Constants.TransactionNarration;
import com.fullstack.utility.Constants.TransactionType;
import com.fullstack.utility.TransactionIdGenerator;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
@Log4j2
public class LoanApplicationResource {

    private static final String BAD_REQ_MSG = "bad request, missing data";
    private static final String APPLICATION_SUCCESS = "Loan application created successfully";
    private static final String APPLICATION_FETCH_SUCCESS = "Loan application fetched successfully";

    @Autowired
    private LoanApplicationService loanApplicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private BankService bankService;

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private BankAccountTransactionService bankAccountTransactionService;

    public ResponseEntity<CommonApiResponse> addLoanApplication(LoanApplicationRequestDto request) {
        log.info("Received request for loan application");

        CommonApiResponse response = new CommonApiResponse();

        if (request == null || request.getCustomerId() == 0 || request.getLoanType() == null || request.getLoanType().isEmpty() || request.getAmount() == null || request.getAmount() <= 0 || request.getTerm() == null || request.getTerm().isEmpty()) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        User customer = this.userService.getUserById(request.getCustomerId());
        if (customer == null) {
            response.setResponseMessage("Customer not found");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        LoanApplication loanApplication = LoanApplicationRequestDto.toLoanApplicationEntity(request);
        loanApplication.setCustomer(customer);

        if (request.getBankId() != 0) {
            Bank bank = this.bankService.getBankById(request.getBankId());
            loanApplication.setBank(bank);
        } else if (customer.getBank() != null) {
            loanApplication.setBank(customer.getBank());
        }

        int termInMonths = 0;
        try {
            if (request.getLoanType().equals("GOLD_LOAN")) {
                termInMonths = (int) (Double.parseDouble(request.getTerm()) * 12);
            } else {
                termInMonths = Integer.parseInt(request.getTerm()) * 12;
            }
        } catch (NumberFormatException ignored) {
        }
        loanApplication.setTermInMonths(termInMonths);
        loanApplication.setStatus("PENDING");
        loanApplication.setCreatedAt(String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));

        LoanApplication saved = this.loanApplicationService.addLoanApplication(loanApplication);

        if (saved != null) {
            response.setResponseMessage(APPLICATION_SUCCESS);
            response.setSuccess(true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        response.setResponseMessage("Failed to submit loan application");
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<LoanApplicationResponseDto> fetchAllLoanApplications() {
        log.info("Received request for fetching all loan applications");

        LoanApplicationResponseDto response = new LoanApplicationResponseDto();
        response.setApplications(this.loanApplicationService.getAllLoanApplications());
        response.setResponseMessage(APPLICATION_FETCH_SUCCESS);
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<LoanApplicationResponseDto> fetchLoanApplicationsByCustomer(int customerId) {
        log.info("Received request for fetching loan applications by customer");

        LoanApplicationResponseDto response = new LoanApplicationResponseDto();

        if (customerId == 0) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        response.setApplications(this.loanApplicationService.getByCustomer(customerId));
        response.setResponseMessage(APPLICATION_FETCH_SUCCESS);
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<LoanApplicationResponseDto> fetchLoanApplicationsByBank(int bankId, String status) {
        log.info("Received request for fetching loan applications by bank");

        LoanApplicationResponseDto response = new LoanApplicationResponseDto();

        if (bankId == 0) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (status == null || status.isEmpty()) {
            response.setApplications(this.loanApplicationService.getByBank(bankId));
        } else {
            response.setApplications(this.loanApplicationService.getByBankAndStatus(bankId, status));
        }

        response.setResponseMessage(APPLICATION_FETCH_SUCCESS);
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<LoanApplicationResponseDto> fetchLoanApplicationById(int applicationId) {
        log.info("Received request for fetching loan application by id");

        LoanApplicationResponseDto response = new LoanApplicationResponseDto();

        if (applicationId == 0) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        LoanApplication application = this.loanApplicationService.getLoanApplicationById(applicationId);
        response.setApplications(application != null ? java.util.List.of(application) : java.util.List.of());
        response.setResponseMessage(APPLICATION_FETCH_SUCCESS);
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<CommonApiResponse> updateLoanStatus(int applicationId, String status) {
        log.info("Received request for updating loan application status");

        CommonApiResponse response = new CommonApiResponse();

        if (applicationId == 0 || status == null || status.isEmpty()) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        LoanApplication application = this.loanApplicationService.getLoanApplicationById(applicationId);
        if (application == null) {
            response.setResponseMessage("Loan application not found");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        String previousStatus = application.getStatus() != null
                ? application.getStatus().trim().toUpperCase()
                : "";
        String normalizedStatus = status.trim().toUpperCase();

        if ("APPROVED".equals(normalizedStatus) && !"APPROVED".equals(previousStatus)) {
            BankAccount bankAccount = this.bankAccountService.findByUserAndStatus(
                    application.getCustomer().getId(), "Open");
            if (bankAccount == null) {
                bankAccount = this.bankAccountService.getBankAccountByUser(application.getCustomer().getId());
            }
            if (bankAccount == null) {
                response.setResponseMessage("Cannot approve loan because customer bank account was not found.");
                response.setSuccess(false);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            BigDecimal loanAmount = application.getAmount();
            BigDecimal currentBalance = bankAccount.getBalance() != null
                    ? bankAccount.getBalance()
                    : BigDecimal.ZERO;
            bankAccount.setBalance(currentBalance.add(loanAmount));
            BankAccount updatedAccount = this.bankAccountService.updateBankAccount(bankAccount);

            if (updatedAccount == null) {
                response.setResponseMessage("Failed to credit loan amount to customer account.");
                response.setSuccess(false);
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            Bank bank = bankAccount.getBank() != null
                    ? bankAccount.getBank()
                    : application.getBank();
            User customer = application.getCustomer();
            String loanTypeLabel = application.getLoanType() != null
                    ? application.getLoanType().replace("_", " ")
                    : "Loan";

            BankAccountTransaction transaction = new BankAccountTransaction();
            transaction.setType(TransactionType.LOAN_DISBURSEMENT.value());
            transaction.setBank(bank);
            transaction.setBankAccount(updatedAccount);
            transaction.setAmount(loanAmount);
            transaction.setNarration(
                    TransactionNarration.LOAN_DISBURSEMENT.value()
                            + " - "
                            + loanTypeLabel
                            + " (Ref: LA-"
                            + applicationId
                            + ")");
            transaction.setTransactionId(TransactionIdGenerator.generate());
            transaction.setTransactionTime(
                    String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
            transaction.setUser(customer);

            BankAccountTransaction savedTxn = this.bankAccountTransactionService.addBankTransaction(transaction);
            if (savedTxn == null) {
                response.setResponseMessage("Failed to record loan disbursement transaction.");
                response.setSuccess(false);
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        application.setStatus(normalizedStatus);
        this.loanApplicationService.updateLoanApplication(application);

        response.setResponseMessage("Loan application status updated successfully");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
