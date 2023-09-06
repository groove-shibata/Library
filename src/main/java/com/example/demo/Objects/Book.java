package com.example.demo.Objects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
	private String bookNum;
	private String bookBranchNum;
	private String bookName;
	private String authorName;
	private String bookPlace;
	private String genreNum;
}
