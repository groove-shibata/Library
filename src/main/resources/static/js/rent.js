$(async function() {
	//一人当たりの貸出可能な件数を定義します
	var availableRentCountPerUser = 5;

	//前画面から受け渡された図書カード番号をhidden項目から取得します
	var userNum = $('#userNum').val();

	//図書カード番号から利用者情報を取得します
	var userDatas = await getUserDatas(userNum);
	var userRentingBooks = await getUserRentingBooks(userNum);

	//利用者の現在の貸出可能件数を定義します
	var thisUsersAvailableRentCount = availableRentCountPerUser - userRentingBooks.length;


	//画面利用者情報情報の取得・描画
	//取得した情報を各項目に反映します
	$('#userNumHolder').text(userNum);
	$('#userName').text(userDatas.userName);
	$('#availableRentCount').text(thisUsersAvailableRentCount);


	//入力チェック
	var bookNum = $('#bookNum');
	var bookBranchNum = $('#bookBranchNum');

	//書籍番号入力チェック
	bookNum.on('change blur', (e) => {
		//正しい入力が行われたか判定・取得します
		var isInputCorrect = regexTest(getRegex(`${e.target.id}`), e.target.value);
		//入力に応じてテキストボックスの状態を変更します。
		colorTextBox(`#${e.target.id}`, isInputCorrect);
		//入力に応じてエラー文を表示します
		errorStringControl('.bookNumRegexErr', getError('BOOK_NUM_REGEX_ERR'), isInputCorrect);
	});

	//書籍番号枝番入力チェック
	bookBranchNum.on('change blur', (e) => {
		//正しい入力が行われたか判定・取得します
		var isInputCorrect = regexTest(getRegex(`${e.target.id}`), e.target.value);
		//入力に応じてテキストボックスの状態を変更します。
		colorTextBox(`#${e.target.id}`, isInputCorrect);
		//入力に応じてエラー文を表示します
		errorStringControl('.bookBranchNumRegexErr', getError('BOOK_BRANCH_NUM_REGEX_ERR'), isInputCorrect);
	});

	//追加ボタンが押された際の挙動
	$('.addButton').on('click', async () => {
		//既に追加された書籍と追加する書籍が重複していないか確認
		//追加済みの行を全て取得します
		var embeddedRows = $('.embeddedRow');
		//重複の有無はフラグで管理します
		var bookDuplicatedFlg = false;
		//取得した行の書籍番号と枝番を追加しようとしている書籍と照合しいずれかが重複していればフラグをtrueにします
		embeddedRows.map((index, embeddedRow) => {
			var embeddedBookNum = $(embeddedRow).children('.bookNum').text()
			var embeddedBookBranchNum = $(embeddedRow).children('.bookBranchNum').text()

			if (bookNum.val() == embeddedBookNum || bookBranchNum.val() == embeddedBookBranchNum) {
				bookDuplicatedFlg = true;
			}
		});
		//重複のエラー文を表示します。
		errorStringControl('.addTwiceErr', getError('ADD_TWICE_ERR'), !bookDuplicatedFlg);


		//入力された書籍番号に対応する書籍が書籍マスタに登録されているか確認
		//入力された書籍番号-枝番で書籍マスタに問い合わせます。登録されていない場合はbookNumがnullで返却されます
		var bookDatas = await isBookAndGetThatDatas(bookNum.val(), bookBranchNum.val());
		//登録されていない旨のエラー文を表示します
		errorStringControl('.invalidBookAddedErr', getError('INVALID_BOOK_ADDED_ERR'), !(bookDatas.bookNum == null));

		//重複が起こっておらず、書籍マスタに登録されている場合に追加書籍一覧に追加します。
		if (!bookDuplicatedFlg && bookDatas.bookNum != null) {
			//列を識別する番号を取得します
			var rowIndexs = $('.deleteButton').map(function(index, elm) {
				return Number(elm.value);
			}).get();
			//最初に追加する列の番号は0です
			var thisRowIndex = 0;
			//二回目以降に追加する列の番号は既に存在する列番号の最大値に1加えたものです
			if (rowIndexs.length >= 1) {
				thisRowIndex = Math.max.apply(null, rowIndexs) + 1;
			}

			//書籍名を取得します
			var bookName = bookDatas.bookName;
			$('.addedBooks').append(
				$('<tr>').attr({ class: 'embeddedRow', id: `embeddedRow${thisRowIndex}` })
					.append($('<td>').attr({ class: 'bookNum', id: `bookNum${thisRowIndex}` }).text(bookNum.val()))
					.append($('<td>').attr({ class: 'bookBranchNum', id: `bookBranchNum${thisRowIndex}` }).text(bookBranchNum.val()))
					.append($('<td>').attr({ class: 'bookName', id: `bookName${thisRowIndex}` }).text(bookName))
					.append($('<td>').attr({ class: 'deleteButtonArea', id: `deleteButtonArea${thisRowIndex}` }).append(`<button class="deleteButton" type="button" value=${thisRowIndex} onClick=deleteRow(${thisRowIndex})>削除</button>`))
			);
		}
	});


	//ボタンの制御を行います
	//追加ボタンと貸出ボタンの初期状態は非活性です。
	buttonDisableControl('.addButton', true);
	buttonDisableControl('.rentButton', true);

	//書籍番号と枝番の入力要素に変更があった場合に発火します
	$(document).on('change blur', '#bookNum,#bookBranchNum', () => {
		//追加ボタンと貸出ボタンの活性状態処理を行います
		addAndRentButtonControl();
	});

	//画面の新規貸出書籍一覧に行が追加または削除されたときに発火します
	(new MutationObserver(function() {
		//追加ボタンと貸出ボタンの活性状態処理を行います
		addAndRentButtonControl();

		//貸出中の書籍と追加された書籍の合計が貸出条件に達した時のエラーを表示します
		var addedBooksCount = $('.embeddedRow').length;
		var isKeepingBookCountReachLimit = thisUsersAvailableRentCount - addedBooksCount <= 0;
		errorStringControl('.addedBooksReachLimitErr', getError('ADDED_BOOKS_REACH_LIMIT_ERR'), !isKeepingBookCountReachLimit);

		//行の数に変更があった場合に一部エラーメッセージ(追加した書籍が重複していたエラー)を削除します。
		errorStringControl('.addTwiceErr', '', true);
	})).observe(document.querySelector('tbody'), { childList: true });

	//上記2つの処理に共通する処理の関数
	//文字入力に変更があったときと追加ボタンまたは行削除ボタンが押下されたときに
	//書籍追加ボタンと貸出ボタンの活性状態を変更するための制御です
	function addAndRentButtonControl() {
		var isbookNumInputCorrect = regexTest(getRegex('bookNum'), $('#bookNum').val());
		var isbookBranchNumInputCorrect = regexTest(getRegex('bookBranchNum'), $('#bookBranchNum').val());

		//貸出中の書籍数と現在追加されている書籍数が貸し出し可能な件数を超えている場合の制御
		var addedBooksCount = $('.embeddedRow').length;
		var isKeepingBookCountReachLimit = thisUsersAvailableRentCount - addedBooksCount <= 0;

		//追加ボタン
		//書籍番号と枝番に入力がありかつ正常な値で貸出中書籍と追加済み書籍の総数が上限に達していない場合に活性化されます
		buttonDisableControl('.addButton',
			!isbookNumInputCorrect ||
			!isbookBranchNumInputCorrect ||
			isKeepingBookCountReachLimit
		);

		//貸出ボタン
		//新規貸出書籍一覧に追加済みの書籍が1冊以上あれば活性化します
		buttonDisableControl('.rentButton', !(addedBooksCount >= 1));
	}


	//貸出処理の実行
	$('.rentButton').on('click', async () => {
		try {
			//利用者情報がまだ登録されているか確認します
			var user = await getUserDatas(userNum);
			//取得した利用者情報の図書カード番号がnull = 利用者情報が存在しない場合はエラーモーダルを表示します
			if (user.userNum == null) {
				modalOpen();
				setModalTitle('エラー');
				setModalTitleColor('red');
				setModalContent(`
					${getError('INVALID_USER_ACCESS_ERR')}
				`);
				removeModalBackButton();
				addModalButton('戻る','modalBackToHomeButton');
				$(document).on('click','#modalBackToHomeButton',()=>{
					//利用者情報が存在しない場合は最初のターミナル画面へ遷移します
					gotoward('TotalTerminal');
				});
			} else {
				//追加された書籍を取得
				var embededRows = $('.embeddedRow');
				var aboutToRentBookObjects = [];

				embededRows.map((index, embededRow) => {
					var book = {
						bookNum: $(embededRow).children('.bookNum').text(),
						bookBranchNum: $(embededRow).children('.bookBranchNum').text()
					};
					aboutToRentBookObjects.push(book);
				});



				//貸出処理の実行
				var resultBooks = await checkDatasAndRentBooks(userNum, aboutToRentBookObjects);
				var rentSucceededBooks = resultBooks.succeededBooksList;
				var rentFailedBooks = resultBooks.failedBooksList;

				//返却された値に応じた結果の表示
				modalOpen();
				setModalTitle('貸出');
				//貸出処理が実行された書籍を表示します
				if (rentSucceededBooks.length >= 1) {
					setModalContent(`
					<div class="modalSucceedBooks" style="margin-bottom:10vh;">
						<div style="margin-bottom:10px;">以下の書籍の貸出が完了しました。</div>
						<ul style="padding-left:10px;">
						</ul>
					</div>
				`);
					listBooks('.modalSucceedBooks', rentSucceededBooks);
				}
				//貸出処理が実行されなかった書籍を表示します
				if (rentFailedBooks.length >= 1) {
					setModalContent(`
					<div class="modalFailedBooks" style="margin-bottom:10vh;">
						<div style="margin-bottom:10px;color:red;">以下の書籍は既に貸し出されています。</div>
						<ul style="padding-left:10px;">
						</ul>
					</div>
				`);
					listBooks('.modalFailedBooks', rentFailedBooks);
				}

				//モーダルの戻るボタンの挙動を変更します
				removeModalBackButton();

				if (rentFailedBooks.length >= 1) {
					//貸出が完了しなかった書籍が一冊でもある場合は戻るボタン押下時にページをリロードします
					addModalButton('戻る', 'modalPageReloadButton');
				} else {
					addModalButton('戻る', 'modalBackButton');
				}
			}
		} catch (err) {
			console.error(err);
			modalOpen();
			setModalUnexpectedErr();
			removeModalBackButton();
			addModalButton('戻る', 'modalPageReloadButton');
		}
		//モーダルの戻るボタン押下時の画面遷移を定義します
		$(document).on('click', '#modalBackButton', () => {
			gotoward('return-extension');
		});
		$(document).on('click', '#modalPageReloadButton', () => {
			location.reload(true);
		});
	});
});

//削除ボタンの押された行を削除する関数
function deleteRow(rowNum) {
	$(`#embeddedRow${rowNum}`).remove();
}

//処理結果を表示する際のリスト表示の共通処理
function listBooks(insertElmAttr, bookList) {
	for (const book of bookList) {
		$(`${insertElmAttr} > ul`).append(`
					<li style="display:flex;justify-content:space-between;"><div>書籍番号 : ${book.bookNum}-${book.bookBranchNum}</div><div>書籍名 : ${book.bookName}</div></li>
				`);
	}
}