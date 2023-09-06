package com.example.demo.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Service.SearchService;
import com.example.demo.Objects.Genre;
import com.example.demo.Objects.JsonRequestObject;
import com.example.demo.Objects.SearchConditions;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SearchController {
	private final SearchService searchService;
	
	//ジャンル番号とジャンル名の全件を取得返却します。
	@RequestMapping("/getAllGenre")
	public List<Genre> getAllGenre(){
		return searchService.getAllGenre();
	}
	
	//ジャンル番号からジャンルを取得します。
	@RequestMapping("/getGenreByGenreNum")
	public Genre getGenreByGenreNum(@RequestBody JsonRequestObject obj){
		return searchService.getGenreByGenreNum(obj.getGenreNum());
	}
	
	//検索条件に応じた検索結果の取得返却を行います。
	@RequestMapping("/search")
	public List<Map<String,Object>> search(@RequestBody SearchConditions conditions){
		return searchService.search(conditions);
	}

	//検索条件と前回検索結果の最終レコードの書籍情報からそれ以降検索結果を返却します。
	@RequestMapping("/searchMore")
	public List<Map<String,Object>> searchMore(
			@RequestBody JsonRequestObject obj
			){
		Map<String,String> previousRecord = new HashMap<String,String>();
		previousRecord.put("previousBookName", obj.getPreviousBookName());
		previousRecord.put("previousAuthorName", obj.getPreviousAuthorName());
		previousRecord.put("previousBookNum", obj.getPreviousBookNum());
		return searchService.searchMore(obj.getSearchConditions(),previousRecord);
	}
}
