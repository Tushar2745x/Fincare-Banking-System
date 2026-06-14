package com.fullstack.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatusUpdateRequestDto {

	private Integer userId;

	private String status;
}
