package com.example.demo.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Service.UserRegisterService;
import com.example.demo.Objects.JsonRequestObject;
import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserRegisterController {
	private final UserRegisterService userRegisterService;

	//利用者情報の登録を行い、生成された図書カード番号を返却します。
	@RequestMapping("/registerUser")
	public String registerUser(@RequestBody JsonRequestObject obj) throws Exception {
		User user = new User();
		user.setUserName(obj.getUserName());
		user.setTelNum(obj.getTelNum());
		user.setAdd1(obj.getAdd1());
		user.setAdd2(obj.getAdd2());
		return userRegisterService.registerUser(user);
	}
}
