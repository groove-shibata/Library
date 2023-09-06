//指定した図書カード番号に応じた利用者情報を取得します。
//取得したオブジェクトには以下の情報が含まれます。
//userName:利用者名,telNum:電話番号,add1:大字区分までの住所,
//add2:大字区分以降の住所,penaDay:ペナルティ日数,penaUpdateDay:ペナルティ日数最終更新日付
function getUserDatas(userNum) {
	var json = {
		userNum: userNum
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/getUserDatas',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((userDatas) => {
			resolve(userDatas);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//指定した書籍番号-枝番に応じた書籍情報を取得します。
//番号に該当する書籍が存在しなかった場合は書籍番号(bookNum)がnullのオブジェクトが返却されます。
function isBookAndGetThatDatas(bookNum, bookBranchNum) {
	var json = {
		bookNum: bookNum,
		bookBranchNum: bookBranchNum
	}
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/isBookAndGetThatDatas',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((userDatas) => {
			resolve(userDatas);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//rentBooksは貸し出し処理を行いたい書籍を以下の形式で指定してください
//	[
//		{
//			bookNum : '',
//			bookBranchNum : ''
//		},
//		...
//	]
//返却値はオブジェクトです。オブジェクトには以下の情報が含まれます。
//succeededBooksList、failedBooksList
//またこれらのリストの内部はBookオブジェクトが格納されており以下の情報が含まれます。
//bookName:書籍名、bookNum:書籍番号、bookBranchNum:書籍番号枝番、・・・
function checkDatasAndRentBooks(userNum, rentBooks) {
	var json = {
		userNum: userNum,
		rentBooks: rentBooks
	}
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/checkDatasAndRentBooks',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((resultMap) => {
			resolve(resultMap);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//利用者の登録処理を行います。
//引数には利用者名・電話番号・大字区分までの住所・それ以降の住所を指定してください。
//生成された図書カード番号が返却されます。
function registerUser(userName, telNum, add1, add2) {
	var json = {
		userName: userName,
		telNum: telNum,
		add1: add1,
		add2: add2
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/registerUser',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((userNum) => {
			resolve(userNum);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//利用者情報の更新を行います。
//引数には変更する利用者の図書カード番号と
//変更したい情報のみ値を設定した以下のUserオブジェクトを指定してください。
//{
//	userNum : '(任意の図書カード番号)'(必須),
//	userName : '(任意の利用者名)',
//	telNum : '(任意の電話番号)',
//	add1 : '(任意の大字区分までの住所)',
//	add2 : '(任意の大字区分以降の住所)'
//}
function updateUser(user) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/updateUser',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(user)
		}).done(() => {
			resolve();
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//引数に指定した図書カード番号に該当する利用者情報を削除します。
function deleteUser(userNum) {
	var json = {
		userNum: userNum
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/deleteUser',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(json)
		}).done(() => {
			resolve();
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//引数で指定した図書カード番号と紐づいた貸出中書籍を取得します。
//返却値はリスト形式で返却され1項目ごとに以下の値を含みます。
//bookName:書籍名,bookNum:書籍番号,bookBranchNum:書籍番号枝番,
//returnDate:返却期限,extensionCount:延長回数
function getUserRentingBooks(userNum) {
	var json = {
		userNum: userNum,
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/getUserRentingBooks',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((userRentingBooks) => {
			resolve(userRentingBooks);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//引数で指定した書籍番号と枝番から貸出中書籍の貸出管理情報を返却します。
//オブジェクト内には userNum:図書カード番号、bookNum:書籍番号、bookBranchNum:書籍番号枝番
//returnDate:返却日、extensionCount:延長回数が含まれます。
function getRentingBook(bookNum, bookBranchNum) {
	var json = {
		bookNum: bookNum,
		bookBranchNum: bookBranchNum
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/getRentingBook',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((rentingBook) => {
			resolve(rentingBook);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//引数で指定した書籍番号-枝番に該当する書籍が貸出管理テーブルに存在するか確認し、
//存在した場合返却処理を行います。処理の結果に応じた真偽値を取得します(返却処理完了→true)。
function checkIsBookAndReturn(bookNum, bookBranchNum) {
	var json = {
		bookNum: bookNum,
		bookBranchNum: bookBranchNum
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/checkIsBookAndReturn',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((isSucceeded) => {
			resolve(isSucceeded);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//引数で指定した書籍番号-枝番に該当する書籍が貸出管理テーブルに存在するか確認し、
//存在した場合延長処理を行います。処理の結果に応じた真偽値を取得します(延長処理完了→true)。
function checkIsBookAndExtension(bookNum, bookBranchNum) {
	var json = {
		bookNum: bookNum,
		bookBranchNum: bookBranchNum
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/checkIsBookAndExtension',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((isSucceeded) => {
			resolve(isSucceeded);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//ジャンルマスタ上に登録されているジャンル番号(genreNum)とジャンル名(genreName)をリスト形式で全て取得します。
function getAllGenre() {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/getAllGenre',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		}).done((allGenre) => {
			resolve(allGenre);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//ジャンル番号から特定のジャンル番号(genreNum)とジャンル名(genreName)をリスト形式で全て取得します。
function getGenreByGenreNum(genreNum) {
	var json = {
		genreNum : genreNum
	}
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/getGenreByGenreNum',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify(json)
		}).done((genre) => {
			resolve(genre);
		}).fail((err) => {
			console.error(err);
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//検索条件に応じた検索を行います。
//検索条件は以下の形で指定してください
//{
//	bookName : '(任意の値)',
//	authorName : '(任意の値)',
//	genreNum : '(ジャンル番号の内任意の値)',
//	bookNameSort : (0→昇順、もしくは1→降順),
//	authorNameSort : (0→昇順、もしくは1→降順),
//	prioriSort : (0→書籍名優先、もしくは1→著者名優先)
//}
//返却値はリスト形式で返却され、1項目当たり以下の値を含みます。
//bookNum:書籍番号,bookName:書籍名,authorName:著者名,
//genreName:ジャンル名,bookPlace:蔵書場所,availableBookCount:現在貸出可能な件数
function search(searchConditions) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/search',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(searchConditions)
		}).done((searchResult) => {
			resolve(searchResult);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}

//previousの引数に指定したレコード以降の検索結果を取得します。
//具体的には取得済みの検索結果の最終レコードの書籍名・著者名・書籍番号をそれぞれ指定してください。
//返却値は上記のsearch関数と同様です。
function searchMore(searchConditions, previousBookName, previousAuthorName, previousBookNum) {
	var json = {
		searchConditions: searchConditions,
		previousBookName: previousBookName,
		previousAuthorName: previousAuthorName,
		previousBookNum: previousBookNum
	}
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: '/searchMore',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(json)
		}).done((searchResult) => {
			resolve(searchResult);
		}).fail(() => {
			reject(new Error('予期せぬエラーが発生しました。'));
		});
	});
}