function postuler() {
	
	email = $('#email').val();
	
	if(email=='') {
		alert('Veuillez saisir votre email pour postuler !');
	}
	else {
		
				
		id_annonce = $('#annonce #id_annonce').val();
		//alert("Vous avez postuler pour l'offre "+id_annonce+" !");
		//SaveEmail();
		//$.jStorage.flush();
		$.jStorage.set('email', email);
		$.jStorage.reInit();
		notify('envoi en cours... patientez...');
		$.mobile.loading( 'show' );
		$.ajax({
			 	url:DIRSCRIPTS+'interface-mobile.php'
				,data: {
					jsonp : 1
					,put:'candidate-annonce'
					,id:id_annonce
					,email:email
				}
				,dataType:'jsonp'
			 	,async : true
			 	,success:function(rep) {

					$.mobile.loading( 'hide' );	
					if(rep=="OK"){
					    var msg = 'Cette annonce a bien été envoyée à '+email;					    
					}else{
						var msg = 'Une erreur est survenue!';					
					}				
									        
					notify(msg);
			 	}
			 	,error:function() {
			 		$.mobile.loading( 'hide' );
			 	}
			 });
		$('#annonce').page();	 
	}
	
}


function showAnnonce(urlObj, options) {
	/* populate annonce */

	var id_annonce = urlObj.hash.replace( /.*id=/, "" );
	
	var nb = search_list_id.length;
	
	var current_ind = search_list_id.indexOf(id_annonce.toString());
	var prevP = current_ind>0?search_list_id[current_ind-1]:null;
	var nextP = current_ind<nb-1?search_list_id[current_ind+1]:null;
	
	
	// The pages we use to display our content are already in
    // the DOM. The id of the page we are going to write our
    // content into is specified in the hash before the '?'.
    var pageSelector = urlObj.hash.replace( /\?.*$/, "" );
    
    var $page = $( pageSelector );
    
    $( pageSelector ).getItem({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'annonce'
			,id_annonce:id_annonce
			,PREVIOUS:prevP
			,NEXT:nextP
		}
	});
    $page.page();
    
    var $header = $page.children( ":jqmData(role=header)" );

	$header.find( "h1" ).text( 'Détails annonce '+id_annonce );
	
	$page.page();
	
	options.dataUrl = urlObj.href;

    $.mobile.changePage( $page, options );

}

function _refresh_datas(){ 
	var email = $.jStorage.get('email');
	/*if(!email){
		// if not - load the data from the server
	 	email = load_data_from_server();
	 	// and save it
		$.jStorage.set("email",email);
	}*/
	$('#annonce #email').val( email );
}
