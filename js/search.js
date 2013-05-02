function launchSearch() {
	var mot = $('#mot-clef').val();
	var zonegeo = $('#zone-geo').val();

	$('#resultat-recherche').html('<li>Recherche en cours...</li>');
	$('#resultat-recherche').show();
//	$('#resultat-recherche').listview('refresh');
	
	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'search'
			,mot:mot
			,zonegeo:zonegeo
		}
		,dataType:'jsonp'
	}).done(function(annonces) {
		
		$('#resultat-recherche').html('');
		
		for(i in annonces) {
     			
     			annonce = annonces[i];
     			
     			ligne = '<li><a data-ajax="false" href="annonce.html?id_annonce='+annonce.origine+'">';
     			if(annonce.logo_recruteur!='') ligne+= '<img src="http://www.batiactuemploi.com/images/recruteur/recruteur_sscadre/'+annonce.logo_recruteur+'" />';
     			ligne += '<h2>'+annonce.libelle+' <span style="font-weight: normal">de '+annonce.lib_recruteur+'</span></h2>';
				ligne += '</a></li>';
     			
     			$('#resultat-recherche').append(ligne);
     			
     		}
     		
     	$('#resultat-recherche').listview('refresh');
	});

	return false;
}
