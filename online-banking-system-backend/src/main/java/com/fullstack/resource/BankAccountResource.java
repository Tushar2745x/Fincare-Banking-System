package com.fullstack.resource;

import com.fullstack.dto.AddBankAccountRequestDto;
import com.fullstack.dto.BankAccountResponseDto;
import com.fullstack.dto.BankAccountStatusUpdateRequestDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.entity.Bank;
import com.fullstack.entity.BankAccount;
import com.fullstack.entity.User;
import com.fullstack.service.BankAccountService;
import com.fullstack.service.BankService;
import com.fullstack.service.UserService;
import com.fullstack.utility.Constants.BankAccountStatus;
import com.fullstack.utility.Constants.IsAccountLinked;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Component
@Log4j2
public class BankAccountResource {

	private static final String BAD_REQ_MSG = "bad request, missing data";
	private static final String ACC_GET_SUC_MSG = "Bank Accounts Fetch Successfully!!!";

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private BankService bankService;

	@Autowired
	private UserService userService;

	public ResponseEntity<CommonApiResponse> addBankAccount(AddBankAccountRequestDto request) {

		log.info("Received request for add bank account");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0) {
			response.setResponseMessage("bad request, user id is null");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getBankId() == 0) {
			response.setResponseMessage("bad request, bank id is null");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = AddBankAccountRequestDto.toBankAccountEntity(request);

		User user = this.userService.getUserById(request.getUserId());
		account.setUser(user);

		Bank bank = this.bankService.getBankById(request.getBankId());
		account.setBank(bank);

		account.setStatus(BankAccountStatus.OPEN.value());
		account.setCreationDate(String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
		account.setBalance(BigDecimal.ZERO);

		BankAccount addedBankAccount = this.bankAccountService.addBankAccount(account);

		if (addedBankAccount != null) {

			user.setIsAccountLinked(IsAccountLinked.YES.value());
			this.userService.updateUser(user);

			response.setResponseMessage("Bank Account Created Successfully!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setResponseMessage("Failed to add the bank account");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

	}

	public ResponseEntity<BankAccountResponseDto> fetchAllBankAccounts() {

		log.info("Received request for fetching all the bank accounts");

		BankAccountResponseDto response = new BankAccountResponseDto();

		List<BankAccount> accounts = this.bankAccountService.getAllBankAccouts();

		response.setAccounts(accounts);
		response.setResponseMessage(ACC_GET_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankAccountResponseDto> fetchBankAccountByBank(int bankId) {

		log.info("Received request for fetching all the bank accounts from bank side");

		BankAccountResponseDto response = new BankAccountResponseDto();

		if (bankId == 0) {
			response.setResponseMessage("bad request, bank id is missing");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccount> accounts = this.bankAccountService.getByBank(bankId);

		response.setAccounts(accounts);
		response.setResponseMessage(ACC_GET_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankAccountResponseDto> fetchBankAccountById(int accountId) {

		log.info("Received request for fetching bank by using account Id");

		BankAccountResponseDto response = new BankAccountResponseDto();

		List<BankAccount> accounts = new ArrayList<>();

		if (accountId == 0) {
			response.setResponseMessage("bad request, account id is missing");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = this.bankAccountService.getBankAccountById(accountId);

		if (account == null) {
			response.setAccounts(accounts);
			response.setResponseMessage("Bank account not found with this account id");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		accounts.add(account);

		response.setAccounts(accounts);
		response.setResponseMessage(ACC_GET_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankAccountResponseDto> fetchBankAccountByUserId(int userId) {

		log.info("Received request for fetching bank by using User Id");

		BankAccountResponseDto response = new BankAccountResponseDto();

		List<BankAccount> accounts = new ArrayList<>();

		if (userId == 0) {
			response.setResponseMessage("bad request, user id is missing");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = this.bankAccountService.getBankAccountByUser(userId);

		if (account == null) {
			response.setResponseMessage("No Bank Account found for User");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		accounts.add(account);

		response.setAccounts(accounts);
		response.setResponseMessage(ACC_GET_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankAccountResponseDto> searchBankAccounts(String accountNumber, int bankId) {

		log.info("Received request for searching the Bank account from Bank side");

		BankAccountResponseDto response = new BankAccountResponseDto();

		if (bankId == 0 || accountNumber == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccount> accounts = this.bankAccountService.getByNumberContainingIgnoreCaseAndBank(accountNumber, bankId);

		response.setAccounts(accounts);
		response.setResponseMessage(ACC_GET_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<CommonApiResponse> updateBankAccountStatus(BankAccountStatusUpdateRequestDto request) {

		log.info("Received request for updating the Bank Account");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getAccountId() == 0) {
			response.setResponseMessage("bad request, account id is missing");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}


		BankAccount account = this.bankAccountService.getBankAccountById(request.getAccountId());
		account.setStatus(request.getStatus());

		BankAccount updateBankAccount = this.bankAccountService.updateBankAccount(account);

		if (updateBankAccount != null) {
			response.setResponseMessage("Bank Account " + request.getStatus() + " Successfully!!!");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setResponseMessage("Failed to " + request.getStatus() + " the account");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	public ResponseEntity<BankAccountResponseDto> searchBankAccounts(String accountNumber) {

		log.info("Received request for searching the Bank account from Admin side");

		BankAccountResponseDto response = new BankAccountResponseDto();

		if (accountNumber == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccount> accounts = this.bankAccountService.getByNumberContainingIgnoreCase(accountNumber);

		response.setAccounts(accounts);
		response.setResponseMessage(ACC_GET_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}
}
