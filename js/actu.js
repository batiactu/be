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
