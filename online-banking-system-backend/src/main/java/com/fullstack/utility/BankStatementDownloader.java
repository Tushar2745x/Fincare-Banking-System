package com.fullstack.utility;

import com.fullstack.entity.BankAccountTransaction;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.VerticalPositionMark;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.awt.*;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class BankStatementDownloader {

	private final List<BankAccountTransaction> transactions;
	private final String startDate;
	private final String endDate;

	private void writeTableHeader(PdfPTable table) {
		PdfPCell cell = new PdfPCell();
		cell.setBackgroundColor(new Color(253, 240, 213));
		cell.setPadding(5);

		Font font = FontFactory.getFont(FontFactory.HELVETICA);
		font.setColor(new Color(31, 53, 65));

		cell.setPhrase(new Phrase("Transaction Id", font));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Transaction Type", font));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Amount", font));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Beneficiary Account", font));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Narration", font));
		table.addCell(cell);

		cell.setPhrase(new Phrase("Transaction Time", font));
		table.addCell(cell);

	}

	private void writeTableData(PdfPTable table) {
		for (BankAccountTransaction transaction : transactions) {
			table.addCell(transaction.getTransactionId());
			table.addCell(transaction.getType());
			table.addCell(String.valueOf(transaction.getAmount()));
			table.addCell(transaction.getDestinationBankAccount() != null ? transaction.getDestinationBankAccount().getNumber() : "--");
			table.addCell(transaction.getNarration());
			table.addCell(DateTimeUtils.getProperDateTimeFormatFromEpochTime(transaction.getTransactionTime()));
		}
	}

	public void export(HttpServletResponse response) throws DocumentException, IOException {
		try (Document document = new Document(PageSize.A4)) {

			PdfWriter.getInstance(document, response.getOutputStream());
			document.open();
			Image image = Image.getInstance("classpath:images/logo.png");
			image.scalePercent(8.0f, 8.0f);
			document.add(image);

			Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			headerFont.setSize(25);
			headerFont.setColor(new Color(120, 0, 0));
			Paragraph pHeader = new Paragraph("Customer Bank Statement\n", headerFont);
			pHeader.setAlignment(Element.ALIGN_CENTER);
			document.add(pHeader);

			Font fontP = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			fontP.setSize(18);
			fontP.setColor(new Color(120, 0, 0));
			Chunk glue = new Chunk(new VerticalPositionMark());
			Paragraph pp = new Paragraph("\nBank Details", fontP);
			pp.add(new Chunk(glue));
			pp.add("Bank Account Details:");
			document.add(pp);

			Font fontN = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			fontN.setSize(12);
			fontN.setColor(Color.BLACK);
			Chunk glueN = new Chunk(new VerticalPositionMark());
			Paragraph pN = new Paragraph(
					"Bank Name: " + transactions.get(0).getBank().getName(), fontN);
			pN.add(new Chunk(glueN));
			pN.add("Account No.: " + transactions.get(0).getBankAccount().getNumber());
			document.add(pN);

			Font fontA = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			fontA.setSize(12);
			fontA.setColor(Color.BLACK);
			Chunk glueA = new Chunk(new VerticalPositionMark());
			Paragraph pA = new Paragraph("Bank Code: " + transactions.get(0).getBank().getCode(),
					fontA);
			pA.add(new Chunk(glueA));
			pA.add("Ifsc Code: " + transactions.get(0).getBankAccount().getIfscCode());
			document.add(pA);

			Font fontC = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			fontC.setSize(12);
			fontC.setColor(Color.BLACK);
			Chunk glueC = new Chunk(new VerticalPositionMark());
			Paragraph pC = new Paragraph("Bank Email: " + transactions.get(0).getBank().getEmail(),
					fontC);
			pC.add(new Chunk(glueC));
			pC.add("Mobile No: " + transactions.get(0).getUser().getContact());
			document.add(pC);


			Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			font.setSize(22);
			font.setColor(new Color(120, 0, 0));
			Paragraph p = new Paragraph("\nBank Transactions\n", font);
			p.setAlignment(Element.ALIGN_CENTER);
			document.add(p);

			Font fontStatementRange = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			fontStatementRange.setSize(14);
			fontStatementRange.setColor(new Color(120, 0, 0));
			Paragraph pStatementRange = new Paragraph("\nBank Statement from " + startDate + " to " + endDate + " \n", fontStatementRange);
			pStatementRange.setAlignment(Element.ALIGN_LEFT);
			document.add(pStatementRange);

			PdfPTable table = new PdfPTable(6);
			table.setWidthPercentage(100f);
			table.setWidths(new float[]{2.0f, 2.0f, 1.5f, 2.0f, 3.1f, 3.2f});
			table.setSpacingBefore(10);

			writeTableHeader(table);
			writeTableData(table);

			document.add(table);
		}
	}

}
