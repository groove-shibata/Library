package com.example.demo.Model.Service;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.DAO.GenreDAO;
import com.example.demo.Model.DAO.SearchDAO;
import com.example.demo.Objects.Genre;
import com.example.demo.Objects.SearchConditions;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SearchService {
	private final GenreDAO genreDao;
	private final SearchDAO searchDao;
	
	//登録されているジャンルを全件返却します。
	public List<Genre> getAllGenre(){
		return genreDao.selectAll();
	}
	
	//ジャンルコードから特定のジャンルを取得します
	public Genre getGenreByGenreNum(String genreNum) {
		return genreDao.selectByGenreNum(genreNum);
	}
	
	//検索条件に応じた検索結果を返却します。
	public List<Map<String,Object>> search(SearchConditions conditions){
		return searchDao.search(conditions);
	}
	
	//検索条件と前回検索結果の最終レコードの書籍名、著者名、書籍番号から、該当する検索結果の同レコード以降(以前)の検索結果を返却します。
	//previousRecordにはkey=previousBookName,previousAuthorName,previousBookNumのvalueを梱包してください。
	public List<Map<String,Object>> searchMore(SearchConditions conditions,Map<String, String> previousRecord){
		return searchDao.searchMore(conditions,previousRecord);
	}
}
