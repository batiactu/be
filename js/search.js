function initSearch() {
	
	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'zone-geo'
		}
		,dataType:'jsonp'
		,ajax:false
	}).done(function(data) {
		/*
		 * Init zone geo détail
		 */
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		var Tab = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tab.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     				});
     				
     			
     			
     		k++;		
     	}
		$('#recherche-detail-zonegeo').html(template(Tab));
		//$('#recherche-detail-zonegeo').checkboxradio( "refresh" );

	});


	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'fonction'
		}
		,dataType:'jsonp'
	}).done(function(data) {
		
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		var Tab = new Array;
		var k=0;
		for(parent in data) {
     			
     		//	$('#recherche-detail-fonction').append('<h2>'+data[parent]["libelle"]+'</h2>');
     			
     			for(fonction in data[parent]["fonction"]) {
     				
	     			label = data[parent]["fonction"][fonction];
	     			
     				Tab.push({
     					'item_value': fonction
     					,'item_label':label
     					,'item_index':k
     				});
     				
	         		k++;		
     			}
     			
     	}

 		$('#recherche-detail-fonction').html(template(Tab));
		//$('#recherche-detail-fonction input[type=checkbox]').checkboxradio(  );

		//$('#recherche-detail-zonegeo').checkboxradio( "refresh" );

	});
	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'contrat'
		}
		,dataType:'jsonp'
	}).done(function(data) {
		
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		var Tab = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tab.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     				});
     				
     			
     			
     		k++;		
     	}
		$('#recherche-detail-contrat').html(template(Tab));

	});

	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'experience'
		}
		,dataType:'jsonp'
	}).done(function(data) {
		
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		var Tab = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tab.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     				});
     				
     			
     			
     		k++;		
     	}
		$('#recherche-detail-experience').html(template(Tab));

	});
}

function launchSearch(advanceMode) {
	
	if(advanceMode==null)advanceMode=false;
	
	
	$.mobile.changePage('#recherche');
	
	var mot = $('#recherche-detail-mot-clef').val();
	

	var fonction = '';
	var experience = '';
	var contrat = '';
	
	if(advanceMode) {
		$('.checkContrat').each(function(i) {
			
			if($(this).is(':checked')) {
				if(contrat!='')contrat+='|';
				contrat+=$(this).val();
			}
		});	
			
		$('.checkFonction').each(function(i) {
			
			if($(this).is(':checked')) {
				if(fonction!='')fonction+='|';
				fonction+=$(this).val();
			}
		});	
			
		$('.checkExperience').each(function(i) {
			
			if($(this).is(':checked')) {
				if(experience!='')experience+='|';
				experience+=$(this).val();
			}
		});	
			
		$('.checkZonegeo').each(function(i) {
			
			if($(this).is(':checked')) {
				if(zonegeo!='')zonegeo+='|';
				zonegeo+=$(this).val();
			}
		});	
			
			
	}
	else {
		var zonegeo = $('#accueil #zone-geo').val();
	}


	$('#resultat-recherche').completeListItem({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data:{
			get:'search'
			,jsonp:1
			,mot:mot
			,zonegeo:zonegeo
			,fonction:fonction
			,experience:experience
			,contrat:contrat
		}
	});

	
	return false;
}

