package com.example.demo.Model.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Model.DAO.RentAdminDAO;
import com.example.demo.Model.DAO.UserDAO;
import com.example.demo.Objects.RentAdminObj;
import com.example.demo.Objects.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReturnExtensionService {
	private final UserDAO userDao;
	private final RentAdminDAO rentAdminDao;

	//延長一回当たりの延長日数です。
	private int extensionDaysOnce = 7;

	//利用者マスタから図書カード番号に該当する利用者情報を取得。
	//ペナルティ日数の更新も同時に行います。
	public User getUserDatas(String userNum) {
		User user = userDao.selectByUserNum(userNum);
		if (user == null) {
			return new User();
		}
		//取得したペナルティ日数と最終更新日と今日の日付を取得。
		int penaDay = user.getPenaDay();
		LocalDate penaUpdateDay = user.getPenaUpdateDay();
		LocalDate today = LocalDate.now();

		//⓵経過日数の処理
		//ペナルティ日数が1日以上だった場合、前回のペナルティ日数の更新日からの経過日数をを取得し、
		//現在の日付け時点のペナルティ日数を算出する。なお、0日以下であった場合は0日とする。
		if (penaDay >= 1) {
			int pastDays = (int) ChronoUnit.DAYS.between(penaUpdateDay, today);
			penaDay -= pastDays;
			if (penaDay <= 0) {
				penaDay = 0;
			}
		}
		//➁現在の延滞日数の反映
		//現在の延滞日数の内最も長い日数を取得
		int longestArrearsDay = 0;
		//現在貸出中の書籍を全て取得
		List<RentAdminObj> rentingBooksList = rentAdminDao.selectByUserNum(userNum);
		for (RentAdminObj o : rentingBooksList) {
			//延滞日数を算出します
			int arrearsDay = (int) ChronoUnit.DAYS.between(o.getReturnDate(), today);
			//現在の延滞日数の最長日数を算出します
			if (arrearsDay > longestArrearsDay) {
				longestArrearsDay = arrearsDay;
			}
		}
		//最長延滞日数がペナルティ日数を超えていた場合更新します
		if (longestArrearsDay > penaDay) {
			penaDay = longestArrearsDay;
		}

		//ペナルティ日数の更新返却を行います
		user.setPenaDay(penaDay);
		user.setPenaUpdateDay(today);
		userDao.update(user);
		return user;
	}

	//図書カード番号から利用者の現在貸出中の書籍を返却します。
	public List<RentAdminObj> getUserRentingBooks(String userNum) {
		return rentAdminDao.selectByUserNum(userNum);
	}
	
	//書籍番号と枝番から貸出中の書籍情報を返却します。
	public RentAdminObj getRentingBook(String bookNum,String bookBranchNum){
		return rentAdminDao.selectByBookNumAndBranchNum(bookNum, bookBranchNum);
	}

	//書籍がまだ貸出管理テーブルに存在するか確認し、存在すれば返却処理を行います。
	//返却処理が行われた場合trueを、行われなかった場合falseを返却します。
	@Transactional
	public boolean checkIsBookAndReturn(String bookNum, String bookBranchNum) {
		RentAdminObj rentAdminObj = rentAdminDao.selectByBookNumAndBranchNum(bookNum, bookBranchNum);
		if (rentAdminObj == null) {
			return false;
		}
		rentAdminDao.delete(bookNum, bookBranchNum);
		return true;
	}

	//書籍がまだ貸出管理テーブルに存在するか確認し、存在すれば延長処理を行います。
	//延長処理が行われた場合trueを、行われなかった場合falseを返却します。
	@Transactional
	public boolean checkIsBookAndExtension(String bookNum, String bookBranchNum) {
		RentAdminObj rentAdminObj = rentAdminDao.selectByBookNumAndBranchNum(bookNum, bookBranchNum);
		//既に貸出管理マスタに存在しなければfalseを返却
		if (rentAdminObj == null) {
			return false;
		}
		//現在の返却期限に7日足した日数を新しい返却期限として登録します。
		rentAdminObj.setReturnDate(rentAdminObj.getReturnDate().plusDays(this.extensionDaysOnce));
		rentAdminDao.update(rentAdminObj);
		return true;
	}
}
