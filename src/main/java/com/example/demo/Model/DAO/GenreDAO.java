package com.example.demo.Model.DAO;

import java.util.List;
import java.util.Map;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.Objects.Genre;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class GenreDAO {
	private final JdbcTemplate jdbc;

	//登録されているジャンルを全件返却します。
	public List<Genre> selectAll(){
		String query = "select * from genre";
		return jdbc.query(query,new BeanPropertyRowMapper<Genre>(Genre.class));
	}
	
	//指定されたジャンル番号に該当するレコードを返却します。
	public Genre selectByGenreNum(String genreNum) {
		String query = "select * from genre where genreNum = ?";
		try {
			Map<String, Object> map = jdbc.queryForMap(query,genreNum);
			return new Genre(
					(String) map.get("genreNum"),
					(String) map.get("genreName")
					);
		}catch(IncorrectResultSizeDataAccessException e) {
			return null;
		}
	}
}
