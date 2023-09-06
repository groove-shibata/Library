package com.example.demo.Model.DAO;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.Objects.RentAdminObj;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RentAdminDAO {
	private final JdbcTemplate jdbc;
	
	
	//図書カード番号と紐づく貸出中書籍のリストを返却します。
	//貸出中書籍が存在しなかった場合はsize()=0のリストが返却されます。
	public List<RentAdminObj> selectByUserNum(String userNum) {
		List<RentAdminObj> returnList = new ArrayList<RentAdminObj>();
		String query = "select * from rent_admin_table where userNum = ?";
		List<Map<String,Object>> resultList = jdbc.queryForList(query,userNum);
		for(Map<String,Object> m:resultList) {
			//SQLDate型からのLocalDate型の変換と更新が行われていなかった場合の処理を行います
			Date sqlDate = (Date)m.get("returnDate");
			LocalDate date = null;
			if(sqlDate != null) {
				date = sqlDate.toLocalDate();
			}
			//取得した情報をRentAdminObj型へ整形し返却します
			RentAdminObj o = new RentAdminObj(
					(String) m.get("userNum") ,
					(String) m.get("bookNum") ,
					(String) m.get("bookBranchNum") ,
					date,
					(int)  m.get("extensionCount")
					);
			returnList.add(o);
		}
		return returnList;
	}
	
	//書籍番号と枝番から該当する1書籍のみを取得します。
	//該当書籍が存在しなかった場合nullを返却します。
	public RentAdminObj selectByBookNumAndBranchNum(String bookNum,String bookBranchNum) {
		String query = "select * from rent_admin_table where bookNum = ? and bookBranchNum = ?";
		try {
			Map<String,Object> resultMap = jdbc.queryForMap(query,bookNum,bookBranchNum);
			Date date = (Date) resultMap.get("returnDate");
			RentAdminObj obj = new RentAdminObj(
					(String) resultMap.get("userNum") ,
					(String) resultMap.get("bookNum") ,
					(String) resultMap.get("bookBranchNum") ,
					date.toLocalDate() ,
					(int)  resultMap.get("extensionCount")
					);
			return obj;
		}catch(IncorrectResultSizeDataAccessException e) {
			return null;
		}
	}
	
	//書籍番号-枝番から貸出管理テーブルの該当するレコードを削除します。
	public void delete(String bookNum,String bookBranchNum) {
		String query = "delete from rent_admin_table where bookNum = ? and bookBranchNum = ?";
		jdbc.update(query,bookNum,bookBranchNum);
	}
	
	//引数のオブジェクトの書籍番号と枝番に該当するレコードの
	//返却期限を更新します。延長回数は既存の回数に1増加させます。
	public void update(RentAdminObj rentAdminObj) {
		String bookNum = rentAdminObj.getBookNum();
		String bookBranchNum = rentAdminObj.getBookBranchNum();
		LocalDate returnDate = rentAdminObj.getReturnDate();
		String query = "update rent_admin_table set returnDate = ?, extensionCount = extensionCount + 1 where bookNum = ? and bookBranchNum = ?";
		jdbc.update(query,returnDate,bookNum,bookBranchNum);
	}
	
	//指定されたオブジェクトから登録処理を実行
	//延長回数は0回で登録されます。
	public void insert(RentAdminObj rentAdminObj) {
		String userNum = rentAdminObj.getUserNum();
		String bookNum = rentAdminObj.getBookNum();
		String bookBranchNum = rentAdminObj.getBookBranchNum();
		LocalDate returnDate = rentAdminObj.getReturnDate();
		String query = "insert into rent_admin_table(userNum,bookNum,bookBranchNum,returnDate) values (?,?,?,?)";
		jdbc.update(query,userNum,bookNum,bookBranchNum,returnDate);
	}
}
