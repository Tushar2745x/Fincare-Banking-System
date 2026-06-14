package com.fullstack.service;

import com.fullstack.dao.CardApplicationDao;
import com.fullstack.entity.CardApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardApplicationServiceImpl implements CardApplicationService {

    @Autowired
    private CardApplicationDao cardApplicationDao;

    @Override
    public CardApplication addCardApplication(CardApplication application) {
        return this.cardApplicationDao.save(application);
    }

    @Override
    public CardApplication updateCardApplication(CardApplication application) {
        return this.cardApplicationDao.save(application);
    }

    @Override
    public CardApplication getById(int applicationId) {
        return this.cardApplicationDao.findById(applicationId).orElse(null);
    }

    @Override
    public List<CardApplication> getByCustomer(int customerId) {
        return this.cardApplicationDao.findByCustomer_Id(customerId);
    }

    @Override
    public List<CardApplication> getByBank(int bankId) {
        return this.cardApplicationDao.findByBank_Id(bankId);
    }

    @Override
    public List<CardApplication> getByBankAndStatus(int bankId, String status) {
        return this.cardApplicationDao.findByBank_IdAndStatus(bankId, status);
    }
}

