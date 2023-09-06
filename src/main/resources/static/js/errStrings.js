//エラー文を管理するファイルです。

const errorMessages = {
	//入力エラー系
	//図書カード番号入力エラー
	USER_NUM_REGEX_ERR : '図書カード番号は半角数字8桁で入力してください。',
	
	//利用者名
	USER_NAME_REGEX_ERR : '全角ひらがな・カタカナ・漢字もしくは半角英字の64文字以内で入力してください。',
	
	//電話番号
	TEL_NUM_REGEX_ERR : '半角数字10～11桁で入力してください。',
	
	//郵便番号
	POST_CODE_REGEX_ERR : '半角数字7桁で入力してください。',
	
	//住所2
	ADD2_REGEX_ERR : '特殊記号を用いない64文字以内で入力して下さい。',
	
	//書籍番号
	BOOK_NUM_REGEX_ERR : '書籍番号が不正な値です。半角数字5桁で入力してください。',
	
	//書籍番号枝番
	BOOK_BRANCH_NUM_REGEX_ERR : '書籍番号の枝番号が不正な値です。半角数字3桁で入力して下さい。',
	
	//書籍番号
	BOOK_NAME_REGEX_ERR : '規程の入力ではありません。記号を除いた64文字以内で入力してください。',
	
	//書籍番号枝番
	AUTHOR_NAME_REGEX_ERR : '規程の入力ではありません。記号を除いた64文字以内で入力してください。',

	
	//処理エラー系
	//ログインエラー
	LOGIN_ERR : '入力された図書カード番号は登録されていません。',
	
	
	//返却・延長
	//ペナルティ期間メッセージ
	DURING_PENALTY_ERR : 'ペナルティ期間中です。新規貸出・延長はできません。',
	
	//延長回数が上限メッセージ
	REACH_TO_EXTENSION_COUNT_LIMIT_ERR : '延長回数が上限に達している書籍が選択されています。',
	
	
	//貸出
	//追加書籍が既に貸出済みのメッセージ
	INVALID_BOOK_ADDED_ERR : '入力された書籍番号が間違っています。書籍が存在しません。',
	
	//既に追加済みの書籍が追加された時のメッセージ
	ADD_TWICE_ERR : '既に追加された書籍です。',
	
	//追加書籍が上限に達した時のメッセージ
	ADDED_BOOKS_REACH_LIMIT_ERR : '貸出書籍上限に達しました。これ以上は書籍を追加できません。',
	
	//ユーザー情報が既に存在しない場合
	INVALID_USER_ACCESS_ERR : '利用者登録情報が存在しません。',
	
	
	//検索
	//該当書籍が存在しないエラー
	NO_SEARCH_RESULT_FOUND : '該当する書籍が見つかりませんでした。',
	
	//追加検索時の該当書籍が存在しないエラー
	NO_MORE_SEARCH_RESULT_FOUND : '検索結果は以上です。',
	
	//例外エラー
	//予期せぬエラー
	UNEXPECTED_ERR : '予期せぬエラーが発生しました'
};



//指定されたエラーメッセージを返却します。
function getError(errorCode){
	var errMes = errorMessages[errorCode] || '未知のエラーが発生しました。';
	return errMes;
};