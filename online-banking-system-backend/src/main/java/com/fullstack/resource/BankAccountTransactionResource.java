package com.fullstack.resource;

import com.fullstack.dto.BankTransactionRequestDto;
import com.fullstack.dto.BankTransactionResponseDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.entity.Bank;
import com.fullstack.entity.BankAccount;
import com.fullstack.entity.BankAccountTransaction;
import com.fullstack.entity.User;
import com.fullstack.exception.BankAccountTransactionException;
import com.fullstack.service.BankAccountService;
import com.fullstack.service.BankAccountTransactionService;
import com.fullstack.service.BankService;
import com.fullstack.service.UserService;
import com.fullstack.utility.BankStatementDownloader;
import com.fullstack.utility.Constants.BankAccountStatus;
import com.fullstack.utility.Constants.TransactionNarration;
import com.fullstack.utility.Constants.TransactionType;
import com.fullstack.utility.Constants.UserStatus;
import com.fullstack.utility.DateTimeUtils;
import com.fullstack.utility.TransactionIdGenerator;
import com.lowagie.text.DocumentException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Component
@Log4j2
public class BankAccountTransactionResource {

	private static final String BAD_REQ_MSG = "bad request, missing data !!!!";
	private static final String INV_REQ_MSG = "bad request, invalid or missing data !!!";
	private static final String DEP_FAIL_MSG = "Failed to deposit amount, please select valid amount !!!";
	private static final String TXN_NF_MSG = "No transaction found !!!";
	private static final String BANK_NF_MSG = "bank not found !!!";
	private static final String TXN_SUC_MSG = "Bank Transactions fetched successfully !!!";

	@Autowired
	private UserService userService;

	@Autowired
	private BankAccountTransactionService bankAccountTransactionService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private BankService bankService;

	@Transactional(rollbackOn = BankAccountTransactionException.class)
	public ResponseEntity<CommonApiResponse> depositAmountTxn(BankTransactionRequestDto request) throws Exception {

		log.info("Received request for deposit amount in customer account");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getAmount() == null || request.getSourceBankAccountId() == 0) {
			response.setResponseMessage(INV_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getAmount().compareTo(BigDecimal.ZERO) < 0) {
			response.setResponseMessage(DEP_FAIL_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = this.bankAccountService.findByAccountId(request.getSourceBankAccountId());

		if (account == null) {
			response.setResponseMessage("Bank Account found, enter correct account details!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (!account.getStatus().equals(BankAccountStatus.OPEN.value())) {
			response.setResponseMessage("Bank Account is Locked, Can't Deposit amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = account.getBank();

		account.setBalance(account.getBalance().add(request.getAmount()));
		BankAccount updateAccount = this.bankAccountService.updateBankAccount(account);

		if (updateAccount == null) {
			response.setResponseMessage("Failed to deposit the amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		User user = account.getUser();

		if (!user.getStatus().equals(UserStatus.ACTIVE.value())) {
			response.setResponseMessage("User is not Active, Can't Deposit amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccountTransaction transaction = new BankAccountTransaction();
		transaction.setType(TransactionType.DEPOSIT.value());
		transaction.setBank(bank);
		transaction.setBankAccount(account);
		transaction.setAmount(request.getAmount());
		transaction.setNarration(TransactionNarration.BANK_DEPOSIT.value());
		transaction.setTransactionId(TransactionIdGenerator.generate());
		transaction.setTransactionTime(
				String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
		transaction.setUser(user);

		BankAccountTransaction addedTxn = this.bankAccountTransactionService.addBankTransaction(transaction);

		if (addedTxn == null) {
			throw new BankAccountTransactionException("Failed to deposit amount in customer account");
		} else {
			response.setResponseMessage("Amount Deposited successfully!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@Transactional(rollbackOn = BankAccountTransactionException.class)
	public ResponseEntity<CommonApiResponse> withdrawAmountTxn(BankTransactionRequestDto request) {

		log.info("Received request for withdraw amount from customer account");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getAmount() == null || request.getSourceBankAccountId() == 0) {
			response.setResponseMessage(INV_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getAmount().compareTo(BigDecimal.ZERO) < 0) {
			response.setResponseMessage(DEP_FAIL_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = this.bankAccountService.findByAccountId(request.getSourceBankAccountId());

		if (account == null) {
			response.setResponseMessage("Bank Account found, enter correct account details!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (!account.getStatus().equals(BankAccountStatus.OPEN.value())) {
			response.setResponseMessage("Bank Account is Locked, Can't Withdraw amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (account.getBalance().compareTo(request.getAmount()) < 0) {
			response.setResponseMessage("Failed to withdraw amount, insufficient balance in customer account");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = account.getBank();

		account.setBalance(account.getBalance().subtract(request.getAmount()));
		BankAccount updateAccount = this.bankAccountService.updateBankAccount(account);

		if (updateAccount == null) {
			response.setResponseMessage("Failed to withdraw the amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		User user = account.getUser();

		if (!user.getStatus().equals(UserStatus.ACTIVE.value())) {
			response.setResponseMessage("User is not Active, Can't Withdraw amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccountTransaction transaction = new BankAccountTransaction();
		transaction.setType(TransactionType.WITHDRAW.value());
		transaction.setBank(bank);
		transaction.setBankAccount(account);
		transaction.setAmount(request.getAmount());
		transaction.setNarration(TransactionNarration.BANK_WITHDRAW.value());
		transaction.setTransactionId(TransactionIdGenerator.generate());
		transaction.setTransactionTime(
				String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
		transaction.setUser(user);

		BankAccountTransaction addedTxn = this.bankAccountTransactionService.addBankTransaction(transaction);

		if (addedTxn == null) {
			throw new BankAccountTransactionException("Failed to withdraw amount from customer account");
		} else {
			response.setResponseMessage("Amount Withdraw successful!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@Transactional(rollbackOn = BankAccountTransactionException.class)
	public ResponseEntity<CommonApiResponse> accountTransfer(BankTransactionRequestDto request) {

		log.info("Received request for customer account transfer");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0 || request.getBankId() == 0 || request.getAmount() == null
				|| request.getToBankAccount() == null || request.getToBankIfsc() == null) {
			response.setResponseMessage(INV_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getAmount().compareTo(BigDecimal.ZERO) < 0) {
			response.setResponseMessage(DEP_FAIL_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(request.getUserId());

		if (user == null) {
			response.setResponseMessage("Sender User not found in Db");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount senderAccount = this.bankAccountService.findByUserAndStatus(user.getId(),
				BankAccountStatus.OPEN.value());

		if (senderAccount == null) {
			response.setResponseMessage("No Linked Bank Account found, contact Bank Administrator");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (!senderAccount.getStatus().equals(BankAccountStatus.OPEN.value())) {
			response.setResponseMessage("Bank Account is Locked, Can't Transfer the Amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (senderAccount.getBalance().compareTo(request.getAmount()) < 0) {
			response.setResponseMessage("Insufficient Fund, Failed to transfer the amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount recipientAccount = this.bankAccountService.findByNumberAndIfscCodeAndStatus(
				request.getToBankAccount(), request.getToBankIfsc(), BankAccountStatus.OPEN.value());

		if (recipientAccount == null) {
			response.setResponseMessage("Recipient account not found, please enter the correct details and try again");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		senderAccount.setBalance(senderAccount.getBalance().subtract(request.getAmount()));
		BankAccount updateSenderAccount = this.bankAccountService.updateBankAccount(senderAccount);

		if (updateSenderAccount == null) {
			response.setResponseMessage("Failed to transfer the amount");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		recipientAccount.setBalance(recipientAccount.getBalance().add(request.getAmount()));
		BankAccount updateRecipientAccount = this.bankAccountService.updateBankAccount(recipientAccount);

		if (updateRecipientAccount == null) {
			response.setResponseMessage("Failed to transfer the amount");
			response.setSuccess(true);

			throw new BankAccountTransactionException("Failed to transfer the amount");
		}

		BankAccountTransaction transaction = new BankAccountTransaction();
		transaction.setType(TransactionType.ACCOUNT_TRANSFER.value());
		transaction.setBank(senderAccount.getBank());
		transaction.setBankAccount(senderAccount);
		transaction.setDestinationBankAccount(recipientAccount);
		transaction.setAmount(request.getAmount());
		transaction.setNarration(request.getAccountTransferPurpose());
		transaction.setTransactionId(TransactionIdGenerator.generate());
		transaction.setTransactionTime(
				String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
		transaction.setUser(user);

		BankAccountTransaction addedTxn = this.bankAccountTransactionService.addBankTransaction(transaction);

		if (addedTxn == null) {
			throw new BankAccountTransactionException("Failed to transfer the amount");
		} else {
			response.setResponseMessage("Amount Transfer succesful!!!");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	public ResponseEntity<BankTransactionResponseDto> bankTransactionHistory(int userId) {

		log.info("Received request for fetching the bank transaction history");

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		if (userId == 0) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(userId);

		if (user == null) {
			response.setResponseMessage("user not found");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService.getTransactionsByUserId(user.getId());

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage("Bank Transaction history fetched successfully");
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankTransactionResponseDto> allBankCustomerTransactions() {

		log.info("Received request for fetching all bank customer transaction");

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService.getAllTransactions();

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage(TXN_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankTransactionResponseDto> getBankCustomerTransaction(int bankId, String accountNo) {

		log.info("Received request for fetching bank customer transaction by account no: {}", accountNo);

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		if (bankId == 0 || accountNo == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = this.bankService.getBankById(bankId);

		if (bank == null) {
			response.setResponseMessage(BANK_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccount> accounts = this.bankAccountService.getByNumberContainingIgnoreCaseAndBank(accountNo, bankId);

		if (CollectionUtils.isEmpty(accounts)) {
			response.setResponseMessage("bank account found");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = accounts.get(0);

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService.getTransactionsByUserId(account.getUser().getId());

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage(TXN_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankTransactionResponseDto> getBankCustomerTransactionByTimeRange(int bankId,
	                                                                                        String accountNo, String startTime, String endTime) {

		log.info("Received request for fetching bank customer transaction by account and time range");

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		if (bankId == 0 || accountNo == null) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = this.bankService.getBankById(bankId);

		if (bank == null) {
			response.setResponseMessage(BANK_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccount> accounts = this.bankAccountService.getByNumberContainingIgnoreCaseAndBank(accountNo, bankId);

		if (CollectionUtils.isEmpty(accounts)) {
			response.setResponseMessage("bank account found");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = accounts.get(0);

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService
				.getAllTransactionsByTransactionTimeAndBankAccoountId(startTime, endTime, account.getId());

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage(TXN_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankTransactionResponseDto> getBankAllCustomerTransactionByTimeRange(int bankId,
	                                                                                           String startTime, String endTime) {

		log.info("Received request for fetching bank customer transaction by account no.");

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		if (bankId == 0) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = this.bankService.getBankById(bankId);

		if (bank == null) {
			response.setResponseMessage(BANK_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService
				.getAllTransactionsByTransactionTimeAndBankId(startTime, endTime, bankId);

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage(TXN_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankTransactionResponseDto> getBankAllCustomerTransaction(int bankId) {

		log.info("Received request for fetching bank all customer transactions ");

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		if (bankId == 0) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		Bank bank = this.bankService.getBankById(bankId);

		if (bank == null) {
			response.setResponseMessage(BANK_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService.findByBankOrderByIdDesc(bankId);

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage(TXN_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<BankTransactionResponseDto> bankTransactionHistoryByTimeRange(int userId, String startTime,
	                                                                                    String endTime) {

		log.info("Received request for fetching bank all customer transactions");

		BankTransactionResponseDto response = new BankTransactionResponseDto();

		if (userId == 0) {
			response.setResponseMessage(BAD_REQ_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(userId);

		if (user == null) {
			response.setResponseMessage("user not found");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		BankAccount account = this.bankAccountService.findByUserAndStatus(user.getId(), BankAccountStatus.OPEN.value());

		if (account == null) {
			response.setResponseMessage("account not linked with user account");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService
				.getByUserAndTransactionTimeBetweenOrderByIdDesc(userId, startTime, endTime);

		if (bankAccountTransactions.isEmpty()) {
			response.setResponseMessage(TXN_NF_MSG);
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		response.setBankTransactions(bankAccountTransactions);
		response.setResponseMessage(TXN_SUC_MSG);
		response.setSuccess(true);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public void downloadBankStatement(int accountId, String startTime, String endTime, HttpServletResponse response)
			throws DocumentException, IOException {

		if (accountId == 0 || startTime == null || endTime == null) {
			return;
		}

		List<BankAccountTransaction> bankAccountTransactions = this.bankAccountTransactionService
				.getAllTransactionsByTransactionTimeAndBankAccoountId(startTime, endTime, accountId);

		if (CollectionUtils.isEmpty(bankAccountTransactions)) {
			return;
		}

		response.setContentType("application/pdf");
		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=" + bankAccountTransactions.get(0).getBankAccount().getNumber()
				+ "_Statement.pdf";
		response.setHeader(headerKey, headerValue);

		BankStatementDownloader exporter = new BankStatementDownloader(bankAccountTransactions,
				DateTimeUtils.getProperDateTimeFormatFromEpochTime(startTime),
				DateTimeUtils.getProperDateTimeFormatFromEpochTime(endTime));
		exporter.export(response);

	}

}
