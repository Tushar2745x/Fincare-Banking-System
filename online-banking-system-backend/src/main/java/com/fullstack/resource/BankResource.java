package com.fullstack.resource;

import com.fullstack.dto.BankDetailsResponseDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.dto.RegisterBankRequestDto;
import com.fullstack.entity.Bank;
import com.fullstack.entity.User;
import com.fullstack.service.BankService;
import com.fullstack.service.UserService;
import com.fullstack.utility.Constants.UserRole;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Log4j2
public class BankResource {

	@Autowired
	private BankService bankService;

	@Autowired
	private UserService userService;

	@Transactional
	public ResponseEntity<CommonApiResponse> registerBank(RegisterBankRequestDto request) {

		log.info("Received request for register bank");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("bad request, missing data");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0) {
			response.setResponseMessage("bad request, Bank user not selected");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User bankUser = this.userService.getUserById(request.getUserId());

		if (bankUser == null || !bankUser.getRoles().equals(UserRole.ROLE_BANK.value())) {
			response.setResponseMessage("bad request, selected bank is not Bank user");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = RegisterBankRequestDto.toBankEntity(request);

		Bank registeredBank = this.bankService.addBank(bank);

		if (registeredBank == null) {
			response.setResponseMessage("failed to register the bank!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		bankUser.setBank(registeredBank);

		User updatedUser = this.userService.updateUser(bankUser);

		if (updatedUser == null) {
			throw new NullPointerException("User is null");
		}

		response.setResponseMessage("Bank Registered Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<BankDetailsResponseDto> fetchAllBanks() {

		log.info("Received request for fetching all the banks");

		BankDetailsResponseDto response = new BankDetailsResponseDto();

		List<Bank> banks = this.bankService.getAllBank();

		response.setBanks(banks);
		response.setResponseMessage("Banks Fetch successful!!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankDetailsResponseDto> fetchBankById(int bankId) {

		log.info("Received request for fetching bank by Id");

		BankDetailsResponseDto response = new BankDetailsResponseDto();

		if (bankId == 0) {
			response.setResponseMessage("bad request, bank id is missing");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		List<Bank> banks = new ArrayList<>();

		Bank bank = this.bankService.getBankById(bankId);

		if (bank == null) {
			response.setResponseMessage("bank not found in db");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		banks.add(bank);

		response.setBanks(banks);
		response.setResponseMessage("Banks Fetch successful !!!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankDetailsResponseDto> fetchBankByUserId(int userId) {

		log.info("Received request for fetching bank by user Id");

		BankDetailsResponseDto response = new BankDetailsResponseDto();

		if (userId == 0) {
			response.setResponseMessage("bad request, user id is missing");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		List<Bank> banks = new ArrayList<>();

		User user = this.userService.getUserById(userId);

		if (user == null || !user.getRoles().equals(UserRole.ROLE_BANK.value())) {
			response.setResponseMessage("bad request, user null or not bank user!!!");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = this.bankService.getBankById(user.getBank().getId());

		if (bank == null) {
			response.setResponseMessage("bank not found in db");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		banks.add(bank);

		response.setBanks(banks);
		response.setResponseMessage("Banks Fetch successful!!");
		response.setSuccess(true);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

}
