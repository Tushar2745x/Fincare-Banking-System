package com.fullstack.dao;

import com.fullstack.entity.IssuedCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssuedCardDao extends JpaRepository<IssuedCard, Integer> {

    List<IssuedCard> findByCustomer_Id(int customerId);

    Optional<IssuedCard> findByCardApplication_Id(int applicationId);
}

