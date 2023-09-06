package com.example.demo.Objects;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class JsonRequestObject {
	//user
	private String userNum;
	private String userName;
	private String telNum;
	private String add1;
	private String add2;
	
	
	//book
	private String bookNum;
	private String bookBranchNum;
	private List<Map<String,String>> rentBooks;
	private String bookName;
	private String authorName;
	
	//previousBook
	private String previousBookNum;
	private String previousBookName;
	private String previousAuthorName;
	
	//RentAdminObject
	private LocalDate updatedReturnDate;
	
	//search
	private SearchConditions searchConditions;
	
	//genre
	private String genreNum;
}
