package com.example.demo.Model.DAO;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AutoIncrementDAO {
	private final JdbcTemplate jdbc;
	
	//auto_incrementのみを行うテーブルでauto_incrementを実行し
	//現在のauto_incrementされたカラムの最大値を返却します。
	@Transactional
	public int createNewNum() {
		String insertQuery = "insert into auto_incremental_num_for_user_num() values()";
		jdbc.update(insertQuery);
		String selectQuery = "select max(auto_increment) from auto_incremental_num_for_user_num";
		return jdbc.queryForObject(selectQuery,Integer.class);
	}
}
