var prevP=0,nextP=0;


function _validateEmail(sEmail) {

	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; 
	
	if (filter.test(sEmail)) { 
		return true; 
	} 
	else { 
		return false; 
	}
}	
function postuler() {
	
	email = $('#email').val();
	
	
	if(!$('#formpopup_Postuler').valid()){
		$('#waiting_send').popup('close');
		return false;
	}
	
	if ($.trim(email).length == 0 || !_validateEmail(email) ) {
		//alert('Veuillez saisir votre email pour postuler !');
		//$('#formpopup_Postuler #email').after('<label class="error">Veuillez entrer un email valide, merci.</label>') 
		$('#waiting_send').popup('close');							    
		return false;
	}
	else {
		$('#popupPostuler').popup('close');		
		//if($('#formpopup_Postuler #email label.error'))$('#formpopup_Postuler #email label.error').remove(); 
				
		id_annonce = $('#annonce #id_annonce').val();
		var subject = $('#annonce #subject').val();
		var message = $('#annonce #message').val();
		//alert("Vous avez postuler pour l'offre "+id_annonce+" !");
		//SaveEmail();
		//$.jStorage.flush();
		$.jStorage.set('email', email);
		$.jStorage.reInit();
		notify('envoi en cours... patientez...', '#annonce');
		$.mobile.loading( 'show' );
		$.ajax({
			 	url:DIRSCRIPTS+'interface-mobile.php'
				,data: {
					jsonp : 1
					,put:'candidate-annonce'
					,id:id_annonce
					,email:email
					,subject:subject
					,message:message
				}
				,dataType:'jsonp'
			 	,async : true
			 	,success:function(rep) {

					$.mobile.loading( 'hide' );	
					if(rep=="OK"){
					    var msg = 'Cette annonce a bien été envoyée à '+email;												
						$('#waiting_send').popup('close');
						$('#confirm_send').popup('open');
												    
					}else{
						var msg = 'Une erreur est survenue!';
						$('#waiting_send').popup('close');
						$('#error_send').popup('open');					
					}				
					remove_notify("#annonce");				        
					//notify(msg, '#annonce');
 
			 	}
			 	,error:function() {
			 		$.mobile.loading( 'hide' );
			 	}
			 });
		//$('#annonce').page();
        //$('#annonce').trigger('pagebeforecreate').trigger('pagecreate').page();	 
	}
	return true;
}


function showAnnonce(urlObj, options) {
	/* populate annonce */

	var id_annonce = urlObj.hash.replace( /.*id=/, "" );
	
	var nb = search_list_id.length;
	
	var current_ind = search_list_id.indexOf(id_annonce.toString());
	prevP = current_ind>0?search_list_id[current_ind-1]:null;
	nextP = current_ind<nb-1?search_list_id[current_ind+1]:null;
	
	
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
	
    //var $header = $page.children( ":jqmData(role=header)" );

	//$header.find( "h1" ).text( 'Détails de l\'offre' );
	
	//$page.page();
            
	options.dataUrl = urlObj.href;

    $.mobile.changePage( $page, options );
    
	//$page.page()
	//$page.trigger('pagecreate');	
	//$page.trigger('create');
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
