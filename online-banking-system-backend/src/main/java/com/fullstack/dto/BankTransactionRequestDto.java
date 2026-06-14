package com.fullstack.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BankTransactionRequestDto {

	private int userId;

	private int bankId;

	private BigDecimal amount;

	private int sourceBankAccountId;

	private String transactionType;

	private String toBankAccount; // for account transfer

	private String toBankIfsc; // for account transfer

	private String accountTransferPurpose;
}
