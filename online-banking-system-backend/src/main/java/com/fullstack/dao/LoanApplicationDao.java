package com.fullstack.dao;

import com.fullstack.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanApplicationDao extends JpaRepository<LoanApplication, Integer> {

    List<LoanApplication> findByCustomer_Id(int customerId);

    List<LoanApplication> findByStatus(String status);

    List<LoanApplication> findByBank_Id(int bankId);

    List<LoanApplication> findByBank_IdAndStatus(int bankId, String status);
}
