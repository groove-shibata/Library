$(async function() {
	if (window.performance.navigation.type == 2) {
		//遷移後に動かす処理
		alert(`ブラウザバックが検知されました。	画面を遷移します。`);
		gotoward('users_Terminal');
	}
	//変更・削除画面用の画面調整
	$('.title h1').text('利用者情報 変更・削除');
	$('.title').after('<h3>変更する項目に値を入力してください。</h3>');
	$('.registerButton').text('更新');

	//それぞれの要素を取得します。
	var userName = $('#userName');
	var telNum = $('#telNum');
	var add1 = $('#add1');
	var add2 = $('#add2');

	//前画面から受け渡された図書カード番号を取得
	var userNum = $('#userNum');

	//図書カード番号から利用者情報を取得
	try {
		var userDatas = await getUserDatas(userNum.val());

		//取得した利用者情報を各テキストボックスのplaceholderに設定します。
		userName.prop('placeholder', userDatas.userName);
		telNum.prop('placeholder', userDatas.telNum);
		add1.prop('placeholder', userDatas.add1);
		add2.prop('placeholder', userDatas.add2);
	} catch {
		modalOpen();
		setModalUnexpectedErr();
	}



	//登録内容変更機能部分↓

	//それぞれの項目の入力チェックはusersCommon.jsで実行しています。

	//お名前・電話番号・住所1と住所2(住所は両方必須)のいずれかが入力されている場合に更新ボタンを押下可能にします。
	(new MutationObserver(() => {
		buttonDisableControl(
			'.registerButton',
			!(
				regexTest(getRegex('userName'), userName.val()) ||
				regexTest(getRegex('telNum'), telNum.val()) ||
				(add1.val() != '' && add2.val() != '')
			)
		);
	})).observe(document.getElementById('registerButton'), { attributes: true })


	var updateButton = $('.registerButton');

	//更新ボタンが押下されたら画面上の入力項目を確認モーダルに表示します。
	updateButton.on('click', () => {
		var embeddedComp = $('<div>');
		if (userName.val() != '') embeddedComp.append(`<div>お名前　：　${userName.val()}</div>`);
		if (telNum.val() != '') embeddedComp.append(`<div>電話番号　：　${telNum.val()}</div>`);
		if (add1.val() != '') embeddedComp.append(`<div>住所1　：　${add1.val()}</div>`);
		if (add2.val() != '') embeddedComp.append(`<div>住所2　：　${add2.val()}</div>`);

		modalOpen();
		setModalTitle('以下の内容で更新します。');
		setModalContent(embeddedComp);
		addModalButton('更新', 'modalUpdateButton');
	});

	//確認モーダルで更新ボタンが押下されたらuserオブジェクトを作成し、更新処理を行います。
	$(document).on('click', '#modalUpdateButton', async () => {
		var user = {
			userNum: userNum.val(),
			userName: userName.val(),
			telNum: telNum.val(),
			add1: add1.val(),
			add2: add2.val()
		};

		updateUser(user)
			.then(() => {
				//確認モーダルを閉じてから更新完了モーダルを表示します。
				modalClose();
				modalOpen();
				removeModalBackButton();
				addModalButton('戻る', 'modalBackToUsersTeminalButton');
				setModalTitle('利用者情報変更');
				setModalContent(`正常に更新が完了しました。`);
			})
			.catch((err) => {
				console.log(err);
				modalOpen();
				setModalUnexpectedErr();
			});
	});



	//変更内容削除部分↓
	var deleteButton = $('#deleteButton');
	//削除ボタンが押されたら削除確認モーダルを表示します。
	deleteButton.on('click', () => {
		modalOpen();
		setModalTitle('登録情報削除');
		setModalContent('本当に削除してよろしいですか？');
		addModalButton('削除', 'modalDeleteButton');
	});

	//削除確認モーダルで削除ボタンが押されたら登録情報の削除処理を実行し完了画面を表示しします。
	$(document).on('click', '#modalDeleteButton', async () => {
		var userRentingBooks = await getUserRentingBooks(userNum.val());
		if (userRentingBooks.length > 0) {
			modalClose();
			modalOpen();
			setModalTitle('エラー');
			setModalTitleColor('red');
			setModalContent(`
				貸出中の書籍があります。
				返却してから再度実行してください。
			`);
		} else {
			deleteUser(userNum.val())
				.then(() => {
					modalClose();
					modalOpen();
					setModalTitle('登録情報削除');
					setModalContent('正常に削除が完了しました。');
					removeModalBackButton();
					addModalButton('戻る', 'modalBackToUsersTeminalButton');
				})
				.catch((err) => {
					console.log(err);
					modalOpen();
					setModalUnexpectedErr();
				});
		}
	});


	//更新もしくは削除完了モーダルで戻るボタンが押下されたらusersのターミナル画面へ戻ります。
	$(document).on('click', '#modalBackToUsersTeminalButton', () => {
		gotoward('users_Terminal');
	});
});