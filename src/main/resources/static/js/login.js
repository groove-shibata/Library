$(function(){
	var userNum = $('#userNum');
	
	//ログインボタンの非活性化を行います。
	buttonDisableControl('.loginButton',true);
	
	//図書カード番号に/から、変更/フォーカス移動が発生した際に
	//入力内容チェックとチェック結果に応じた表示内容変更を行います。
	userNum.on('change blur',()=>{
		var isInputCorrect = regexTest(getRegex('userNum'),userNum.val());
		buttonDisableControl('.loginButton',!isInputCorrect);
		colorTextBox('#userNum',isInputCorrect);
		errorStringControl('.userNumRgxError',getError('USER_NUM_REGEX_ERR'),isInputCorrect);
	});
	
	//ログインボタンの押下時に処理を行います。
	$('.loginButton').on('click',async ()=>{
		try{
			//入力された図書カード番号から利用者マスタを検索します。
			var userData = await getUserDatas(userNum.val());
			
			//該当する情報が存在すればログイン後画面へ遷移します。
			if(userData.userNum != null){
				gotoward(getAfterLoginDestination());
			}else{
				//該当する情報が存在しない場合はエラー画面を表示します。
				modalOpen();
				setModalTitle('エラー');
				setModalTitleColor('red');
				setModalContent(
					`
					<div style="color:red">
						${getError('LOGIN_ERR')}
					</div>
					`
				);
			}
		}catch{
			modalOpen();
			setModalUnexpectedErr();
		}
	});
});