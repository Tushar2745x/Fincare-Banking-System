package com.fullstack.dto;

import java.util.ArrayList;
import java.util.List;

import com.fullstack.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserListResponseDto extends CommonApiResponse {

	private List<User> users = new ArrayList<>();
}
