$(function(){
	//画面遷移系
	$('.users').on('click',()=>{
		gotoward('users_Terminal');
	});
	$('.search').on('click',()=>{
		gotoward('search');
	});
	$('.rent').on('click',()=>{
		$('#afterLoginDestination').val('return-extension');
		gotoward('login');
	});
	$('img').on('click',()=>{
		gotoward('TotalTerminal');
	});
});