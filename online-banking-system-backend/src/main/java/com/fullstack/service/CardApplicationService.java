package com.fullstack.service;

import com.fullstack.entity.CardApplication;

import java.util.List;

public interface CardApplicationService {

    CardApplication addCardApplication(CardApplication application);

    CardApplication updateCardApplication(CardApplication application);

    CardApplication getById(int applicationId);

    List<CardApplication> getByCustomer(int customerId);

    List<CardApplication> getByBank(int bankId);

    List<CardApplication> getByBankAndStatus(int bankId, String status);
}

