package com.example.demo.Objects;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentAdminObj {
	private String userNum;
	private String bookNum;
	private String bookBranchNum;
	private LocalDate returnDate;
	private int extensionCount = 0;

	public RentAdminObj(
			String userNum,
			String bookNum,
			String bookBranchNum,
			LocalDate returnDate) {
		this.userNum = userNum;
		this.bookNum = bookNum;
		this.bookBranchNum = bookBranchNum;
		this.returnDate = returnDate;
	}
}