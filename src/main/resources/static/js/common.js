$(function() {
	//ヘッダー部分の画面遷移
	$('.headerLogo').on('click', () => {
		gotoward('TotalTerminal');
	});
	$('.users-link').on('click', () => {
		gotoward('users_Terminal');
	});
	$('.search-link').on('click', () => {
		gotoward('search');
	});
	$('.rent-link').on('click', () => {
		setAfterLoginDestination('return-extension');
		gotoward('login');
	});
});


//画面遷移時に使用する関数です。
//引数に指定した画面先に遷移します。
//画面上にはid="destination"のhidden項目を用意してください。
function gotoward(destination) {
	console.log(destination);
	document.getElementById("destination").value = destination;
	document.form.action = "gotoward";
	document.form.submit();
}


//モーダル部分


//エラー画面や結果画面等に使用するmodalを表示します。
function modalOpen() {
	$('body').append(`
		<div class="subBody">
	        <div class="subWindow">
	            <div class="subWindowContent">
	                <div class="subWindowTitle">
	                    <h1></h1>
	                </div>
	                <div class="subWindowMainContent">
	                </div>
	                <div class="subWindowButtons">
	                    <button class="subWindowBackButton" onclick="modalClose()">戻る</button>
	                </div>
	            </div>
	        </div>
	    </div>
	`);
	var subBody = $('.subBody');
	subBody.css('display', 'flex');
}

//modalを削除します。
function modalClose() {
	var subBody = $('.subBody');
	subBody.css('display', 'none');
	subBody.remove();
}

//modalのタイトルを設定します。
function setModalTitle(title) {
	var modalTitle = $('.subWindowTitle h1');
	modalTitle.text(title);
}

//modalのタイトルの色を設定します。
function setModalTitleColor(color) {
	var modalTitle = $('.subWindowTitle h1');
	modalTitle.css('color', color);
}

//modalの内容を設定します。
function setModalContent(html) {
	var modalMainContent = $('.subWindowMainContent');
	modalMainContent.append(html);
}

//modal下部に戻るボタン(modal削除ボタン)を削除します。
function removeModalBackButton(){
	var modalBackButton = $('.subWindowBackButton');
	modalBackButton.remove();
}

//modal下部にボタンを追加します。
function addModalButton(buttonValue, buttonIdAttr) {
	var modalButtonArea = $('.subWindowButtons');
	modalButtonArea.prepend(
		$('<button>')
			.prop('id', buttonIdAttr)
			.text(buttonValue)
	);
}

//予期せぬエラーの場合のモーダルを一括でセットします。
function setModalUnexpectedErr(){
	setModalTitle('エラー');
	setModalTitleColor('red');
	setModalContent(
		`
		<div style="color:red">
			${getError('UNEXPECTED_ERR')}
		</div>
		`
	);
}




//入力チェック
function regexTest(regex, testedValue) {
	var re = new RegExp(regex);
	return re.test(testedValue);
}


//要素の状態変更部分

//入力に応じた要素の全てのコントロール
function elementPropsControlRespondingToInput(textBoxAttr,btnAttr,errPlcAttr,errStr,isInputCorrect){
	colorTextBox(textBoxAttr,isInputCorrect);
	buttonDisableControl(btnAttr,!isInputCorrect);
	errorStringControl(errPlcAttr,errStr,isInputCorrect);
}



//属性で指定したテキストボックスを第二引数の真偽値に応じて色の変更を行います。
//true→デフォルト色
function colorTextBox(textBoxAttr, isInputCorrect) {
	var textBox = $(textBoxAttr);
	if (isInputCorrect) {
		textBox.css({
			'color': 'black',
			'background-color': 'white'
		});
	} else {
		textBox.css({
			'color': 'red',
			'background-color': '#ffc8c8'
		});
	}
}


//指定した属性に対応するボタンを非活性状態にします。
//第一引数にボタンの属性、第二引数にはボタンの活性状態を真偽値(true→非活性化)で指定してください。
function buttonDisableControl(buttonAttr, buttonDisabledProp) {
	var button = $(buttonAttr);
	if (buttonDisabledProp) {
		button
			.prop('disable', true)
			.css({
				'opacity': 0.5,
				'pointer-events': 'none'
			});
	} else {
		button
			.prop('disable', false)
			.css({
				'opacity': 1,
				'pointer-events': 'unset'
			});
	}
}

//第一引数：エラー文挿入箇所の属性、第二引数：エラー文、第三引数：真偽値
//真偽値がfalseであれば指定した箇所に指定したエラー文を挿入します。
//真偽値がtrueであればエラー文を削除します。
function errorStringControl(errPlcAttr, errStr, isInputCorrect) {
	var errStrPlc = $(errPlcAttr);
	if (isInputCorrect) {
		errStrPlc.text('');
	} else {
		errStrPlc.text(errStr);
	}
}






//ログイン画面前後のURL処理

//ログイン後の画面URLをセットします。
//ログイン画面に遷移する前の画面で使用します。
//画面内にはid="afterLoginDestination"のhidden項目を配置してください。
function setAfterLoginDestination(destination) {
	$('#afterLoginDestination').val(destination);
}

//前画面で指定されたログイン後の画面URLを取得します。
//ログイン画面で使用します。
//画面内にはid="afterLoginDestination"のhidden項目を配置してください。
function getAfterLoginDestination() {
	return $('#afterLoginDestination').val();
}




//日付けの計算を行います。
function daysBetween(beforeDate,afterDate){
	const beforeDateTimeStamp = beforeDate.getTime();
	const afterDateTimeStamp = afterDate.getTime();
	const timeDifference = afterDateTimeStamp - beforeDateTimeStamp;
	return timeDifference / (1000 * 60 * 60 * 24);
}