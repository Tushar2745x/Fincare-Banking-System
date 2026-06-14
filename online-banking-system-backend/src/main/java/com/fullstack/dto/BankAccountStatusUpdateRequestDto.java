package com.fullstack.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankAccountStatusUpdateRequestDto {

	private int accountId;

	private String status;
}
