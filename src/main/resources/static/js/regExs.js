//正規表現を管理するファイルです。

const regexs = {
	//図書カード番号
	userNum: /^[0-9]{8}$/,
	//氏名
	userName: /^[ぁ-んァ-ヶー一-龯a-zA-Z\s]{1,64}$/,
	//電話番号
	telNum: /^[0-9]{10,11}$/,
	//郵便番号
	postCode: /^[0-9]{3}-?[0-9]{4}$/,
	//住所1・2
	address: /^[^\\\\ \\. \\* \\? \\| \s]{1,64}$/,
	//書籍番号
	bookNum: /^[0-9]{5}$/,
	//書籍番号枝番
	bookBranchNum: /^[0-9]{3}$/,
	//書籍名
	bookName: /^[^\\\\ \\. \\* \\? \\| \s]{0,64}$/,
	//著者名
	authorName: /^[^\\\\ \\. \\* \\? \\| \s]{0,64}$/,
};

//指定された正規表現を返却します。
function getRegex(regexCode) {
	return regexs[regexCode];
}





















