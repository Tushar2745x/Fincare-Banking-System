package com.fullstack.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequest {

	private String emailId;

	private String password;

	private String role;
}
