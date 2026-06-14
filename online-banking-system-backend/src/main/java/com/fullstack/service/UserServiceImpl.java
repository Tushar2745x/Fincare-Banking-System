package com.fullstack.service;

import com.fullstack.dao.UserDao;
import com.fullstack.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Override
	public User registerUser(User user) {
		return userDao.save(user);
	}

	@Override
	public User updateUser(User user) {
		return userDao.save(user);
	}

	@Override
	public User getUserById(int userId) {
		return userDao.findById(userId).orElse(null);
	}

	@Override
	public User getUserByEmailAndPassword(String email, String password) {
		return userDao.findByEmailAndPassword(email, password);
	}

	@Override
	public User getUserByEmailAndPasswordAndRoles(String email, String password, String role) {
		return userDao.findByEmailAndPasswordAndRoles(email, password, role);
	}

	@Override
	public User getUserByEmail(String email) {
		return userDao.findByEmail(email);
	}

	@Override
	public List<User> getUsersByRolesAndStatus(String role, String status) {
		return userDao.findByRolesAndStatus(role, status);
	}

	@Override
	public User getUserByEmailAndRoles(String email, String role) {
		return userDao.findByEmailAndRoles(email, role);
	}

	@Override
	public List<User> getUsersByRolesAndStatusAndBank(String role, String status, int bankId) {
		return userDao.findByRolesAndStatusAndBank_Id(role, status, bankId);
	}

	@Override
	public List<User> getUserByRoles(String role) {
		return userDao.findByRoles(role);
	}

	@Override
	public List<User> getUsersByRolesAndStatusAndBankIsNull(String role, String status) {
		return userDao.findByRolesAndStatusAndBankIsNull(role, status);
	}

	@Override
	public List<User> getUserByRolesAndBank(String role, int bankId) {
		return userDao.findByRolesAndBank_Id(role, bankId);
	}

	@Override
	public List<User> searchBankCustomerByNameAndRole(String customerName, int bankId, String role) {
		return userDao.findByNameContainingIgnoreCaseAndBank_IdAndRoles(customerName, bankId, role);
	}

	@Override
	public List<User> searchBankCustomerByNameAndRole(String customerName, String role) {
		return userDao.findByNameContainingIgnoreCaseAndRoles(customerName, role);
	}

}
