package com.fullstack.dto;

import java.util.ArrayList;
import java.util.List;

import com.fullstack.entity.BankAccountTransaction;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankTransactionResponseDto extends CommonApiResponse {

	private List<BankAccountTransaction> bankTransactions = new ArrayList<>();
}
