function initActu() {
	/*$.ajax({
		url: 'http://www.batiactu.com/rss/emploi.rss'
		,dataType: 'xml'
		,success:function(xml) {
			
			var template = $('#actu #actu-blank').clone();
			
			
			$('item',xml).each(function(i) {
				title = $('title',this).text();
				description = $('description',this).text();
			
				ligne = template.clone();
				
				ligne.attr('id','actu-'+i);
								
				ligne.find('')				
								
				//$('#list-actu').html(article.title);
				
			});	
			
		}
	}).fail(function() { alert("error loading rss"); });
	*/
	
	$('#actu #list-actu').completeListItem({
		url: 'http://www.batiactu.com/rss/emploi.rss'
		,dataType:'xml'
		,listItem:'#item-actu-blank'
		,data : {
			jsonp:1
		}
		,noLoading:1
	});
	
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
