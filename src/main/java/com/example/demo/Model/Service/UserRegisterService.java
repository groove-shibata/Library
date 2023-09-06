package com.example.demo.Model.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Model.DAO.AutoIncrementDAO;
import com.example.demo.Model.DAO.UserDAO;
import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserRegisterService {
	private final UserDAO userDao;
	private final AutoIncrementDAO autoIncrementDao;

	//図書カード番号の頭に設定される当図書館の図書館番号です。
	private String LibraryNumber = "100";
	
	//生成する図書カード番号の利用者番号の長さです。
	private int userNumLength = 5;
	
	
	//図書カード番号を発行し引数で指定された情報とともに利用者マスタに登録し、生成された図書カード番号を返却します。
	@Transactional
	public String registerUser(User user) throws Exception {
		//図書カード番号の図書館番号以降の番号の生成規則を指定します。
		//0埋めN桁(フィールドで指定)の固定長です。
		String userNumLengthRule = "%0" + this.userNumLength + "d";
		
		//auto_incrementから最新に生成された番号を取得します。
		int autoIncrementedNum = autoIncrementDao.createNewNum();
		
		//生成された番号が指定された利用者番号桁数を超えていた場合処理を終了します。
		if(String.valueOf(autoIncrementedNum).length() > userNumLength) {
			throw new Exception("登録者数の上限超過");
		}
		
		//図書館番号と0埋めした利用者番号から図書カード番号を作成します。
		String userNum = this.LibraryNumber + String.format(userNumLengthRule, autoIncrementedNum);
		
		//利用者登録を行い図書カード番号を返却します。
		user.setUserNum(userNum);
		userDao.insert(user);
		return userNum;
	}
}