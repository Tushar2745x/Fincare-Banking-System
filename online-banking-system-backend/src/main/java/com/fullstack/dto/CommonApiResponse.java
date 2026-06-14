package com.fullstack.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonApiResponse {

	private String responseMessage;

	private boolean isSuccess;
}
