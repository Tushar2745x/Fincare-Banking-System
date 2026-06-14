package com.fullstack.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import com.fullstack.entity.User;

@Getter
@Setter
public class RegisterUserRequestDto {

	private Integer id;

	private String name;

	private String email;

	private String password;

	private String roles;

	private String gender;

	private String contact;

	private String street;

	private String city;

	private String pincode;

	private String aadhaarCard;

	private Integer bankId;

	public static User toUserEntity(RegisterUserRequestDto registerUserRequestDto) {
		User user = new User();
		BeanUtils.copyProperties(registerUserRequestDto, user, "bankId");
		return user;
	}

}
