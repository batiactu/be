function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
function postuler() {
	
	email = $('#email').val();
	
	if(email=='') {
		alert('Veuillez saisir votre email pour postuler !');
	}
	else {
		
		$.jStorage.set('email', email);
		
		id_annonce = getURLParameter('id_annonce');
		alert("Vous avez postuler pour l'offre "+id_annonce+" !");
		
	}
	
}
function showAnnonce(id_annonce) {
	/* populate annonce */
	$.mobile.changePage('#annonce');


	$.ajax({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'annonce'
			,id_annonce:id_annonce
		}
		,dataType:'jsonp'
	}).done(function(annonce) {
		
		$('#annonce #titre').html(annonce.libelle);		
		$('#annonce #description').html(annonce.description);		

		$('#annonce #email').val( $.jStorage.get('email') );

	});
	
}
