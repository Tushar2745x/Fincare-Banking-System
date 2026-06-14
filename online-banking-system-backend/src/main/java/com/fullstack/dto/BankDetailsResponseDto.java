package com.fullstack.dto;

import java.util.ArrayList;
import java.util.List;

import com.fullstack.entity.Bank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankDetailsResponseDto extends CommonApiResponse {

	private List<Bank> banks = new ArrayList<>();
}
