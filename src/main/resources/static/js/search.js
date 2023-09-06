$(async function() {
	//ジャンルを取得、select要素に挿入します。
	var genres = await getAllGenre();
	genres.forEach((genre) => {
		$('#genreNum').append(
			$('<option>').text(genre.genreName).val(genre.genreNum)
		);
	});

	//入力チェック
	//入力チェックを行う要素を取得
	var bookName = $('#bookName');
	var authorName = $('#authorName');


	//書籍名
	bookName.on('change blur', () => {
		var isBookNameInputCorrect = regexTest(getRegex('bookName'), bookName.val());
		colorTextBox('#bookName', isBookNameInputCorrect);
		errorStringControl('.bookNameRegexErr', getError('BOOK_NAME_REGEX_ERR'), isBookNameInputCorrect);
	});

	//著者名
	authorName.on('change blur', () => {
		var isAuthorNameInputCorrect = regexTest(getRegex('authorName'), authorName.val());
		colorTextBox('#authorName', isAuthorNameInputCorrect);
		errorStringControl('.authorNameRegexErr', getError('AUTHOR_NAME_REGEX_ERR'), isAuthorNameInputCorrect);
	});

	//検索ボタンの活性状態を変更します
	//初期状態は活性状態です
	//書籍名か著者名のいずれかに変更があった際に処理を行います
	$(document).on('change blur', '#bookName,#authorName', () => {
		var isBookNameInputCorrect = regexTest(getRegex('bookName'), bookName.val());
		var isAuthorNameInputCorrect = regexTest(getRegex('authorName'), authorName.val());
		buttonDisableControl('.searchButton', !isBookNameInputCorrect || !isAuthorNameInputCorrect);
	});


	//検索処理
	$('.searchButton').on('click', async () => {
		var searchCondtions = getSearhConditions();
		var searchResults = await search(searchCondtions);
		//検索結果表示欄を表示
		$('.main2').css('display', 'unset');
		//検索結果表示欄内のテーブルを格納する要素を取得
		var searchResultHolder = $('.searchResultHolder');
		//同要素内を初期化
		searchResultHolder.empty();
		//検索結果に応じて表示する内容を変更
		if (searchResults.length >= 1) {
			searchResultHolder.css({
				'justify-content': 'unset',
				'aligm-items': 'unset'
			});
			//テーブルを挿入
			searchResultHolder.append(`
				<table class="searchResultShowingTable">
					<tr class="first-child-tr">
						<th class="thBookName">書籍名</th>
						<th class="thAuthorName">著者名</th>
						<th class="thGenre">ジャンル</th>
						<th class="thBookPlace">蔵書場所</th>
						<th class="thAvailableBooksCount">貸出可能<span>件数</span></th>
					</tr>
				</table>
			`);
			//検索結果をテーブルに挿入します。
			await insertSearchResults(searchResults);
		} else {
			console.log('hi');
			searchResultHolder
				.text(getError('NO_SEARCH_RESULT_FOUND'))
				.css({
					'justify-content': 'center',
					'align-items': 'center'
				});
		}
	});


	//追加検索処理
	//検索結果表示欄内で最下部までスクロールした際に追加検索を行います。

	//追加検索を行える状態で複数回検索を阻害するフラグを定義します
	var loadFlg = true;
	$('.searchResultHolder').on('scroll', async (e) => {
		//検索結果表示欄を取得
		var searchResultHolder = $(e.target);

		//検索結果行事欄の表示域をそれぞれ取得します
		var scrollHeight = searchResultHolder.prop('scrollHeight'); //要素のスクロール可能な高さ
		var scrollTop = searchResultHolder.prop('scrollTop'); //現在のスクロール位置
		var clientHeight = searchResultHolder.prop('clientHeight'); //表示域の高さ
		
		//エラー文が表示されていた場合削除します。
		errorStringControl('.noMoreResultCaution',getError('NO_MORE_SEARCH_RESULT_FOUND'), true);
		

		//現在のスクロール位置と表示域の高さが要素のスクロール可能な高さより大きい場合に発火します
		//50は判定に余裕を持たせるための値です。
		if (scrollTop + clientHeight + 50 >= scrollHeight) {
			if (loadFlg) {
				loadFlg = false;
				var searchConditions = getSearhConditions();
				//検索結果表示欄の最終行を取得します。
				var lastChildRow = $('.searchResultShowingTable tbody tr:last-child');
				var previousBookName = lastChildRow.children('.tdBookName').text();
				var previousAuthorName = lastChildRow.children('.tdAuthorName').text();
				var previousBookNum = lastChildRow.children('.tdBookNum').val();

				try {
					var searchResults = await searchMore(searchConditions, previousBookName, previousAuthorName, previousBookNum);
					if (searchResults.length >= 1) {
						insertSearchResults(searchResults);
					}else{
						errorStringControl('.noMoreResultCaution', getError('NO_MORE_SEARCH_RESULT_FOUND'), false);
					}
				} catch (err) {
					console.error(err);
					modalOpen();
					setModalUnexpectedErr();
					removeModalBackButton();
					addModalButton('戻る', 'modalPageReloadButton');
					$(document).on('click','#modalPageReloadButton',()=>{
						location.reload(true);
					});
				} finally {
					loadFlg = true;
				}
			}
		}
	});



	//一回目の検索と二回目以降の検索の共通メソッドを定義します
	//検索条件を返却します
	function getSearhConditions() {
		//検索条件をまとめます
		var searchCondition = {
			bookName: $('#bookName').val(),
			authorName: $('#authorName').val(),
			genreNum: $('#genreNum').val(),
			bookNameSort: $('input[name=bookNameSort]:checked').val(),
			authorNameSort: $('input[name=authorNameSort]:checked').val(),
			prioriSort: $('input[name=prioriSort]:checked').val()
		};
		return searchCondition;
	}

	//検索結果をテーブルに挿入します
	function insertSearchResults(searchResults) {
		return new Promise((resolve, reject) => {
			try {
				searchResults.forEach(async (searchResult) => {
					$('.searchResultShowingTable').append(
						$('<tr>')
							.append($('<td>').addClass('tdBookName').text(searchResult.bookName))
							.append($('<td>').addClass('tdAuthorName').text(searchResult.authorName))
							.append($('<td>').addClass('tdGenre').text(searchResult.genreName))
							.append($('<td>').addClass('tdBookPlace').text(searchResult.bookPlace))
							.append($('<td>').addClass('tdAvailableBooksCount').text(searchResult.availableBookCount))
							.append($('<input>').attr({ type: 'hidden', class: 'tdBookNum' }).val(searchResult.bookNum))
					);
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
});