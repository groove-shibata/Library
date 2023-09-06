package com.example.demo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Service.RentService;
import com.example.demo.Objects.Book;
import com.example.demo.Objects.JsonRequestObject;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RentController {
	private final RentService rentService;
	
	//指定された書籍番号と枝番から該当する書籍情報を返却します。
	@RequestMapping("/isBookAndGetThatDatas")
	public Book isBookAndGetThatDatas(@RequestBody JsonRequestObject obj) {
		String bookNum = obj.getBookNum();
		String bookBranchNum = obj.getBookBranchNum();
		return rentService.isBookAndGetThatDatas(bookNum, bookBranchNum);
	}
	
	//指定された図書カード番号・貸出を行う書籍のリストの書籍番号から貸出処理を実行します。
	//既に貸出が行われている書籍はエラー書籍としてリスト形式で返却されます。
	//リストのサイズが0の場合全て正常に貸出処理が完了しています。
	@RequestMapping("/checkDatasAndRentBooks")
	public Map<String,List<Book>> checkDatasAndRentBooks(@RequestBody JsonRequestObject obj){
		String userNum = obj.getUserNum();
		//マップの項目にはkey = bookNumとkey = bookBranchNumが存在してください
		List<Map<String,String>> rentBooks = obj.getRentBooks();
		return rentService.checkDatasAndRentBooks(userNum, rentBooks);
	}
}
