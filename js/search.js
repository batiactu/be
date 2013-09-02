var DIRSCRIPTS = 'http://bo.v2.batiactuemploi.com/scripts/';
//var DIRSCRIPTS = 'http://local.back2012.batiactuemploi.com/scripts/';

var back_popup_hash = "";
var use_infinite = false;

var Tfonctions_search = new Array;
var Tregions_search = new Array;
var Tcontrats_search = new Array;

var Tregions = new Array;
var Tdepts = new Array;

var Limit_Annonce = 200;
var Limit_Recherche = 50;

var nb_results_by_page = 20;

var current_zonegeo = new Array;
var current_fonction = new Array;
var current_metier = new Array;
var current_experience = new Array;
var current_contrat = new Array;

var current_nb_annonce = 0;
var last_search = new Object(); 

var tsearchs = new Object();

var notify = function(message, page, time) {
	var $message = $('<p style="display:none;">' + message + '</p>');

	$(page+' .notifications').each(function(){	  
	if(time==null)time=3000;

	$(this).append($message);
		//$message.show();
		$message.slideDown(300, function() {
			window.setTimeout(function() {
				$message.slideUp(300, function() {            
					$message.remove();
				});
				}, time);
		});
	});
};
var remove_notify = function(page) {
  $(page+' .notifications').find('p').remove();
};


function pagination(current){
    
	if((current+nb_results_by_page)<=current_nb_annonce){		
		$('#recherche #pagin-next').show();
		$('#recherche #pagin-next').removeClass('ui-disabled');
		
	}else{
		$('#recherche #pagin-next').hide();	
		$('#recherche #pagin-next').addClass('ui-disabled');
		
	}
	if((current)>nb_results_by_page){		
		$('#recherche #pagin-prev').show();
		$('#recherche #pagin-prev').removeClass('ui-disabled');
		
	}else{
		$('#recherche #pagin-prev').hide();	
		$('#recherche #pagin-prev').addClass('ui-disabled');
		
	}
	var pages = Math.floor(current_nb_annonce / nb_results_by_page);
	
	var current_page =  Math.floor(current / nb_results_by_page);

	$('#recherche #pagin-pages').html(current_page+"/"+pages);
	
	$('#recherche .ui-select').css('display','none');
	
	$("#recherche #select-page").html('');
	
	$("#recherche #select-page").append('<option value="0">Aller à la page</option>');
	for(i=1; i<=pages;i++){
		if(i != current_page)$("#recherche #select-page").append('<option value="'+i+'">page '+i+'</option>');
	}
	//$("#recherche #select-page").trigger("change");
	
	$("#recherche #select-page").selectmenu('refresh', true);
	$('#recherche .ui-select').css('display','inline');
	$("#recherche #pagin-pages").css('display','inline');

}		
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

function view_list_mes_recherches(){
	$('#resultat-mes-recherches').completeListMesRecherches({});	
}


function reset_search(gotodetail){
	var current_zonegeo = new Array;
	var current_fonction = new Array;
	var current_metier = new Array;
	var current_experience = new Array;
	var current_contrat = new Array;
	
	var current_nb_annonce = 0;
	
	$('[id^=selected-detail-page-]').text('');
	$('[id=recherche-detail-mot-clef]').val('');
	$('.check_cac').each(function(){
		$(this).prop('checked', false);		
		$(this).checkboxradio().checkboxradio("refresh");
	});

	if(gotodetail)$.mobile.changePage('#recherche-detail');
}
function saved_last_search(){

	criteres_last_search = new Object(); 

	criteres_last_search['current_zonegeo'] = current_zonegeo;

	criteres_last_search['current_fonction'] = current_fonction;

	criteres_last_search['current_experience'] = current_experience;

	criteres_last_search['current_contrat'] = current_contrat;
	
	criteres_last_search['current_motclef'] = $('[id=recherche-detail-mot-clef]').val();
	
	$.jStorage.set('last_search',criteres_last_search);		
}
function saved_search(){
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs= new Object();
	
	var current_search = new Object(); 

	current_search['current_zonegeo'] = current_zonegeo;

	current_search['current_fonction'] = current_fonction;

	current_search['current_experience'] = current_experience;

	current_search['current_contrat'] = current_contrat;
	
	current_search['current_motclef'] = $('[id=recherche-detail-mot-clef]').val();
	
	var current_hash = convert_array_to_hash(current_search);
	
	if(tsearchs.hasOwnProperty(current_hash)){
		notify('Cette recherche existe déjà dans vos sauvegardes!', '#recherche');
	}else{
		tsearchs[current_hash]=current_search;
		$.jStorage.set('tsearchs',tsearchs);
		notify('Cette recherche a été sauvegardée avec succès', '#recherche');
	}
	
	
}

function convert_array_to_hash(array_object){ 
	var Tstr = [];
	$.each(array_object, function(i,v) {                   
	     var str = i + ":" + v;
	     Tstr.push(str);
	});
	var str = Tstr.join(", ");
	return str.hashCode();
}

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    nb = this.length;
    if (nb == 0) return hash;
    for (i = 0, l = nb; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
function gotosearch(hash){
	if(load_searh_from_hash(hash)){
		save_current_criteres();
		go_url_recherche();
		return false;		
	}
	else{
		alert('erreur');
		return false;
	}
} 
function del_searh_from_hash(current_hash){
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs= new Object();
	
	if(tsearchs.hasOwnProperty(current_hash)){
		notify('Suppression...', '#mes-recherches');
		delete tsearchs[current_hash];
		$.jStorage.set('tsearchs',tsearchs);
		//$('#mes-recherches').page().trigger('pagecreate');
		$.mobile.changePage( "#mes-recherches" );		
		return true;
	}else{		
		notify('Erreur, ce hash ne correspond pas!', '#mes-recherches');
		return false;
	}
}
function load_searh_from_hash(current_hash){
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs= new Object();
	
	if(tsearchs.hasOwnProperty(current_hash)){
		notify('Rechargement', '#mes-recherches');
	}else{		
		notify('Erreur, ce hash ne correspond pas!', '#mes-recherches');
		return false;
	}
	
	reset_search();


    criteres_search_current_hash = tsearchs[current_hash];
	
	
	$.each(criteres_search_current_hash,function(key, value) {
		window[key]=value;	
	});	
	
	$.each(current_zonegeo,function(i) {
		value = current_zonegeo[i];
		var type = 'zonegeo';
		$('[cac_type='+type+'][value='+value+']').attr('id');
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value="'+value+'"]').parent().find('label').text()));
	});	
	
	$.each(current_fonction,function(i) {
		value = current_fonction[i];
		var type = 'fonction';
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value='+value+']').parent().find('label').text()));
	});		
	
	$.each(current_contrat,function(i) {
		value = current_contrat[i];
		var type = 'contrat';
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value='+value+']').parent().find('label').text()));
	});	
	
	$.each(current_experience,function(i) {
		value = current_experience[i];
		var type = 'experience';
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value='+value+']').parent().find('label').text()));
	});	
	$('[id=recherche-detail-mot-clef]').val(criteres_search_current_hash['current_motclef']);
	
	return true;
}
function load_last_searh(){
	reset_search(true);
	//alert($.jStorage.index());
	//alert($.jStorage.storageSize());
	
	criteres_last_search = $.jStorage.get('last_search');
	
	//alert(criteres_last_search);
	//if(!jQuery.isArray( criteres_last_search ))criteres_last_search = new Object();
	
	$.each(criteres_last_search,function(key, value) {
		window[key]=value;	
	});	
	
	$.each(current_zonegeo,function(i) {
		value = current_zonegeo[i];
		var type = 'zonegeo';
		$('[cac_type='+type+'][value='+value+']').attr('id');
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value="'+value+'"]').parent().find('label').text()));
	});	
	
	$.each(current_fonction,function(i) {
		value = current_fonction[i];
		var type = 'fonction';
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value='+value+']').parent().find('label').text()));
	});		
	
	//$.each(current_contrat,function(i) {
	//	value = current_contrat[i];
	//	var type = 'contrat';
	//	$('[cac_type='+type+'][value='+value+']').prop('checked', true);
	//	$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
	//	$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value='+value+']').parent().find('label').text()));
	//});	
	
	//$.each(current_experience,function(i) {
	//	value = current_experience[i];
	//	var type = 'experience';
	//	$('[cac_type='+type+'][value='+value+']').prop('checked', true);
	//	$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
	//	$('#selected-detail-page-'+type).html(($('[cac_type='+type+'][value='+value+']').parent().find('label').text()));
	//});	
	$('[id=recherche-detail-mot-clef]').val(criteres_last_search['current_motclef']);
	
}
function init_global(){
	//alert('init');

	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'zone-geo'
		}
		,dataType:'jsonp'
		,async :false
		,cache :false
	}).done(function(data) {
		/*
		 * Init zone geo détail
		 */		
		Tregions_search = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tregions_search.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     					,'type':'zonegeo'
     				});
     			Tregions[code]=label;	

     			
     		k++;		
     	}	
	});

	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'fonction'
		}
		,dataType:'jsonp'
		,async :false
		,cache :false
	}).done(function(data) {
		
		Tfonctions_search = new Array;
		var k=0;
		for(parent in data) {
     			
     			//for(fonction in data[parent]["fonction"]) {
     			for(fonction in data[parent]["fonction"]) {
		
	     			label = data[parent]["fonction"][fonction];
					 	     
     				Tfonctions_search.push({
     					'item_value': fonction
     					,'item_label':label
     					,'item_index':k
     					,'type':'fonction'
     				});
     				
	         		k++;		
     			}
     			
     	}
	});
	
	$.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'dept'
		}
		,dataType:'jsonp'
		,async :false
		,cache :false
	}).done(function(data) {
		/*
		 * Init zone geo détail
		 */
		
		Tdepts = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tdepts[code]=label;
     			
     		k++;		
     	}

	});

    load_contrats();

	//load_experiences();

}
function initSearch() {

	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs = new Object();
	
	
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
		,async :false
		,cache:false
	}).done(function(data) {
		
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		var Tab = new Array;
		Tcontrats_search = new Array;
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tab.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     					,'type':'contrat'
     				});
     			Tcontrats_search[code]=label;	
     				

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
function launchSearch(advanceMode,gotopage_n) {
	//$('#resultat-recherche').hide();

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
	
	if(gotopage_n){
	    var currentlength = (gotopage_n-1) * nb_results_by_page; 
		var nextlength = currentlength + nb_results_by_page;
	}else{
		var currentlength = parseInt($('#recherche #next').attr('data-next'));
		var nextlength = currentlength + nb_results_by_page;
	}
	
	
	if(currentlength > Limit_Annonce){
		$('#recherche #next').attr('data-next',currentlength);	
		nextlength = Limit_Annonce;
	}else if(currentlength > current_nb_annonce){
		$('#recherche #next').attr('data-next',currentlength);	
		nextlength = current_nb_annonce;
	}else{
	    $('#recherche #next').attr('data-next',nextlength);	
	}	
		
	
	//$('#resultat-recherche').html('');
	//var $header = $('#recherche').children( ":jqmData(role=header)" );		
	//$header.find( "h1" ).text('');
	var $content = $('#recherche').children( ":jqmData(role=content)" );		
	$content.find( "#nb_results" ).html("<br />");	
	$content.find( "#pagin-prev" ).css('display','none');
	$content.find( "#pagin-next" ).css('display','none');
	$content.find( "#pagin-pages" ).css('display','none');	
	$( "#select-page" ).parents('.ui-select').css('display', 'none');
	$content.find( ".btn_display" ).css('display','none');
	//$('#resultat-recherche').hide();
		
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
	if(use_infinite){	
		$('#resultat-recherche').show();
	}	
	saved_last_search();
				 
	return false;
}
function execute_search(urlObj, options){
    var pageSelector = urlObj.hash.replace( /\?.*$/, "" );

    var $page = $( pageSelector );
    
    if(!use_infinite)launchSearch(1);
   
	$page.page();

	options.dataUrl = urlObj.href;

    $.mobile.changePage( $page, options );
    
     if(options.noLoading==null) $.mobile.loading( 'show' );
    
	
}

function go_url_recherche(){
	var $content = $('#recherche').children( ":jqmData(role=content)" );
	$content.find( "#resultat-recherche").html("");
	
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
	
	$('.checkcontrat').each(function(i) {
		
		if($(this).is(':checked')) {
			if(contrat!='')contrat+='|';
			contrat+=$(this).val();
		}
	});	
		
	
	
	//$('.checkmetier').each(function(i) {
		
	//	if($(this).is(':checked')) {
	//		if(metier!='')metier+='|';
	//		metier+=$(this).val();
	//	}
	//});
		
	$('.checkexperience').each(function(i) {
		if($(this).is(':checked')) {
			if(experience!='')experience+='|';
			experience+=$(this).val();
		}
	});	
			
	return false;		
}