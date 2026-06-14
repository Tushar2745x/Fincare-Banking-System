package com.fullstack.service;

import com.fullstack.entity.IssuedCard;

import java.util.List;

public interface IssuedCardService {

    IssuedCard add(IssuedCard card);

    IssuedCard update(IssuedCard card);

    List<IssuedCard> getByCustomer(int customerId);

    IssuedCard getByApplicationId(int applicationId);
}

