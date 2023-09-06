package com.example.demo.Model.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Model.DAO.BookDAO;
import com.example.demo.Model.DAO.RentAdminDAO;
import com.example.demo.Objects.Book;
import com.example.demo.Objects.RentAdminObj;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RentService {
	private final BookDAO bookDao;
	private final RentAdminDAO rentAdminDao;
	
	//貸出時の返却期限までの日数を指定します。
	private int rentDaysOnce = 7; 
	
	//指定された書籍番号-枝番に該当する書籍が貸出管理テーブルに存在するか確認し、
	//存在した場合は書籍情報を、しなかった場合は書籍番号がnullのbookオブジェクトを返却します。
	public Book isBookAndGetThatDatas(String bookNum,String bookBranchNum) {
		Book book = bookDao.selectByBookNumAndBookBranchNum(bookNum, bookBranchNum);
		if(book == null) {
			return new Book();
		}
		return book;
	}
	
	//指定された書籍番号-枝番のリストと図書カード番号から貸出処理を行います。
	//貸出管理テーブルに既に存在している書籍は登録処理を行わず貸出失敗リストに書籍情報を追加し、
	//存在していなかった場合は貸出成功リストに書籍情報を追加してそれらをマップに梱包し返却します。
	@Transactional(rollbackFor = Exception.class)
	public Map<String,List<Book>> checkDatasAndRentBooks(String userNum,List<Map<String,String>> rentBooks){
		//返却用のマップを定義します
		Map<String,List<Book>> resultMap = new HashMap<String,List<Book>>();
		//貸出成功リストを定義します
		List<Book> succeededBooksList = new ArrayList<Book>();
		//貸出失敗リストを定義します
		List<Book> failedBooksList = new ArrayList<Book>();
		
		for(Map<String,String> map : rentBooks) {
			//貸出管理テーブルに存在する（既に貸出されている）なら書籍情報をエラー書籍としてリストに登録する。
			if(rentAdminDao.selectByBookNumAndBranchNum(map.get("bookNum"), map.get("bookBranchNum")) != null) {
				Book book = bookDao.selectByBookNumAndBookBranchNum(map.get("bookNum"), map.get("bookBranchNum"));
				failedBooksList.add(book);
			}else {
				rentAdminDao.insert(new RentAdminObj(
						userNum,
						map.get("bookNum"),
						map.get("bookBranchNum"),
						LocalDate.now().plusDays(rentDaysOnce)
					));
				Book book = bookDao.selectByBookNumAndBookBranchNum(map.get("bookNum"), map.get("bookBranchNum"));
				succeededBooksList.add(book);
			}
		}
		resultMap.put("succeededBooksList",succeededBooksList);
		resultMap.put("failedBooksList",failedBooksList);
		return resultMap;
	}
}
