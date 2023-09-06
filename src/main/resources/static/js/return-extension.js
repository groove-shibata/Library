$(async function() {
	//延長回数の上限を設定します。
	var extensionCountLimit = 2;
	var rentBookLimit = 5;

	//前画面から受け渡された図書カード番号の取得
	var userNum = $('#userNum').val();

	//画面の初期状態の設定を行います。
	try {
		//利用者情報の取得
		//利用者情報
		var userDatas = await getUserDatas(userNum);
		//貸出中書籍
		var userRentingBooks = await getUserRentingBooks(userNum);

		//利用者情報の反映
		var userNumHolder = $('#userNumHolder'), userName = $('#userName'), penaDay = $('#penaDay');
		userNumHolder.text(userDatas.userNum);
		userName.text(userDatas.userName);
		penaDay.text(userDatas.penaDay);

		//利用者貸出中書籍の反映
		//selectボタン認識用のインデックス
		var index = 0;
		//延滞確認用の現在の日付を取得します
		var today = new Date();

		//貸出中の書籍がない場合はその旨を表示します。
		if (userRentingBooks.length === 0) {
			$('table').css('display', 'none');
			$('.rentingBooks')
				.css({
					'display': 'flex',
					'justify-content': 'center',
					'align-items': 'center'
				})
				.append('<div>貸出中の書籍はありません</div>');
		} else {
			//取得した貸出中書籍はリスト<オブジェクト>形式なので1項目ごとに貸出テーブルへの追加を行います。
			for (const userRentingBook of userRentingBooks) {
				//書籍名用の書籍情報を取得します。
				var bookDatas = await isBookAndGetThatDatas(userRentingBook.bookNum, userRentingBook.bookBranchNum);

				//「延滞」項目用の文字を定義します。
				//延滞をしていれば○、していなければ空文字を設定します。
				var arrearsFig = '';
				if (daysBetween(new Date(userRentingBook.returnDate), today) > 0) {
					arrearsFig = '○';
				}

				//テーブルへ行を挿入します
				var tableRow = $('<tr>')
					.addClass(`row${index}`)
					.attr('name', 'embeddedRow')
					.append($('<td>').addClass('bookName').text(bookDatas.bookName))
					.append($('<td>').addClass('bookNum').attr('id', `bookNum${index}`).text(userRentingBook.bookNum))
					.append($('<td>').addClass('bookBranchNum').attr('id', `bookBranchNum${index}`).text(userRentingBook.bookBranchNum))
					.append($('<td>').addClass('returnDate').attr('id', `returnDate${index}`).text(userRentingBook.returnDate))
					.append($('<td>').addClass('extensionCount').attr('id', `extensionCount${index}`).text(userRentingBook.extensionCount))
					.append($('<td>').addClass('isArreas').attr('id', `isArreas${index}`).text(arrearsFig))
					.append(
						$('<td>')
							.addClass('select')
							.append(
								$('<input>', {
									type: 'checkbox',
									id: `select${index}`,
									name: 'selectingBook',
									class: 'bookCheckBox',
									value: `${index}`
								})
							)
					);
				$('table').append(tableRow);
				index++;
			}
		}

		//延滞等警告文の処理の活性状態変更を行います。
		//ペナルティ期間中を判定、保持します。
		var isOnPenaDay = userDatas.penaDay >= 1;

		//延滞等警告文の処理
		//ペナルティ日数が1日以上の場合警告文を表示します
		//取得されたペナルティ日数は現在貸出中の書籍の延滞日数も加味されているので、考慮するのはペナルティ日数のみとします。
		errorStringControl('.duringPenaltyErr', getError('DURING_PENALTY_ERR'), !isOnPenaDay);

		//新規貸出ボタンの活性状態変更
		//ペナルティ期間か貸出中書籍が貸し出し条件に達している場合非活性化します。
		buttonDisableControl('#newRent', isOnPenaDay || userRentingBooks.length >= rentBookLimit);

	} catch (err) {
		console.error(err);
		//エラー時には予期せぬエラーのモーダルを表示しします。
		modalOpen();
		setModalUnexpectedErr();
		removeModalBackButton();
		addModalButton('戻る', 'modalBackwardsBtn');
		$(document).on('click', '#modalBackwardsBtn', () => {
			//全体のターミナルへ戻ります。
			gotoward('TotalTerminal');
		});
	}



	//ボタン押下時の処理

	//返却ボタンと延長ボタンの活性状態変更
	//初期状態は非活性とします。
	buttonDisableControl('#return', true);
	buttonDisableControl('#extension', true);
	


	//チェックボックスにチェックを付けたときの処理
	
	//チェックのついた列番号を定義
	var selectedRowIndexs;

	//チェックボックスいずれかに変更のあったタイミングで状態変更を行います。
	$('.bookCheckBox').on('change', () => {
		//選択されている書籍の列番号が格納されているjqueryオブジェクトを取得します。
		selectedRowIndexs = $('.bookCheckBox:checked');

		//返却ボタン 選択書籍が0冊の場合は非活性化します。
		buttonDisableControl('#return', selectedRowIndexs.length <= 0);


		//延長ボタン
		//ペナルティ期間中か、貸出中書籍が0冊、
		//もしくは選択された書籍の中に延長回数が上限に達しているものがある場合は非活性化します。

		//選択された書籍の内、延長回数が上限に達しているものがあるかどうかを取得します。
		var isExtensionCountOver = false;
		for (const selectedRowIndex of selectedRowIndexs) {
			if ($(`#extensionCount${selectedRowIndex.value}`).text() >= extensionCountLimit) {
				isExtensionCountOver = true;
				break;
			}
		}
		//上記内容に応じてボタンの活性状態を変更します。
		buttonDisableControl('#extension',
			isOnPenaDay ||
			selectedRowIndexs.length <= 0 ||
			isExtensionCountOver
		);
		//選択中の書籍の中に延長回数が上限に達しているものがあれば警告文を表示します。
		errorStringControl(
			'.extensionCountErr',
			getError('REACH_TO_EXTENSION_COUNT_LIMIT_ERR'),
			!isExtensionCountOver
		);
	});


	//返却処理の実行
	$('#return').on('click', async () => {
		try {
			//選択された行の書籍を一括で返却処理します
			var result = await consecutiveExtensionOrReturn(selectedRowIndexs,checkIsBookAndReturn);
			//返却処理が完了した書籍です
			var succeededBooks = result.succeededBooks;
			//返却処理が失敗した書籍です
			var failedBooks = result.failedBooks;
			
			//処理結果を表示します
			modalOpen();
			setModalTitle('返却');
			if (succeededBooks.length >= 1) {
				//返却処理を実施されたものの表示枠を作成します
				setModalContent(`
					<div class="modalSucceedBooks" style="margin-bottom:10vh;">
						<div style="margin-bottom:10px;">以下の書籍の返却が完了しました。</div>
						<ul style="padding-left:10vw;">
						</ul>
					</div>
				`);
				//処理が完了したものをリスト形式で表示枠に挿入します
				listfyBooksDatas('.modalSucceedBooks',succeededBooks);
			}
			if (failedBooks.length >= 1) {
				//返却処理が実施されなかったものの表示枠を作成します。
				setModalContent(`
					<div class="modalErrBooks">
						<div style="color:red;margin-bottom:10px;">以下の書籍の返却が実行されませんでした。</div>
						<ul style="padding-left:10vw;">
						</ul>
					</div>
				`);
				//処理が完了したものをリスト形式で表示枠に挿入します
				listfyBooksDatas('.modalErrBooks',failedBooks);
			}
			//戻るボタンの戻るボタンの挙動を変更します
			removeModalBackButton();
			addModalButton('戻る', 'modalReloadButton');
			$(document).on('click', '#modalReloadButton', () => {
				//戻るボタンを押下した際に画面を再読み込みします
				location.reload(true);
			});
		} catch (e) {
			console.error(e);
			modalOpen();
			setModalUnexpectedErr();
			removeModalBackButton();
			addModalButton('戻る', 'modalReloadButton');
		}
	});

	//延長処理の実行
	$('#extension').on('click', async () => {
		try{
			//選択された行の書籍を一括で延長します。
			var result = await consecutiveExtensionOrReturn(selectedRowIndexs,checkIsBookAndExtension);
			var succeededBooks = result.succeededBooks;
			var failedBooks = result.failedBooks;
			
			modalOpen();
			setModalTitle('延長');
			if (succeededBooks.length >= 1) {
				//処理が実施されたものの表示枠を挿入します
				setModalContent(`
					<div 
						class="modalSucceedBooks">
						<div style="margin-bottom:10px;">以下の書籍の延長が完了しました。</div>
						<ul>
						</ul>
					</div>
				`);
				//処理が完了したものを更新された返却日を付与しリスト形式で表示枠に挿入します
				for (const succeededBook of succeededBooks) {
					const currentBookNum = succeededBook.bookNum;
					const currentBookBranchNum = succeededBook.bookBranchNum;
					const bookDatas = await isBookAndGetThatDatas(currentBookNum, currentBookBranchNum);
					const rentAdminObj = await getRentingBook(currentBookNum,currentBookBranchNum);
					const returnDate = new Date(rentAdminObj.returnDate);
					$('.modalSucceedBooks > ul').append(`
						<li style="display:flex;justify-content:space-between;">
							<div>${bookDatas.bookName}</div>
							<div>
								返却日：${returnDate.getFullYear()}年${returnDate.getMonth()+1}月${returnDate.getDate()}日
							</div>
						</li>
					`);
				}
			}
			if (failedBooks.length >= 1) {
				//処理が実施されなかったものの表示枠を挿入します
				setModalContent(`
					<div class="modalErrBooks">
						<div style="color:red;margin-bottom:10px;">以下の書籍の返却が実行されませんでした。</div>
						<ul style="margin-left:10vw;">
						</ul>
					</div>
				`);
				//処理が行われなかった書籍をリスト形式で表示枠に挿入します
				listfyBooksDatas('.modalErrBooks',failedBooks);
			}
			//モーダルの戻るボタンの挙動を変更します
			removeModalBackButton();
			addModalButton('戻る', 'modalReloadButton');
			$(document).on('click', '#modalReloadButton', () => {
				//戻るボタンを押下した際に画面を再読み込みします
				location.reload(true);
			});
			
		}catch(err){
			console.error(err);
			modalOpen();
			setModalUnexpectedErr();
			removeModalBackButton();
			addModalButton('戻る', 'modalReloadButton');
		}
	});
	
	//エラー時のモーダルの戻るボタンの挙動を定義します。
	$(document).on('click', '#modalReloadButton', () => {
		location.reload(true);
	});

	//新規貸出画面への遷移
	$('#newRent').on('click', () => {
		gotoward('rent');
	});
});


//選択された行のオブジェクトと返却か延長処理を指定することで
//選択された行の書籍を一括で返却もしくは延長し、
//処理の成功した書籍と失敗した書籍の書籍番号と枝番ををbookオブジェクトに梱包して返却します。
function consecutiveExtensionOrReturn(selectedRowIndexs, func) {
	return new Promise(async(resolve,reject)=>{
		try{
			//処理が完了した書籍と失敗した書籍のリストを作成します
			var succeededBooks = [];
			var failedBooks = [];
			
			//指定された書籍の列からそれぞれ処理を行い成功か否かによって各リストに書籍番号と枝番を格納します
			for (const selectedRowNum of selectedRowIndexs) {
				var currentBookNum = $(`#bookNum${selectedRowNum.value}`).text();
				var currentBookBranchNum = $(`#bookBranchNum${selectedRowNum.value}`).text();
				var isFuncSucceed = await func(currentBookNum, currentBookBranchNum);
				if (isFuncSucceed) {
					succeededBooks.push({
						bookNum: currentBookNum,
						bookBranchNum: currentBookBranchNum
					})
				} else {
					failedBooks.push({
						bookNum: currentBookNum,
						bookBranchNum: currentBookBranchNum
					})
				}
			}
			//各リストをbooksオブジェクトに格納し、返却します
			var books = {
				succeededBooks: succeededBooks,
				failedBooks: failedBooks
			}
			resolve(books);
		}catch(err){
			reject(err);
		}
	});
}

//処理終了後のモーダルを表示した後の書籍情報挿入処理を行います。
function listfyBooksDatas(insertElmAttr,booksObj){
	return new Promise(async(resolve,reject)=>{
		try{
			for (const bookObj of booksObj) {
				const bookDatas = await isBookAndGetThatDatas(bookObj.bookNum, bookObj.bookBranchNum);
				$(`${insertElmAttr} > ul`).append(`
					<li>${bookDatas.bookName}</li>
				`);
			}
			resolve();
		}catch(err){
			reject(err);
		}
	});
}