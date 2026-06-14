package com.fullstack.service;

import com.fullstack.dao.BankDao;
import com.fullstack.entity.Bank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankServiceImpl implements BankService {

	@Autowired
	private BankDao bankDao;

	@Override
	public Bank getBankById(int bankId) {
		return this.bankDao.findById(bankId).orElse(null);
	}

	@Override
	public Bank addBank(Bank bank) {
		return this.bankDao.save(bank);
	}

	@Override
	public Bank updateBank(Bank bank) {
		return this.bankDao.save(bank);
	}

	@Override
	public List<Bank> getAllBank() {
		return this.bankDao.findAll();
	}

}
