package com.fullstack.service;

import com.fullstack.dao.IssuedCardDao;
import com.fullstack.entity.IssuedCard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssuedCardServiceImpl implements IssuedCardService {

    @Autowired
    private IssuedCardDao issuedCardDao;

    @Override
    public IssuedCard add(IssuedCard card) {
        return this.issuedCardDao.save(card);
    }

    @Override
    public IssuedCard update(IssuedCard card) {
        return this.issuedCardDao.save(card);
    }

    @Override
    public List<IssuedCard> getByCustomer(int customerId) {
        return this.issuedCardDao.findByCustomer_Id(customerId);
    }

    @Override
    public IssuedCard getByApplicationId(int applicationId) {
        return this.issuedCardDao.findByCardApplication_Id(applicationId).orElse(null);
    }
}

