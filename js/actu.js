function initActu() {
	/*
	
	$('#actu #list-actu').completeListItem({
		url: 'http://www.batiactu.com/rss/emploi.rss'
		,dataType:'xml'
		,listItem:'#item-actu-blank'
		,data : {
			jsonp:1
		}
		,noLoading:1
	});
	*/
}
function showArticle(url_article) {
	
	
	var reg=new RegExp("$[0-9]+(.php)","g");
	id_edito = reg.exec(url_article); 
//	 alert(id_edito);
	/* populate annonce */
	$.mobile.changePage('#article');

	$('#annonce').getItem({
		url:'http://www.batiactu.com/cap_batiactu/scripts/get-edito.php'
		,data: {
			id_edito : id_edito
			,jsonp:'jsonp'
		}
	});
	
	
}
