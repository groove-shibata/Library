$(function() {
	//登録ボタンの初期状態を非活性にします。
	buttonDisableControl('.registerButton', true);
	//それぞれの要素を取得します。
	var userName = $('#userName');
	var telNum = $('#telNum');
	var postCode = $('#postCode');
	var add1 = $('#add1');
	var add2 = $('#add2');

	//利用者名の入力チェック
	userName.on('change blur', (e) => {
		var isInputCorrect = regexTest(getRegex('userName'), $(e.target).val());
		elementPropsControlRespondingToInput(
			'#userName',
			'.registerButton',
			'.nameRgxError',
			getError('USER_NAME_REGEX_ERR'),
			isInputCorrect
		);
	});
	//電話番号の入力チェック
	telNum.on('change blur', (e) => {
		var isInputCorrect = regexTest(getRegex('telNum'), $(e.target).val())
		elementPropsControlRespondingToInput(
			'#telNum',
			'.registerButton',
			'.telNumRgxError',
			getError('TEL_NUM_REGEX_ERR'),
			isInputCorrect
		);
	});
	//郵便番号の入力チェック
	postCode.on('change blur', (e) => {
		var isInputCorrect = regexTest(getRegex('postCode'), $(e.target).val());
		if (add1.val() != '') add1.css('opacity', 1);
		if (postCode.val() == '') add1.val('');
		elementPropsControlRespondingToInput(
			'#postCode',
			'.registerButton',
			'.postCodeRgxError',
			getError('POST_CODE_REGEX_ERR'),
			isInputCorrect
		);
	});
	//住所1の入力チェック
	//当項目のみ外部APIに入力を依存しているため外部APIのイベントハンドラと一致させるためにこのような形になっています。
	postCode.on('keyup', (e) => {
		var isInputCorrect = regexTest(getRegex('address'), $(e.target).val());
		buttonDisableControl('.registerButton', isInputCorrect);
	});
	//住所2の入力チェック
	add2.on('change blur', (e) => {
		var isInputCorrect = regexTest(getRegex('address'), $(e.target).val());
		elementPropsControlRespondingToInput(
			'#add2',
			'.registerButton',
			'.add2RgxError',
			getError('ADD2_REGEX_ERR'),
			isInputCorrect
		);
	});

});