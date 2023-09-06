package com.example.demo.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Service.UserEditService;
import com.example.demo.Objects.JsonRequestObject;
import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserEditController {
	private final UserEditService userEditService;
	
	//指定された利用者情報の更新を行います。
	@RequestMapping("/updateUser")
	public void updateUser(@RequestBody User user) {
		userEditService.updateUser(user);
	}
	
	//指定された図書カード番号から利用者情報の削除を行います。
	@RequestMapping("/deleteUser")
	public void deleteUser(@RequestBody JsonRequestObject obj) {
		userEditService.deleteUser(obj.getUserNum());
	}
}
