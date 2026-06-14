package com.fullstack.dao;

import com.fullstack.entity.CardApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardApplicationDao extends JpaRepository<CardApplication, Integer> {

    List<CardApplication> findByCustomer_Id(int customerId);

    List<CardApplication> findByBank_Id(int bankId);

    List<CardApplication> findByBank_IdAndStatus(int bankId, String status);
}

