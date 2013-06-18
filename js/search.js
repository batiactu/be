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
		 * Init zone geo accueil
		 */
		var template = $('#zone-geo').html();
		$('#zone-geo').html('');
		
		ligne = template;
		var myRegexp= new RegExp("item_value","gi");
	 	ligne = ligne.replace(myRegexp, '');
		var myRegexp= new RegExp("item_label","gi");
	 	ligne = ligne.replace(myRegexp, 'France entière');
		
		$('#zone-geo').append(ligne);
		
		
		for(code in data) {
     			
     			label = data[code];
     			
     			ligne = template;
     			
     			var myRegexp= new RegExp("item_value","gi");
			 	ligne = ligne.replace(myRegexp, code);
     			var myRegexp= new RegExp("item_label","gi");
			 	ligne = ligne.replace(myRegexp, label);
     			
     			$('#zone-geo').append(ligne);
     			
     		}

		$('#zone-geo').selectmenu( "refresh" );

		/*
		 * Init zone geo accueil
		 */
		var template = $('#recherche-detail-zonegeo').html();
		$('#recherche-detail-zonegeo').html('');
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			ligne = template;
     			
     			var myRegexp= new RegExp("item_value","gi");
			 	ligne = ligne.replace(myRegexp, code);
     			var myRegexp= new RegExp("item_label","gi");
			 	ligne = ligne.replace(myRegexp, label);
     			var myRegexp= new RegExp("item_index","gi");
			 	ligne = ligne.replace(myRegexp, k);
     			
     			
     			$('#recherche-detail-zonegeo').append(ligne);
     		k++;		
     	}

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
		
		
		var template = $('#recherche-detail-fonction').html();
		$('#recherche-detail-fonction').html('');
		var k=0;
		for(parent in data) {
     			
     		//	$('#recherche-detail-fonction').append('<h2>'+data[parent]["libelle"]+'</h2>');
     			
     			for(fonction in data[parent]["fonction"]) {
     				
	     			label = data[parent]["fonction"][fonction];
	     			
	     			ligne = template;
	     			
	     			var myRegexp= new RegExp("item_value","gi");
				 	ligne = ligne.replace(myRegexp, fonction);
	     			var myRegexp= new RegExp("item_label","gi");
				 	ligne = ligne.replace(myRegexp, label);
	     			var myRegexp= new RegExp("item_index","gi");
				 	ligne = ligne.replace(myRegexp, k);
     				
	     			$('#recherche-detail-fonction').append(ligne);
     			}
     			
     			
     			
     		k++;		
     	}

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
		
		//$('#recherche-detail-contrat').checkboxradio( "disable" );
		var template = $('#recherche-detail-contrat').html();
		$('#recherche-detail-contrat').html('');
		//$('#recherche-detail-contrat').checkboxradio( "enable" );
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			ligne = template;
     			
     			var myRegexp= new RegExp("item_value","gi");
			 	ligne = ligne.replace(myRegexp, code);
     			var myRegexp= new RegExp("item_label","gi");
			 	ligne = ligne.replace(myRegexp, label);
     			var myRegexp= new RegExp("item_index","gi");
			 	ligne = ligne.replace(myRegexp, k);
     			
     			
     			$('#recherche-detail-contrat').append(ligne);
     		k++;		
     	}

		//$('#recherche-detail-zonegeo').checkboxradio( "refresh" );

	});

	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'experience'
		}
		,dataType:'jsonp'
	}).done(function(data) {
		
		
		var template = $('#recherche-detail-experience').html();
		$('#recherche-detail-experience').html('');
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			ligne = template;
     			
     			var myRegexp= new RegExp("item_value","gi");
			 	ligne = ligne.replace(myRegexp, code);
     			var myRegexp= new RegExp("item_label","gi");
			 	ligne = ligne.replace(myRegexp, label);
     			var myRegexp= new RegExp("item_index","gi");
			 	ligne = ligne.replace(myRegexp, k);
     			
     			
     			$('#recherche-detail-experience').append(ligne);
     		k++;		
     	}

		//$('#recherche-detail-zonegeo').checkboxradio( "refresh" );

	});
}

function launchSearch(advanceMode) {
	
	if(advanceMode==null)advanceMode=false;
	
	
	$.mobile.changePage('#recherche');
	
	var mot = $('#accueil #mot-clef').val();
	

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

