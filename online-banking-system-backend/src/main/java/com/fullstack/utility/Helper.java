package com.fullstack.utility;

import java.util.Random;

public class Helper {

	private static final Random random = new Random();  // Compliant

	private Helper() {
		throw new IllegalStateException("Utility class");
	}

	public static String getAlphaNumericTransactionId() {

		String alphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
				+ "0123456789"
				+ "abcdefghijklmnopqrstuvxyz";

		StringBuilder sb = new StringBuilder(16);

		for (int i = 0; i < 16; i++) {
			int index = (alphaNumericString.length() * random.nextInt());

			sb.append(alphaNumericString.charAt(index));
		}

		return sb.toString().toUpperCase();
	}

}
