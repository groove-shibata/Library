package com.example.demo.Model.Service;

import org.springframework.stereotype.Service;

import com.example.demo.Model.DAO.UserDAO;
import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserEditService {
	private final UserDAO userDao;
	
	
	//Userオブジェクトにsetした値のみ更新します。
	public void updateUser(User user) {
		userDao.update(user);
	}

	//指定された図書カード番号に該当する利用者情報を削除します。
	public void deleteUser(String userNum) {
		userDao.delete(userNum);
	}
}
