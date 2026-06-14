package com.fullstack.dto;

import java.util.List;

import com.fullstack.entity.BankAccount;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankAccountResponseDto extends CommonApiResponse {

	private List<BankAccount> accounts;
}
