function postuler() {
	
	email = $('#email').val();
	
	if(email=='') {
		alert('Veuillez saisir votre email pour postuler !');
	}
	else {
		
		$.jStorage.set('email', email);
		
		id_annonce = $('#annonce #id_annonce').val();
		alert("Vous avez postuler pour l'offre "+id_annonce+" !");
		
	}
	
}
function showAnnonce(id_annonce) {
	/* populate annonce */
	
	$('#annonce').getItem({
		url:'http://bo.v2.batiactuemploi.com/scripts/interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'annonce'
			,id_annonce:id_annonce
		}
	});
	
	$('#annonce #id_annonce').val( id_annonce );
	$('#annonce #email').val( $.jStorage.get('email') );
	
}
