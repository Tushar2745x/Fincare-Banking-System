package com.fullstack.exception;

import com.fullstack.dto.CommonApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(FailedToRegisterBankException.class)
	public ResponseEntity<CommonApiResponse> handleUserNotFoundException(FailedToRegisterBankException ex) {
		String responseMessage = ex.getMessage();

		CommonApiResponse apiResponse = new CommonApiResponse();

		apiResponse.setResponseMessage(responseMessage);
		apiResponse.setSuccess(false);
		return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ExceptionHandler(BankAccountTransactionException.class)
	public ResponseEntity<CommonApiResponse> handleBankAccountTransactionException(BankAccountTransactionException ex) {
		String responseMessage = ex.getMessage();

		CommonApiResponse apiResponse = new CommonApiResponse();

		apiResponse.setResponseMessage(responseMessage);
		apiResponse.setSuccess(false);
		return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<CommonApiResponse> handleRuntimeException(RuntimeException ex) {
		CommonApiResponse apiResponse = new CommonApiResponse();
		apiResponse.setResponseMessage(ex.getMessage());
		apiResponse.setSuccess(false);
		return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);

	}

}
