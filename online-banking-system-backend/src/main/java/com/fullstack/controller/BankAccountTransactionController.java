package com.fullstack.controller;

import com.fullstack.dto.BankTransactionRequestDto;
import com.fullstack.dto.BankTransactionResponseDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.resource.BankAccountTransactionResource;
import com.lowagie.text.DocumentException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


import java.io.IOException;

@RestController
@RequestMapping("api/bank/transaction")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Bank Transaction", description = "APIS Of Bank Account Transaction Controller")
public class BankAccountTransactionController {

	@Autowired
	private BankAccountTransactionResource bankAccountTransactionResource;

	@PostMapping("deposit")
    @Operation(
            summary = "Deposit money into bank account",
            description = "Deposits the specified amount into the given bank account"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Amount deposited successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid deposit request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> bankDepositTransaction(@RequestBody BankTransactionRequestDto request)
			throws Exception {
		return this.bankAccountTransactionResource.depositAmountTxn(request);
	}

	@PostMapping("withdraw")
    @Operation(
            summary = "Withdraw money from bank account",
            description = "Withdraws the specified amount from the given bank account"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Amount withdrawn successfully"),
            @ApiResponse(responseCode = "400", description = "Insufficient balance or invalid request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> bankWithdrawTransaction(@RequestBody BankTransactionRequestDto request)
			throws Exception {
		return this.bankAccountTransactionResource.withdrawAmountTxn(request);
	}

	@PostMapping("account/transfer")
    @Operation(
            summary = "Transfer money between bank accounts",
            description = "Transfers amount from one bank account to another"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Amount transferred successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid transfer request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> accountTransferTransaction(@RequestBody BankTransactionRequestDto request)
			throws Exception {
		return this.bankAccountTransactionResource.accountTransfer(request);
	}

	@GetMapping("history")
    @Operation(
            summary = "Fetch customer transaction history",
            description = "Fetches all transactions of a customer using user ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transaction history fetched successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getUserBankTransactionHistory(
			@RequestParam("userId") int userId) {
		return this.bankAccountTransactionResource.bankTransactionHistory(userId);
	}

	@GetMapping("all")
    @Operation(
            summary = "Fetch all bank customer transactions",
            description = "Fetches transaction history of all customers in the bank"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transactions fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getAllBankCustomerTransactions() {
		return this.bankAccountTransactionResource.allBankCustomerTransactions();
	}

	@GetMapping("customer/fetch")
    @Operation(
            summary = "Fetch customer transactions by bank and account number",
            description = "Fetches transaction history using bank ID and account number"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transactions fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getBankCustomerTransaction(@RequestParam("bankId") int bankId,
	                                                                             @RequestParam("accountNo") String accountNo) {
		return this.bankAccountTransactionResource.getBankCustomerTransaction(bankId, accountNo);
	}

	@GetMapping("customer/fetch/timerange")
    @Operation(
            summary = "Fetch customer transactions by time range",
            description = "Fetches customer transaction history within a given time range"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transactions fetched successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid date range"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getBankCustomerTransactionByTimeRange(
			@RequestParam("bankId") int bankId, @RequestParam("accountNo") String accountNo,
			@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
		return this.bankAccountTransactionResource.getBankCustomerTransactionByTimeRange(bankId, accountNo, startTime,
				endTime);
	}

	@GetMapping("all/customer/fetch/timerange")
    @Operation(
            summary = "Fetch all customer transactions by time range",
            description = "Fetches transaction history of all customers for a bank within time range"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transactions fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getBankAllCustomerTransactionsByTimeRange(
			@RequestParam("bankId") int bankId, @RequestParam("startTime") String startTime,
			@RequestParam("endTime") String endTime) {
		return this.bankAccountTransactionResource.getBankAllCustomerTransactionByTimeRange(bankId, startTime, endTime);
	}

	@GetMapping("all/customer/fetch")
    @Operation(
            summary = "Fetch all customer transactions bank-wise",
            description = "Fetches all customer transactions for a specific bank"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transactions fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getBankAllCustomerTransaction(
			@RequestParam("bankId") int bankId) {
		return this.bankAccountTransactionResource.getBankAllCustomerTransaction(bankId);
	}

	@GetMapping("history/timerange")
    @Operation(
            summary = "Fetch user transactions by time range",
            description = "Fetches transaction history of a user within a given time range"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transactions fetched successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid date range"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<BankTransactionResponseDto> getCustomerTransactionsByTimeRange(
			@RequestParam("userId") int userId, @RequestParam("startTime") String startTime,
			@RequestParam("endTime") String endTime) {
		return this.bankAccountTransactionResource.bankTransactionHistoryByTimeRange(userId, startTime, endTime);
	}

	@GetMapping("statement/download")
    @Operation(
            summary = "Download bank statement",
            description = "Downloads bank transaction statement PDF for a given account and time range"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank statement downloaded successfully"),
            @ApiResponse(responseCode = "404", description = "Account not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Error while generating PDF")
    })
	public void downloadBankStatement(@RequestParam("accountId") int accountId,
	                                  @RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime,
	                                  HttpServletResponse response) throws DocumentException, IOException {
		this.bankAccountTransactionResource.downloadBankStatement(accountId, startTime, endTime, response);
	}

}
