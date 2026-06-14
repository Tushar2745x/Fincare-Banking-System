package com.fullstack.controller;

import com.fullstack.dto.*;
import com.fullstack.resource.UserResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@RestController
@RequestMapping("api/user/")
@CrossOrigin
@Tag(name = "User", description = "APIS Of User Controller")
public class UserController {

	@Autowired
	private UserResource userResource;

	// for customer and bank register
	@PostMapping("register")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Register customer or bank user",
            description = "Registers a new customer or bank user based on provided role"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user registration request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> registerUser(@RequestBody RegisterUserRequestDto request) {
		return this.userResource.registerUser(request);
	}

	// RegisterUserRequestDto, we will set only email, password & role from UI
	@PostMapping("/admin/register")
    @Operation(
            summary = "Register admin user",
            description = "Registers a new admin user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid admin registration request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<CommonApiResponse> registerAdmin(@RequestBody RegisterUserRequestDto request) {
		return userResource.registerAdmin(request);
	}

	@PostMapping("login")

    @Operation(
            summary = "User login",
            description = "Authenticates user and returns JWT token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
	public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest userLoginRequest) {
		return userResource.login(userLoginRequest);
	}

	@GetMapping("/fetch/role")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Fetch users by role",
            description = "Fetches users based on provided role (ADMIN, BANK, CUSTOMER)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<UserListResponseDto> fetchAllBankUsers(@RequestParam("role") String role) {
		return userResource.getUsersByRole(role);
	}

	@GetMapping("/fetch/bank/managers")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Fetch unassigned bank managers",
            description = "Fetches bank managers who are not assigned to any bank"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bank managers fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<UserListResponseDto> fetchBankManagers() {
		return userResource.fetchBankManagers();
	}

	@PostMapping("update/status")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Update user status",
            description = "Updates user status (ACTIVE / INACTIVE / BLOCKED)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User status updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "400", description = "Invalid status update request")
    })
	public ResponseEntity<CommonApiResponse> updateUserStatus(@RequestBody UserStatusUpdateRequestDto request) {
		return userResource.updateUserStatus(request);
	}

	@GetMapping("/bank/customers")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Fetch bank customers by bank ID",
            description = "Fetches all customers associated with a bank"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customers fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Bank not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<UserListResponseDto> fetchAllBankCustomersByBankId(@RequestParam("bankId") int bankId) {
		return userResource.fetchBankCustomerByBankId(bankId);
	}

	@GetMapping("/bank/customer/search")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Search bank customers by name",
            description = "Search bank customers using bank ID and customer name"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customers fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<UserListResponseDto> searchBankCustomer(@RequestParam("bankId") int bankId, @RequestParam("customerName") String customerName) {
		return userResource.searchBankCustomer(bankId, customerName);
	}

	@GetMapping("/all/customer/search")
	@SecurityRequirement(name = "Bearer Auth")
    @Operation(
            summary = "Search all bank customers",
            description = "Search customers across all banks by customer name"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customers fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
	public ResponseEntity<UserListResponseDto> searchBankCustomer(@RequestParam("customerName") String customerName) {
		return userResource.searchBankCustomer(customerName);
	}

}
