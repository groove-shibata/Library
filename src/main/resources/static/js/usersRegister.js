$(function() {
	//登録画面用の画面調整
	$('.deleteButton').remove();
	$('.buttonsForEdit').css('justify-content', 'flex-end');


	//それぞれの要素を取得します。
	var userName = $('#userName');
	var telNum = $('#telNum');
	var postCode = $('#postCode');
	var add1 = $('#add1');
	var add2 = $('#add2');

	//各項目の入力チェックと要素の状態変更・エラー表示等はusersCommon.jsで行います。

	//登録ボタンの活性状態変更
	//observerで登録ボタンの活性状態変更を検知し、
	//全項目の入力内容が正しい場合に登録ボタンを活性状態に変更します。
	(new MutationObserver(() => {
		buttonDisableControl(
			'.registerButton',
			!(
				regexTest(getRegex('userName'), userName.val()) &&
				regexTest(getRegex('telNum'), telNum.val()) &&
				regexTest(getRegex('postCode'), postCode.val()) &&
				regexTest(getRegex('address'), add1.val()) &&
				regexTest(getRegex('address'), add2.val())
			)
		);
	})).observe(document.getElementById('registerButton'),{attributes:true});


	//登録ボタン押下時の処理
	//登録内容確認画面を表示します。
	$('.registerButton').on('click', () => {
		var embeddedComp = $('<div>');
		embeddedComp.append(`<div>お名前　：　${userName.val()}`);
		embeddedComp.append(`<div>電話番号　：　${telNum.val()}`);
		embeddedComp.append(`<div>住所1　：　${add1.val()}`);
		embeddedComp.append(`<div>住所2　：　${add2.val()}`);

		modalOpen();
		setModalTitle('以下の内容で登録します。');
		setModalContent(embeddedComp);
		addModalButton('登録', 'modalRegisterButton');
	});
	
	//登録内容確認画面の登録ボタンを押下したら登録処理を行います。
	$(document).on('click','#modalRegisterButton' ,async () => {
		try {
			//利用者の登録処理を行い、発行された図書カード番号を取得
			const userNum = await registerUser(userName.val(), telNum.val(), add1.val(), add2.val());
			//modalを開き取得した図書カード番号を表示します。
			modalOpen();
			removeModalBackButton();
			addModalButton('確認', 'modalConfirmButton');
			setModalTitle('利用者登録');
			setModalContent(`
				<div class="cont">
					<div>登録が完了しました。</div>
					<div>図書カード番号 : ${userNum}</div>
				</div>
			`);
			var cont = $('.cont');
			cont.css({
				'width': '90%',
				'height': '80%',
				'display': 'flex',
				'flex-direction': 'column',
				'justify-content': 'space-between'
			});
		} catch {
			//エラーが生じた場合はエラーモーダルを表示します。
			modalOpen();
			setModalUnexpectedErr();
		}
	});

	//成功時のモーダルの確認ボタンを押下時に初期ターミナル画面へ戻ります
	$(document).on('click', '#modalConfirmButton', () => {
		gotoward('TotalTerminal');
	});
});