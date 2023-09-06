package com.example.demo.Objects;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	private String userNum;
	private String userName;
	private String telNum;
	private String add1;
	private String add2;
	private int penaDay = 0;
	private LocalDate penaUpdateDay;
	//private List<rentAdminObj> rentingBooks;
}
