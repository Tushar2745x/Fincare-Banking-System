package com.fullstack.controller;

import com.fullstack.dto.AddBankAccountRequestDto;
import com.fullstack.dto.BankAccountResponseDto;
import com.fullstack.dto.BankAccountStatusUpdateRequestDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.resource.BankAccountResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@RestController
@RequestMapping("api/bank/account")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Bank Account", description = "APIS Of Bank Account Controller")
public class BankAccountController {

	@Autowired
	private BankAccountResource bankAccountResource;

	// for customer and bank register
	@PostMapping("add")
    @Operation(
            summary = "Add new bank account",
            description = "Creates a new bank account for a customer or bank user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank account added successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> addBankAccount(@RequestBody AddBankAccountRequestDto request) {
		return this.bankAccountResource.addBankAccount(request);
	}



	@GetMapping("fetch/all")
    @Operation(
            summary = "Fetch all bank accounts",
            description = "Returns a list of all bank accounts available in the system"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank accounts fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<BankAccountResponseDto> getAllBankAccounts() {
		return this.bankAccountResource.fetchAllBankAccounts();
	}



	@GetMapping("fetch/bankwise")
    @Operation(
            summary = "Fetch bank accounts by bank ID",
            description = "Returns all bank accounts associated with a specific bank"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank accounts fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Bank not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankAccountResponseDto> getBankAccounts(@RequestParam("bankId") int bankId) {
		return this.bankAccountResource.fetchBankAccountByBank(bankId);
	}



	@GetMapping("fetch/id")
    @Operation(
            summary = "Fetch bank account by account ID",
            description = "Returns bank account details using account ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank account fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Bank account not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankAccountResponseDto> getBankAccountById(@RequestParam("accountId") int accountId) {
		return this.bankAccountResource.fetchBankAccountById(accountId);
	}

	@GetMapping("fetch/user")
    @Operation(
            summary = "Fetch bank accounts by user ID",
            description = "Returns all bank accounts linked to a specific user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank accounts fetched successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankAccountResponseDto> getBankAccountByUser(@RequestParam("userId") int userId) {
		return this.bankAccountResource.fetchBankAccountByUserId(userId);
	}

	@GetMapping("search")
    @Operation(
            summary = "Search bank accounts by bank and account number",
            description = "Search bank accounts using bank ID and partial or full account number"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results fetched successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankAccountResponseDto> searchBankBy(@RequestParam("bankId") int bankId, @RequestParam("accountNumber") String accountNumber) {
		return this.bankAccountResource.searchBankAccounts(accountNumber, bankId);
	}

	@PostMapping("update/status")
    @Operation(
            summary = "Update bank account status",
            description = "Updates the status of a bank account (ACTIVE / INACTIVE / BLOCKED)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank account status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Bank account not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "400", description = "Invalid status update request")
    })
	public ResponseEntity<CommonApiResponse> updateBankAccountStatus(@RequestBody BankAccountStatusUpdateRequestDto request) {
		return this.bankAccountResource.updateBankAccountStatus(request);
	}

	@GetMapping("search/all")
    @Operation(
            summary = "Search bank accounts by account number",
            description = "Search all bank accounts using partial or full account number"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results fetched successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid account number"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankAccountResponseDto> searchBankBy(@RequestParam("accountNumber") String accountNumber) {
		return this.bankAccountResource.searchBankAccounts(accountNumber);
	}

}
