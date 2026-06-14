package com.fullstack.controller;

import com.fullstack.dto.BankDetailsResponseDto;
import com.fullstack.dto.CommonApiResponse;
import com.fullstack.dto.RegisterBankRequestDto;
import com.fullstack.resource.BankResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@RestController
@RequestMapping("api/bank/")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "Bearer Auth")
@Tag(name = "Bank", description = "APIS Of Bank Controller")
public class BankController {

	@Autowired
	private BankResource bankResource;

	// for customer and bank register
	@PostMapping("register")
    @Operation(
            summary = "Register a new bank",
            description = "Registers a new bank along with bank user details"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid bank registration request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> registerBank(@RequestBody RegisterBankRequestDto request) {
		return this.bankResource.registerBank(request);
	}

	// for fetching all the Banks
	@GetMapping("fetch/all")
    @Operation(
            summary = "Fetch all banks",
            description = "Fetches the list of all registered banks"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Banks fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<BankDetailsResponseDto> fetchAllBanks() {
		return this.bankResource.fetchAllBanks();
	}

	// for fetching all the Bank by Id
	@GetMapping("fetch/id")
    @Operation(
            summary = "Fetch bank by bank ID",
            description = "Fetches bank details using bank ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Bank not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankDetailsResponseDto> fetchBankById(@RequestParam("bankId") int bankId) {
		return this.bankResource.fetchBankById(bankId);
	}

	// for fetching the Bank by using the Bank user Id
	@GetMapping("fetch/user")
    @Operation(
            summary = "Fetch bank by user ID",
            description = "Fetches bank details associated with a bank user ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Bank user not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
	public ResponseEntity<BankDetailsResponseDto> fetchBankByUserId(@RequestParam("userId") int userId) {
		return this.bankResource.fetchBankByUserId(userId);
	}

}
