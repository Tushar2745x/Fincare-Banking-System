package com.fullstack.dto;

import com.fullstack.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginResponse extends CommonApiResponse {

	private User user;

	private String jwtToken;
}
