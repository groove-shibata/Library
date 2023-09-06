package com.example.demo.Model.DAO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.Objects.SearchConditions;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SearchDAO {
	private final NamedParameterJdbcTemplate namedJdbc;
	
	//共通するselect句を指定します。
	private String select =
					"select "
					+ "a.bookNum,b.bookName,b.authorName,c.genreName, b.bookPlace, "
					+ "(case when d.currentRentCount "
					+ "is null then a.totalBookCount "
					+ "else a.totalBookCount -d.currentRentCount "
					+ "end) availableBookCount ";
	//共通するfrom句を指定します。
	private String from =
					"from "
					+ "(select bookNum, count(bookNum) totalBookCount from book group by bookNum) a "
					+ "left join "
					+ "(select bookNum, bookName, authorName, genreNum, bookPlace from book) b on a.bookNum = b.bookNum "
					+ "left join "
					+ "(select genreNum, genreName from genre) c on b.genreNum = c.genreNum "
					+ "left join "
					+ "(select bookNum, count(bookNum) currentRentCount from rent_admin_table group by bookNum) d on a.bookNum = d.bookNum ";
	//limit句に適用される値を指定します。
	private String limit = "10";
	
	
	
	//指定された検索条件からクエリを構成し検索結果を返却します。
	public List<Map<String,Object>> search(SearchConditions conditions){
		Map<String,String> paramsMap = new HashMap<String,String>();
		//書籍名と著者名をあいまい検索にし、namedJdbc用のMapに梱包します。
		paramsMap.put("bookName", "%" + conditions.getBookName() + "%");
		paramsMap.put("authorName", "%" + conditions.getAuthorName() + "%");
		paramsMap.put("genreNum",conditions.getGenreNum());
		String query = 
				this.select
				+ this.from 
				+ whereStringProcess(conditions) 
				+ orderByStringProcess(conditions) 
				+ "limit " + this.limit;
		return namedJdbc.queryForList(query, paramsMap);
	}
	
	//検索条件に一致する検索結果の内、previousRecordに指定されたレコード以降の値を取得、返却します。
	public List<Map<String,Object>> searchMore(SearchConditions conditions,Map<String,String> previousRecord){
		//namedJdbc用のバインド変数を格納します。
		//また、書籍名(bookName)と著者名(authorName)はあいまい検索の値で格納します。
		Map<String,String> paramsMap = new HashMap<String,String>();
		paramsMap.put("bookName", "%" + conditions.getBookName() + "%");
		paramsMap.put("authorName", "%" + conditions.getAuthorName() + "%");
		paramsMap.put("genreNum", conditions.getGenreNum());
		paramsMap.put("previousBookName",previousRecord.get("previousBookName"));
		paramsMap.put("previousAuthorName",previousRecord.get("previousAuthorName"));
		paramsMap.put("previousBookNum", previousRecord.get("previousBookNum"));
		
		//通常のwhere句と追加検索上必要なwhere句の中継ぎを行う句を生成します。
		//通常のwhere句に値があった場合はandを、値がなかった場合はwhereを指定します。
		String and = "";
		if(!whereStringProcess(conditions).isBlank()) {
			and = " and ";
		}else {
			and = " where ";
		}
		
		String query = 
				this.select
				+ this.from
				+ whereStringProcess(conditions)
				+ and
				+ searchMoreStringProcess(conditions)
				+ orderByStringProcess(conditions)
				+ " limit " + this.limit;
		return namedJdbc.queryForList(query, paramsMap);
	}
	
	//検索条件からwhere句の生成をします。
	//検索内容に入力のあった項目の絞り込みを行います。
	//書籍名・著者名・ジャンルのいずれにも入力がなかった場合は空文字を返却します。
	private String whereStringProcess(SearchConditions conditions) {
		String bookName = conditions.getBookName();
		String authorName = conditions.getAuthorName();
		String genreNum = conditions.getGenreNum();
		
		String where = "";
		if(!StringUtils.isBlank(bookName) || !StringUtils.isBlank(authorName) || !StringUtils.isBlank(genreNum)) {
			where += "where ";
		}
		if(!StringUtils.isBlank(bookName)) {
			where += "bookName like :bookName ";
		}
		if(!StringUtils.isBlank(bookName) && !StringUtils.isBlank(authorName)) {
			where += "and ";
		}
		if(!StringUtils.isBlank(authorName)) {
			where += "authorName like :authorName ";
		}
		if((!StringUtils.isBlank(bookName) && !StringUtils.isBlank(genreNum)) || (!StringUtils.isBlank(authorName) && !StringUtils.isBlank(genreNum))){
			where += "and ";
		}
		if(!StringUtils.isBlank(genreNum)) {
			where+= "c.genreNum = :genreNum ";
		}
		return where;
	}
	
	//検索条件に応じたorder by句の生成をします。
	//書籍名と著者名の昇順降順と優先ソートに応じたソートの順列の構成をします。
	private String orderByStringProcess(SearchConditions conditions) {
		int bookNameSort = conditions.getBookNameSort();
		int authorNameSort = conditions.getAuthorNameSort();
		int prioriSort = conditions.getPrioriSort();
		
		String orderBy = "order by ";
		String bookNameSortQuery = "bookName ";
		String authorNameSortQuery = "authorName ";
		if(bookNameSort == 0) {
			bookNameSortQuery += "ASC, ";
		}else {
			bookNameSortQuery += "DESC, ";
		}
		if(authorNameSort == 0) {
			authorNameSortQuery += "ASC, ";
		}else {
			authorNameSortQuery += "DESC, ";
		}
		if(prioriSort == 0) {
			orderBy += bookNameSortQuery + authorNameSortQuery;
		}else {
			orderBy += authorNameSortQuery + bookNameSortQuery;
		}
		orderBy += "bookNum ASC ";
		return orderBy;
	}
	
	//searchMore関数用の追加のwhere句を検索条件から生成します。
	private String searchMoreStringProcess(SearchConditions conditions){
		int bookNameSort = conditions.getBookNameSort();
		int authorNameSort = conditions.getAuthorNameSort();
		int prioriSort = conditions.getPrioriSort();
		
		String mainFilterQuery = "";
		String subFilterQuery = "";
		String bookNameInequality = "";
		String authorNameInequality = "";
		
		//選択されたソート内容によってpreviousの値以降もしくは以前でフィルターを掛けるのかを指定します。
		if(bookNameSort == 0) {
			bookNameInequality = ">";
		}else {
			bookNameInequality = "<";
		}
		if(authorNameSort == 0) {
			authorNameInequality = ">";
		}else {
			authorNameInequality = "<";
		}
		
		//優先ソートの選択によってメインフィルターに書籍と著者のどちらを選択するのかを決定します。
		if(prioriSort == 0) {
			mainFilterQuery = "bookName " + bookNameInequality + " :previousBookName ";
		}else {
			mainFilterQuery = "authorName " + authorNameInequality + " :previousAuthorName ";
		}
		
		//メインフィルターだけで絞り切れなかった場合(具体的には書籍名/著者名に重複があった場合)に
		//優先ソートで選択されなかった値と書籍番号から、こぼれた値を選択します。
		subFilterQuery = "("
				+"bookName " + bookNameInequality + "= :previousBookName "
				+"and authorName " + authorNameInequality + "= :previousAuthorName "
				+"and a.bookNum > :previousBookNum "
				+")";

		return   " ( " + mainFilterQuery + " or " + subFilterQuery + " ) ";
	}
}