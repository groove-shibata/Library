package com.example.demo.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Service.ReturnExtensionService;
import com.example.demo.Objects.JsonRequestObject;
import com.example.demo.Objects.RentAdminObj;
import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReturnExtensionController {
	private final ReturnExtensionService returnExtensionService;

	//指定された図書カード番号から該当する利用者情報を返却します。
	//該当する書籍が存在しなかった場合はuserNun = nullのUserオブジェクトを返却します。
	@RequestMapping("/getUserDatas")
	public User getUserDatas(@RequestBody JsonRequestObject obj) {
		return returnExtensionService.getUserDatas(obj.getUserNum());
	}

	//指定された図書カード番号に紐づく貸出中書籍を返却します。
	@RequestMapping("/getUserRentingBooks")
	public List<RentAdminObj> getUserRentingBooks(@RequestBody JsonRequestObject obj) {
		return returnExtensionService.getUserRentingBooks(obj.getUserNum());
	}
	
	//指定された書籍番号と枝番から貸出中書籍情報を返却します。
	@RequestMapping("/getRentingBook")
	public RentAdminObj getRentingBook(@RequestBody JsonRequestObject obj) {
		return returnExtensionService.getRentingBook(obj.getBookNum(), obj.getBookBranchNum());
	}

	//指定された書籍番号-枝番に該当する書籍が貸出管理テーブルに存在するか確認し、返却処理の実行有無を返却します。
	@RequestMapping("/checkIsBookAndReturn")
	public boolean checkIsBookAndReturn(@RequestBody JsonRequestObject obj) {
		return returnExtensionService.checkIsBookAndReturn(obj.getBookNum(), obj.getBookBranchNum());
	}

	//指定された書籍番号-枝番に該当する書籍が貸出管理テーブルに存在するか確認し、延長処理の実行有無を返却します。
	@RequestMapping("/checkIsBookAndExtension")
	public boolean checkIsBookAndExtension(@RequestBody JsonRequestObject obj) {
		return returnExtensionService.checkIsBookAndExtension(
				obj.getBookNum(),
				obj.getBookBranchNum()
				);
	}
}
