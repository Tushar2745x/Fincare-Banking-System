package com.fullstack.utility;

import java.util.UUID;

public class TransactionIdGenerator {

	private TransactionIdGenerator() {
		throw new IllegalStateException("Utility class");
	}

	public static String generate() {
		UUID uuid = UUID.randomUUID();
		String uuidHex = uuid.toString().replace("-", ""); // Remove hyphens
		return uuidHex.substring(0, 16);
	}

}
