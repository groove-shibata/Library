package com.example.demo.Objects;

import lombok.Data;

@Data
public class DisplayForm {
	private String destination;
	
	//当フィールドに値を追加することによってgotowardした際に画面上にある該当する要素を取得、遷移時に受け渡します。
	private String userNum;
	private String afterLoginDestination;
	private String previousPageUrl;
	private String usersProcess;
}
