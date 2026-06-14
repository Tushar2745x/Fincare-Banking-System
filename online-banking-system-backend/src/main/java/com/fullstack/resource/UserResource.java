package com.fullstack.resource;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullstack.config.CustomUserDetailsService;
import com.fullstack.dto.*;
import com.fullstack.entity.Bank;
import com.fullstack.entity.User;
import com.fullstack.service.BankService;
import com.fullstack.service.JwtService;
import com.fullstack.service.UserService;
import com.fullstack.utility.Constants.IsAccountLinked;
import com.fullstack.utility.Constants.UserRole;
import com.fullstack.utility.Constants.UserStatus;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Log4j2
public class UserResource {

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private BankService bankService;

	public ResponseEntity<CommonApiResponse> registerUser(RegisterUserRequestDto request) {

		log.info("Received request for register user");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("user is null");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userService.getUserByEmail(request.getEmail());

		if (existingUser != null) {
			response.setResponseMessage("User with this Email Id already resgistered!!!");
			response.setSuccess(false);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getRoles() == null) {
			response.setResponseMessage("bad request ,Role is missing");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User user = RegisterUserRequestDto.toUserEntity(request);

		if (request.getRoles().equals(UserRole.ROLE_CUSTOMER.value())) {
			if (request.getBankId() == 0) {
				response.setResponseMessage("bad request ,Bank Id is missing");
				response.setSuccess(true);

				return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
			}

			Bank bank = this.bankService.getBankById(request.getBankId());
			user.setBank(bank);
			user.setIsAccountLinked(IsAccountLinked.NO.value());
		}


		String encodedPassword = passwordEncoder.encode(user.getPassword());

		user.setStatus(UserStatus.ACTIVE.value());
		user.setPassword(encodedPassword);


		existingUser = this.userService.registerUser(user);

		if (existingUser == null) {
			response.setResponseMessage("failed to register user");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("User registered Successfully");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occur due to : {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> registerAdmin(RegisterUserRequestDto registerRequest) {

		CommonApiResponse response = new CommonApiResponse();

		if (registerRequest == null) {
			response.setResponseMessage("user is null");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (registerRequest.getEmail() == null || registerRequest.getPassword() == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User existingUser = this.userService.getUserByEmail(registerRequest.getEmail());

		if (existingUser != null) {
			response.setResponseMessage("User already register with this Email");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		User user = new User();
		user.setEmail(registerRequest.getEmail());
		user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
		user.setRoles(UserRole.ROLE_ADMIN.value());
		user.setStatus(UserStatus.ACTIVE.value());
		existingUser = this.userService.registerUser(user);

		if (existingUser == null) {
			response.setResponseMessage("failed to register admin");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		response.setResponseMessage("Admin registered Successfully");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occur due to: {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserLoginResponse> login(UserLoginRequest loginRequest) {

		UserLoginResponse response = new UserLoginResponse();

		if (loginRequest == null) {
			response.setResponseMessage("Missing Input");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		String jwtToken = null;

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getEmailId(), loginRequest.getPassword()));
		} catch (Exception ex) {
			response.setResponseMessage("Invalid email or password.");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmailId());

		User user = userService.getUserByEmail(loginRequest.getEmailId());

		if (!user.getStatus().equals(UserStatus.ACTIVE.value())) {
			response.setResponseMessage("User is deactivated, please contact branch manager");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		for (GrantedAuthority grantedAuthory : userDetails.getAuthorities()) {
			if (grantedAuthory.getAuthority().equals(loginRequest.getRole())) {
				jwtToken = jwtService.generateToken(userDetails.getUsername());
			}
		}

		// user is authenticated
		if (jwtToken != null) {
			response.setUser(user);
			response.setResponseMessage("Logged in sucessful");
			response.setSuccess(true);
			response.setJwtToken(jwtToken);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setResponseMessage("Failed to login");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

	}

	public ResponseEntity<UserListResponseDto> getUsersByRole(String role) {

		UserListResponseDto response = new UserListResponseDto();

		List<User> users = this.userService.getUserByRoles(role);

		if (!users.isEmpty()) {
			response.setUsers(users);
		}

		response.setResponseMessage("User Fetched Successfully..");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occurs due to : {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserListResponseDto> fetchBankManagers() {

		UserListResponseDto response = new UserListResponseDto();

		List<User> users = this.userService.getUsersByRolesAndStatusAndBankIsNull(UserRole.ROLE_BANK.value(), UserStatus.ACTIVE.value());

		if (!users.isEmpty()) {
			response.setUsers(users);
		}

		response.setResponseMessage("User Fetched Successfully....");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occurs due to: {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateUserStatus(UserStatusUpdateRequestDto request) {

		log.info("Received request for updating the user status");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("bad request, missing data");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getUserId() == 0) {
			response.setResponseMessage("bad request, user id is missing");
			response.setSuccess(true);

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}


		User user = this.userService.getUserById(request.getUserId());
		user.setStatus(request.getStatus());

		User updatedUser = this.userService.updateUser(user);

		if (updatedUser != null) {
			response.setResponseMessage("User " + request.getStatus() + " Successfully!!!");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setResponseMessage("Failed to " + request.getStatus() + " the user");
			response.setSuccess(true);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	public ResponseEntity<UserListResponseDto> fetchBankCustomerByBankId(int bankId) {

		UserListResponseDto response = new UserListResponseDto();

		List<User> users = this.userService.getUserByRolesAndBank(UserRole.ROLE_CUSTOMER.value(), bankId);

		if (!users.isEmpty()) {
			response.setUsers(users);
		}

		response.setResponseMessage("User Fetched Successfully....");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occur due to :: {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserListResponseDto> searchBankCustomer(int bankId, String customerName) {

		UserListResponseDto response = new UserListResponseDto();

		List<User> users = this.userService.searchBankCustomerByNameAndRole(customerName, bankId, UserRole.ROLE_CUSTOMER.value());

		if (!users.isEmpty()) {
			response.setUsers(users);
		}

		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occurs due to :: {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<UserListResponseDto> searchBankCustomer(String customerName) {

		UserListResponseDto response = new UserListResponseDto();

		List<User> users = this.userService.searchBankCustomerByNameAndRole(customerName, UserRole.ROLE_CUSTOMER.value());

		if (!users.isEmpty()) {
			response.setUsers(users);
		}

		response.setResponseMessage("User Fetched Successfully");
		response.setSuccess(true);

		// Convert the object to a JSON string
		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			log.error("Error occur due to - {}", e.getMessage());
		}

		log.info(jsonString);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
