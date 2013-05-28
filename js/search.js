function initSearch() {
	
	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'fonction'
		}
		,dataType:'jsonp'
	}).done(function(fonctions) {
		
		$('#zone-geo').html('');
		
		for(i in fonctions) {
     			
     			fonction = fonctions[i];
     			
     			ligne += '<option value="'+i+'">'+fonction+'</option>';
     			
     			$('#zone-geo').append(ligne);
     			
     		}

	});
	
}

function launchSearch() {
	$.mobile.changePage('#recherche');
	
	var mot = $('#accueil #mot-clef').val();
	var zonegeo = $('#accueil #zone-geo').val();

	$('#resultat-recherche').completeListItem({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data:{
			jsonp:1
			,get:'search'
			,mot:mot
			,zonegeo:zonegeo
		}
	});
	
	return false;
}
$(document).ready(function() {
		initSearch();
});
