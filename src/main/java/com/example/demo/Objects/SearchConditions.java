package com.example.demo.Objects;

import lombok.Data;

@Data
public class SearchConditions {
	private String bookName;
	private String authorName;
	private String genreNum;
	private int prioriSort;
	private int bookNameSort;
	private int authorNameSort;
}
