package com.example.demo.Model.DAO;

import java.util.List;
import java.util.Map;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.Objects.Book;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BookDAO {
	private final JdbcTemplate jdbc;

	//指定された書籍番号から該当する書籍情報を返却します。
	public List<Book> selectByBookNum(String bookNum) {
		String query = "select * from book where bookNum = ?";
		return jdbc.queryForList(query, Book.class, bookNum);
	}

	//指定された書籍番号-枝番から該当する書籍情報を返却します。
	//該当する書籍が存在しない場合はnullを返却します。
	public Book selectByBookNumAndBookBranchNum(String bookNum,String bookBranchNum) {
		String query = "select * from book where bookNum = ? and bookBranchNum = ?";
		try {
			Map<String,Object> map = jdbc.queryForMap(query,bookNum,bookBranchNum);
			return new Book(
					(String)map.get("bookNum"),
					(String)map.get("bookBranchNum"),
					(String)map.get("bookName"),
					(String)map.get("authorName"),
					(String)map.get("bookPlace"),
					(String)map.get("genreNum")
					);
		}catch(IncorrectResultSizeDataAccessException e) {
			//該当する値が存在しない場合はnullを返却します
			return null;
		}
	}
}
