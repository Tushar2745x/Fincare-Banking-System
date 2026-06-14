package com.fullstack.service;

import java.util.List;

import com.fullstack.entity.Bank;

public interface BankService {
	
	Bank getBankById(int bankId);
	Bank addBank(Bank bank);
	Bank updateBank(Bank bank);
	List<Bank> getAllBank();

}
