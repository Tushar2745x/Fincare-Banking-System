package com.fullstack.utility;

import lombok.AllArgsConstructor;

public class Constants {

	@AllArgsConstructor
	public enum UserRole {
		ROLE_CUSTOMER("CUSTOMER"),
		ROLE_ADMIN("ADMIN"),
		ROLE_BANK("BANK");

		private final String role;

		public String value() {
			return this.role;
		}
	}

	@AllArgsConstructor
	public enum UserStatus {
		ACTIVE("Active"),
		DEACTIVATED("Deactivated");


		private final String status;

		public String value() {
			return this.status;
		}
	}

	@AllArgsConstructor
	public enum IsAccountLinked {
		YES("Yes"),
		NO("No");


		private final String status;

		public String value() {
			return this.status;
		}
	}

	@AllArgsConstructor
	public enum BankAccountStatus {
		OPEN("Open"),
		DELETED("Deleted"),
		LOCK("Lock");

		private final String status;

		public String value() {
			return this.status;
		}
	}

	@AllArgsConstructor
	public enum BankAccountType {
		SAVING("Saving"),
		CURRENT("Current");

		private final String type;

		public String value() {
			return this.type;
		}
	}

	@AllArgsConstructor
	public enum TransactionType {
		WITHDRAW("Withdraw"),
		DEPOSIT("Deposit"),
		BALANCE_FETCH("Balance Fetch"),
		ACCOUNT_TRANSFER("Account Transfer"),
		LOAN_DISBURSEMENT("Loan Disbursement");

		private final String type;

		public String value() {
			return this.type;
		}
	}

	@AllArgsConstructor
	public enum TransactionNarration {
		BANK_WITHDRAW("Bank Cash Withdraw"),
		BANK_DEPOSIT("Bank Cash Deposit"),
		LOAN_DISBURSEMENT("Loan Amount Credited to Account");

		private final String narration;

		public String value() {
			return this.narration;
		}
	}

}
