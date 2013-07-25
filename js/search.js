//var DIRSCRIPTS = 'http://bo.v2.batiactuemploi.com/scripts/';
var DIRSCRIPTS = 'http://local.back2012.batiactuemploi.com/scripts/';

var Limit_Annonce = 200;
var nb_results_by_page = 30;

var current_zonegeo = new Array;
var current_fonction = new Array;
var current_metier = new Array;
var current_experience = new Array;
var current_contrat = new Array;

var current_nb_annonce = 0;
	
function uncheck_cac(type,el){
	$('.check'+type).each(function(){
		if(this.id!=el.attr('id')){
			$(this).prop('checked', false);
		}		
		$(this).checkboxradio().checkboxradio("refresh");
	});
	if(el.prop('checked')) $('#selected-detail-page-'+type).html((el.parent().find('label').text()));
	else $('#selected-detail-page-'+type).html('');
}
function reset_search(){
	var current_zonegeo = new Array;
	var current_fonction = new Array;
	var current_metier = new Array;
	var current_experience = new Array;
	var current_contrat = new Array;
	
	var current_nb_annonce = 0;
	
	$('[id^=selected-detail-page-]').text('');
	$('[id=recherche-detail-mot-clef]').val('');
	
	$.mobile.changePage('#recherche-detail');
}
function initSearch() {
	
	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
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
     					,'type':'zonegeo'
     				});
     				
     			
     			
     		k++;		
     	}
		$('#recherche-detail-zonegeo').html(template(Tab));
        

	});


	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'fonction'
		}
		,dataType:'jsonp'
		,cache:false
	}).done(function(data) {
		
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		var Tab = new Array;
		var k=0;
		for(parent in data) {
     			
     			//for(fonction in data[parent]["fonction"]) {
     			for(fonction in data[parent]["fonction"]) {
		
	     			label = data[parent]["fonction"][fonction];
					 	     
     				Tab.push({
     					'item_value': fonction
     					,'item_label':label
     					,'item_index':k
     					,'type':'fonction'
     				});
     				
	         		k++;		
     			}
     			
     	}

 		$('#recherche-detail-fonction').html(template(Tab));


	});
	
	//load_contrats();

	//load_experiences();
	
	search_list_id = new Array;
	
}

function load_contrats(){
	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'contrat'
		}
		,dataType:'jsonp'
		,cache:false
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
     					,'type':'contrat'
     				});
     				
     			
     			
     		k++;		
     	}
		$('#recherche-detail-contrat').html(template(Tab));

	});
}

function load_experiences(){
	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'experience'
		}
		,dataType:'jsonp'
		,cache:false
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
     					,'type':'experience'
     				});
     				
     			
     			
     		k++;		
     	}
		$('#recherche-detail-experience').html(template(Tab));

	});
}
function launchSearch(advanceMode) {
	
	search_list_id = new Array;
	
	if(advanceMode==null)advanceMode=false;
	
	
	var mot = $('#recherche-detail-mot-clef').val();
	

	var fonction = '';
	var metier = '';
	var experience = '';
	var contrat = '';
	var zonegeo = '';
	
	if(advanceMode) {
	
		
		$.each(current_zonegeo,function(i) {
			if(zonegeo!='')zonegeo+='|';
			zonegeo+=this;
		});	
		
		$.each(current_fonction,function(i) {
			if(fonction!='')fonction+='|';
			fonction+=this;
		});			
			
	}
	else {
		var zonegeo = $('#accueil #zone-geo').val();
	}
	
	
	var currentlength = parseInt($('#recherche #next').attr('data-next'));
	var nextlength = currentlength + nb_results_by_page;
	if(currentlength > Limit_Annonce){
		$('#recherche #next').attr('data-next',currentlength);	
		nextlength = Limit_Annonce;
	}else if(currentlength > current_nb_annonce){
		$('#recherche #next').attr('data-next',currentlength);	
		nextlength = current_nb_annonce;
	}else{
	    $('#recherche #next').attr('data-next',nextlength);	
	}	
		
	
	$('#resultat-recherche').html('');
	var $header = $('#recherche').children( ":jqmData(role=header)" );		
	$header.find( "h1" ).text('');
	$('#resultat-recherche').show();
	//$('#recherche #next').attr('data-next',0);
				
	$('#resultat-recherche').completeListItem({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data:{
			get:'search'
			,jsonp:1
			,mot:mot
			,zonegeo:zonegeo
			,fonction:fonction
			,metier:metier
			,experience:experience
			,contrat:contrat
			,length:nextlength
		}
	});			
			 	
			 
			 
	return false;
}
function execute_search(urlObj, options){
    var pageSelector = urlObj.hash.replace( /\?.*$/, "" );

    var $page = $( pageSelector );

   	launchSearch(1);
   
	$page.page();

	options.dataUrl = urlObj.href;
	
    $.mobile.changePage( $page, options );
    
}
function go_url_recherche(t){
	//l'url est créée dynamiquement
	newurl = '#recherche' + '?zone=' + current_zonegeo.join('-')+'&fct='+  current_fonction.join('-');
	$.mobile.changePage( newurl);
    
	return true; 
}
function save_current_criteres(){
	
	current_zonegeo = new Array;
	$('.checkzonegeo').each(function(i) {
			
			if($(this).is(':checked')) {
				//if(zonegeo!='')zonegeo+='|';
				//zonegeo+=$(this).val();
				current_zonegeo.push($(this).val());
			}
		});	
	
	current_fonction = new Array;	
	$('.checkfonction').each(function(i) {
			
			if($(this).is(':checked')) {
				//if(fonction!='')fonction+='|';
				//fonction+=$(this).val();
				current_fonction.push($(this).val());
			}
		});	
	
	//$('.checkcontrat').each(function(i) {
		
	//	if($(this).is(':checked')) {
	//		if(contrat!='')contrat+='|';
	//		contrat+=$(this).val();
	//	}
	//});	
		
	
	
	//$('.checkmetier').each(function(i) {
		
	//	if($(this).is(':checked')) {
	//		if(metier!='')metier+='|';
	//		metier+=$(this).val();
	//	}
	//});
		
	//$('.checkexperience').each(function(i) {
		
	//	if($(this).is(':checked')) {
	//		if(experience!='')experience+='|';
	//		experience+=$(this).val();
	//	}
	//});	
			
	return false;		
}