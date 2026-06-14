package com.fullstack.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fullstack.entity.Bank;

@Repository
public interface BankDao extends JpaRepository<Bank, Integer> {
	
}
