package com.example.demo.Model.DAO;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserDAO {
	private final JdbcTemplate jdbc;
	private final NamedParameterJdbcTemplate namedJdbc;

	//図書カード番号に応じた利用者情報を返却します。
	//該当する登録情報が存在しない場合はnullを返却します。
	public User selectByUserNum(String userNum) {
		String query = "select * from user where userNum = ?";
		try {
			Map<String,Object> resultMap = jdbc.queryForMap(query,userNum);
			Date sqlDate = (Date)resultMap.get("penaUpDateDay");
			LocalDate date = null;
			if(sqlDate != null) {
				date = sqlDate.toLocalDate();
			}
			return new User(
					(String)resultMap.get("userNum"),
					(String)resultMap.get("userName"),
					(String)resultMap.get("telNum"),
					(String)resultMap.get("add1"),
					(String)resultMap.get("add2"),
					(int)resultMap.get("penaDay"),
					date
					);
		}catch(IncorrectResultSizeDataAccessException e) {
			return null;
		}
	}
	
	//引数で受け取った値で利用者マスタに登録処理を行います。
	@Transactional(rollbackFor = Exception.class)
	public void insert(User user) {
		String userNum = user.getUserNum();
		String userName = user.getUserName();
		String telNum = user.getTelNum();
		String add1 = user.getAdd1();
		String add2 = user.getAdd2();

		String query = "insert into user(userNum,userName,telNum,add1,add2) values (?,?,?,?,?)";
		jdbc.update(query, userNum, userName, telNum, add1, add2);
	}

	//Userオブジェクト内に値のあるものだけ更新します。
	//userNumは変更不可のため更新は行いません。
	@Transactional(rollbackFor = Exception.class)
	public void update(User user) {
		String userNum = user.getUserNum();
		String userName = user.getUserName();
		String telNum = user.getTelNum();
		String add1 = user.getAdd1();
		String add2 = user.getAdd2();
		int penaDay = user.getPenaDay();
		LocalDate penaUpdateDay = user.getPenaUpdateDay();
		//namedJdbc用のmapを作成します
		Map<String,String> userMap = new HashMap<String,String>();
		userMap.put("userNum", userNum);
		
		String embeddedQuery = "";
		
		//氏名の処理
		if (!userName.isBlank()) {
			embeddedQuery += "userName = :userName ";
			userMap.put("userName", userName);
		}
		
		//電話番号の処理
		if (!telNum.isBlank()) {
			if (!embeddedQuery.isBlank()) {
				embeddedQuery += ",";
			}
			embeddedQuery += "telNum = :telNum ";
			userMap.put("telNum", telNum);
		}
		
		//住所1の処理
		if (!add1.isBlank()) {
			if (!embeddedQuery.isBlank()) {
				embeddedQuery += ",";
			}
			embeddedQuery += "add1 = :add1 ";
			userMap.put("add1", add1);
		}
		
		//住所2の処理
		if (!add2.isBlank()) {
			if (!embeddedQuery.isBlank()) {
				embeddedQuery += ",";
			}
			embeddedQuery += "add2 = :add2 ";
			userMap.put("add2", add2);
		}
		
		//ペナルティ日数の処理
		if (penaDay >= 0) {
			if (!embeddedQuery.isBlank()) {
				embeddedQuery += ",";
			}
			embeddedQuery += "penaDay = :penaDay ";
			userMap.put("penaDay", String.valueOf(penaDay));
		}
		
		//ペナルティ日数最終更新日付の処理
		if (penaUpdateDay != null) {
			if (!embeddedQuery.isBlank()) {
				embeddedQuery += ",";
			}
			embeddedQuery += "penaUpdateDay = :penaUpdateDay ";
			userMap.put("penaUpdateDay", penaUpdateDay.toString());
		}

		String query = "update user set " + embeddedQuery + " where userNum = :userNum";
		namedJdbc.update(query, userMap);
	}

	//指定された図書カード番号に該当する利用者情報を削除します。
	@Transactional(rollbackFor = Exception.class)
	public void delete(String userNum) {
		String query = "delete "
				+ "from user "
				+ "where userNum = ?";
		jdbc.update(query, userNum);
	}
}
