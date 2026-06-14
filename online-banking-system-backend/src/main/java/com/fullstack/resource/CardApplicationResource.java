package com.fullstack.resource;

import com.fullstack.dto.CardApplicationRequestDto;
import com.fullstack.dto.CardApplicationResponseDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.entity.Bank;
import com.fullstack.entity.CardApplication;
import com.fullstack.entity.IssuedCard;
import com.fullstack.entity.User;
import com.fullstack.service.BankService;
import com.fullstack.service.CardApplicationService;
import com.fullstack.service.IssuedCardService;
import com.fullstack.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.ThreadLocalRandom;
import java.util.List;

@Component
@Log4j2
public class CardApplicationResource {

    private static final String BAD_REQ_MSG = "bad request, missing data";

    @Autowired
    private CardApplicationService cardApplicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private BankService bankService;

    @Autowired
    private IssuedCardService issuedCardService;

    public ResponseEntity<CommonApiResponse> apply(CardApplicationRequestDto request) {
        log.info("Received request for card application");

        CommonApiResponse response = new CommonApiResponse();

        if (request == null || request.getCustomerId() == null || request.getCustomerId() == 0 || request.getCardType() == null || request.getCardType().isEmpty()) {
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

        CardApplication application = CardApplicationRequestDto.toCardApplicationEntity(request);
        application.setCustomer(customer);

        if (request.getBankId() != null && request.getBankId() != 0) {
            Bank bank = this.bankService.getBankById(request.getBankId());
            application.setBank(bank);
        } else if (customer.getBank() != null) {
            application.setBank(customer.getBank());
        }

        application.setStatus("PENDING");
        application.setCreatedAt(String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));

        CardApplication saved = this.cardApplicationService.addCardApplication(application);
        if (saved != null) {
            response.setResponseMessage("Card application submitted successfully");
            response.setSuccess(true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        response.setResponseMessage("Failed to submit card application");
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<CardApplicationResponseDto> fetchByCustomer(int customerId) {
        CardApplicationResponseDto response = new CardApplicationResponseDto();
        if (customerId == 0) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            response.setApplications(List.of());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        response.setApplications(this.cardApplicationService.getByCustomer(customerId));
        response.setResponseMessage("Card applications fetched successfully");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<CardApplicationResponseDto> fetchByBank(int bankId, String status) {
        CardApplicationResponseDto response = new CardApplicationResponseDto();
        if (bankId == 0) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            response.setApplications(List.of());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (status == null || status.isEmpty()) {
            response.setApplications(this.cardApplicationService.getByBank(bankId));
        } else {
            response.setApplications(this.cardApplicationService.getByBankAndStatus(bankId, status.trim().toUpperCase()));
        }

        response.setResponseMessage("Card applications fetched successfully");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<CommonApiResponse> updateStatus(int applicationId, String status) {
        log.info("Received request for updating card application status");

        CommonApiResponse response = new CommonApiResponse();

        if (applicationId == 0 || status == null || status.isEmpty()) {
            response.setResponseMessage(BAD_REQ_MSG);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        CardApplication application = this.cardApplicationService.getById(applicationId);
        if (application == null) {
            response.setResponseMessage("Card application not found");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        String normalizedStatus = status.trim().toUpperCase();
        if (!"APPROVED".equals(normalizedStatus) && !"REJECTED".equals(normalizedStatus) && !"PENDING".equals(normalizedStatus)) {
            response.setResponseMessage("Invalid status");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        application.setStatus(normalizedStatus);
        this.cardApplicationService.updateCardApplication(application);

        if ("APPROVED".equals(normalizedStatus)) {
            // Create issued card if not already created for this application
            IssuedCard existing = this.issuedCardService.getByApplicationId(applicationId);
            if (existing == null) {
                IssuedCard issuedCard = new IssuedCard();
                issuedCard.setCardType(application.getCardType());
                issuedCard.setCustomer(application.getCustomer());
                issuedCard.setBank(application.getBank());
                issuedCard.setCardApplication(application);
                issuedCard.setStatus("ACTIVE");

                issuedCard.setCardNumber(generateCardNumber());
                issuedCard.setCvv(generateCvv());
                String[] expiry = generateExpiry();
                issuedCard.setExpiryMonth(expiry[0]);
                issuedCard.setExpiryYear(expiry[1]);
                issuedCard.setCreatedAt(String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));

                this.issuedCardService.add(issuedCard);
            }
        }

        response.setResponseMessage("Card application status updated successfully");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private String[] generateExpiry() {
        // 5 years validity
        LocalDateTime now = LocalDateTime.now();
        int month = now.getMonthValue();
        int year = now.getYear() + 5;
        return new String[]{String.format("%02d", month), String.valueOf(year)};
    }

    private String generateCardNumber() {
        // Simple 16-digit number (not real payment network). Format: 16 digits.
        long first = ThreadLocalRandom.current().nextLong(4000_0000_0000_0000L, 4999_9999_9999_9999L);
        return String.valueOf(first);
    }

    private String generateCvv() {
        int value = ThreadLocalRandom.current().nextInt(100, 1000);
        return String.valueOf(value);
    }
}

