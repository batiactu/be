var DIRHTTP = 'http://www.batiactuemploi.com/';
var DIRSCRIPTS = 'http://bo.v2.batiactuemploi.com/scripts/';
//var DIRHTTP = 'http://local.www2012.batiactuemploi.com/';
//var DIRSCRIPTS = 'http://local.back2012.batiactuemploi.com/scripts/';

var pageinit = false;

var back_popup_hash = "";
var use_infinite = true;

var Tfonctions_search = new Array;
var Tregions_search = new Array;
var Texperiences_search = new Array;
var Tcontrats_search = new Array;

var Tregions = new Array;
var Tdepts = new Array;
var Tfonctions = new Array;
var Texperiences = new Array;
var Tcontrats = new Array;

var Limit_Annonce = 200;
var Limit_Recherche = 50;

var nb_results_by_page = 20;

var current_zonegeo = new Array;
var current_fonction = new Array;
var current_metier = new Array;
var current_experience = new Array;
var current_contrat = new Array;
var current_motclef = '';

var hash_searh_selected_to_del = '';

var current_nb_annonce = 0;
var last_search = new Object(); 

var search_list_id = new Array;
var nb_annonce = 2200;
var nb_annonce_cent_inf = (nb_annonce - nb_annonce%100);

tsearchs = new Object();

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
    var pages = Math.ceil(current_nb_annonce / nb_results_by_page);
	
	var current_page =  Math.floor(current / nb_results_by_page);
	
	if(current_page<pages){	
		$('#recherche #pagin-next').show();
		$('#recherche #pagin-next').removeClass('ui-disabled');
		
	}else{
		$('#recherche #pagin-next').hide();	
		$('#recherche #pagin-next').addClass('ui-disabled');
		
	}

	if(current_page>1){	
		$('#recherche #pagin-prev').show();
		$('#recherche #pagin-prev').removeClass('ui-disabled');
		
	}else{
		$('#recherche #pagin-prev').hide();	
		$('#recherche #pagin-prev').addClass('ui-disabled');
		
	}

	$('#recherche #pagin-pages').html(current_page+"/"+pages);
	
	$('#recherche .ui-select').css('display','none');
	
	$("#recherche #select-page").html('');
	
	$("#recherche #select-page").append('<option value="0">Aller à la page</option>');
	for(i=1; i<=pages;i++){
		if(i != current_page)$("#recherche #select-page").append('<option value="'+i+'">page '+i+'</option>');
	}

	if(pages>1){
		$("#recherche #select-page").selectmenu('refresh', true);
		$('#recherche .ui-select').css('display','inline');
		$("#recherche #pagin-pages").css('display','inline');
	}

}		
function uncheck_cac(type,el){
	window['current_'+type]=new Array;
	
	$('.check'+type).each(function(){
		if(this.id!=el.attr('id')){
			$(this).prop('checked', false);
		}		
		$(this).checkboxradio().checkboxradio("refresh");
	});
	if(el.prop('checked'))window['current_'+type].push(el.attr('value'));
}

function view_list_mes_recherches(){
	$('#resultat-mes-recherches').completeListMesRecherches({});	
}


function reset_search(gotodetail){

	current_zonegeo = new Array;
	current_fonction = new Array;
	current_metier = new Array;
	current_experience = new Array;
	current_contrat = new Array;
	current_motclef = '';
	
	current_nb_annonce = 0;
	
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
	
	criteres_last_search['current_motclef'] = current_motclef;
	
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
	
	current_search['current_motclef'] = current_motclef;
	
	var current_hash = convert_array_to_hash(current_search);
	
	if(tsearchs.hasOwnProperty(current_hash)){
		//notify('Cette recherche existe déjà dans vos sauvegardes!', '#recherche');
		$('#popupAlreadyExistsSaveSearch').popup('open');
	}else{
		tsearchs[current_hash]=current_search;
		$.jStorage.set('tsearchs',tsearchs);
		//notify('Cette recherche a été sauvegardée avec succès', '#recherche');
		$('#popupSaveSearch').popup('open');
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
    var hash = 0, i, chain;
    nb = this.length;
    if (nb == 0) return hash;
    for (i = 0, l = nb; i < l; i++) {
        chain  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+chain;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
function gotosearch(hash){
	if(load_searh_from_hash(hash)){
		go_url_recherche();
		return false;		
	}
	else{
		alert('erreur');
		return false;
	}
} 
function select_del_search_from_hash(hsh){
	hash_search_selected_to_del = hsh;
	$('#confirmDeleteSearch').popup();
	$('#confirmDeleteSearch').popup('open', {history: false});
}
function candel_del_search(){
	hash_search_selected_to_del = '';
}
function del_searh_from_hash(current_hash){
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs= new Object();
	
	if(tsearchs.hasOwnProperty(current_hash)){
		notify('Suppression...', '#mes-recherches');
		delete tsearchs[current_hash];
		$.jStorage.set('tsearchs',tsearchs);
    	$('#mes-recherches #resultat-mesrecherches').hide();
		view_list_mes_recherches();
		$('#mes-recherches #resultat-mesrecherches').show();
	    $('#mes-recherches').trigger('create');	    
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
	
	set_fields_from_current();
	
	return true;
}
function set_fields_from_current(){

	$('[id^=selected-detail-page-]').html('');
	
	
	$.each(current_zonegeo,function(i) {
		value = current_zonegeo[i];
		var type = 'zonegeo';
		$('[cac_type='+type+'][value='+value+']').attr('id');     
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		var lib = get_value_by_key(Tregions,value);
		$('#selected-detail-page-'+type).html(lib);
	});	
	
	$.each(current_fonction,function(i) {
		value = current_fonction[i];
		var type = 'fonction';                                             
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		var lib = get_value_by_key(Tfonctions,value);
		$('#selected-detail-page-'+type).html(lib);
	});		
	
	$.each(current_contrat,function(i) {
		value = current_contrat[i];
		var type = 'contrat';         
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		var lib = get_value_by_key(Tcontrats,value);
		$('#selected-detail-page-'+type).html(lib);
	});	
	
	$.each(current_experience,function(i) {
		value = current_experience[i];
		var type = 'experience';
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		var lib = get_value_by_key(Texperiences,value);
		$('#selected-detail-page-'+type).html(lib);
	});	

	$('#recherche-detail-mot-clef').val(current_motclef);
}
function get_current_search_wreport(lib){
	if(typeof(lib)=='undefined' || lib==null || lib==undefined){
	  	lib = 0;
	}
  
	var content_criteres_lib_wrp = '';
	var content_criteres_code_wrp = '';
	var type = 'zonegeo';	

	content_criteres_code_wrp+= type + ' : ' + current_zonegeo.join(',') + '\
	';		
	content_criteres_lib_wrp += type + ' : ';
	var i = 0;	
	$.each(current_zonegeo,function(j) {
		value = current_zonegeo[j];
		if(i>0)content_criteres_lib_wrp +=',';
		content_criteres_lib_wrp += get_value_by_key(Tregions,value);
		i++;
	});
    content_criteres_lib_wrp += '\
	';

	type = 'fonction';
	content_criteres_code_wrp+= type + ' : ' + current_fonction.join(',') + '\
	';		
	content_criteres_lib_wrp += type + ' : ';
	i = 0;
	$.each(current_fonction,function(j) {
		value = current_fonction[j];
		if(i>0)content_criteres_lib_wrp +=',';
		content_criteres_lib_wrp +=get_value_by_key(Tfonctions,value);
		i++;
	});		
    content_criteres_lib_wrp += '\
	';
	
    
	type = 'contrat';
	content_criteres_code_wrp+= type + ' : ' + current_contrat.join(',') + '\
	';		
	content_criteres_lib_wrp += type + ' : ';
	i = 0;
	$.each(current_contrat,function(j) {
		value = current_contrat[j];
		if(i>0)content_criteres_lib_wrp +=',';
		content_criteres_lib_wrp +=get_value_by_key(Tcontrats,value);
		i++;
	});	
    content_criteres_lib_wrp += '\
	';
    
	
	type = 'experience';
	content_criteres_code_wrp+= type + ' : ' + current_experience.join(',') + '\
	';		
	content_criteres_lib_wrp += type + ' : ';
	i = 0;
	$.each(current_experience,function(j) {
		value = current_experience[j];
		if(i>0)content_criteres_lib_wrp +=',';
		content_criteres_lib_wrp +=get_value_by_key(Texperiences,value);
		i++;
	});	
    content_criteres_lib_wrp += '\
	';
    
	type = 'motclef';
    content_criteres_code_wrp+= type + ' : ' + current_motclef + '\
	';		
	content_criteres_lib_wrp += type + ' : ' + current_motclef + '\
	';
	
	if(lib)return content_criteres_lib_wrp;
	else return content_criteres_code_wrp; 
}
function get_value_by_key(tab,key){
	return (tab[key]=== undefined)?'':tab[key];	
}
function load_last_searh(){
	reset_search(true);

	criteres_last_search = $.jStorage.get('last_search');

	$.each(criteres_last_search,function(key, value) {
		window[key]=value;	
	});	
	
	set_fields_from_current();
	
}
function init_global(){
	
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
			,get:'nb_annonce'
		}
		,dataType:'jsonp'
		,async :false
		,cache :false
		,success:function(ret) {			
				nb_annonce = ret['nb'];
				nb_annonce_cent_inf = (nb_annonce - nb_annonce%100);
				$("#nbannonce_cent_inf").text(nb_annonce_cent_inf);
			}
		,error:function(ret) {						
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
		Tfonctions = new Array;
		var k=0;
		for(item in data) {
     			
     			//for(fonction in data[parent]["fonction"]) {
     			for(fonction in data[item]["fonction"]) {
		
	     			label = data[item]["fonction"][fonction];	     
     				Tfonctions_search.push({
     					'item_value': fonction
     					,'item_label':label
     					,'item_index':k
     					,'type':'fonction'
     				});
     				Tfonctions[fonction]=label;
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

	load_experiences();

    initSearch();

	return true;
}
function initSearch() {

	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs = new Object();
	search_list_id = new Array;
	
	criteres_last_search = $.jStorage.get('last_search');
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
		Tcontrats_search = new Array;
		Tcontrats = new Array;
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tcontrats_search.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     					,'type':'contrat'
     				});
     			Tcontrats[code]=label;	
     				

     		k++;		
     	}
		$('#recherche-detail-contrat').html(template(Tcontrats_search));

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
		,async :false
		,cache:false
	}).done(function(data) {
		
		var template = Handlebars.compile($('#recherche-detail-tpl').html());
		Texperiences_search = new Array;
		Texperiences = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Texperiences_search.push({
     					'item_value': code
     					,'item_label':label
     					,'item_index':k
     					,'type':'experience'
     				});
     			Texperiences[code]=label;	
     			
     			
     		k++;		
     	}
		$('#recherche-detail-experience').html(template(Texperiences_search));

	});
}
function launchSearch(advanceMode,gotopage_n) {

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
	
	current_motclef=$('[id=recherche-detail-mot-clef]').val();
	
	
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
	$content.find( ".btn_display1" ).css('display','none');
	$content.find( ".btn_display2" ).css('display','none');
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
    
    if(!use_infinite)launchSearch(1,1);
   
	$page.page();

	options.dataUrl = urlObj.href;

    $.mobile.changePage( $page, options );
    
     if(options.noLoading==null) $.mobile.loading( 'show' );
    
	
}

function check_params(){
	save_current_criteres();
	if(current_fonction.length>0){
		go_url_recherche();
	}else{
		$('[href=#recherche-detail-page-fonction] > h2').addClass('border_red');
		$('#fonctionrequired').popup('open',{history:false});
	}
}

function go_url_recherche(){
	
	var $content = $('#recherche').children( ":jqmData(role=content)" );
	$content.find( "#resultat-recherche").html("");
		
	$content.find( "#nb_results" ).html("<br />");	
	$content.find( "#pagin-prev" ).css('display','none');
	$content.find( "#pagin-next" ).css('display','none');
	$content.find( "#pagin-pages" ).css('display','none');	
	$( "#select-page" ).parents('.ui-select').css('display', 'none');
	$content.find( ".btn_display1" ).css('display','none');
	$content.find( ".btn_display2" ).css('display','none'); 
	$('#recherche #next').addClass('displaynone');

	//l'url est créée dynamiquement
	newurl = '#recherche' + '?zone=' + current_zonegeo.join('-')+'&fct='+  current_experience.join('-')+  current_contrat.join('-')+  current_fonction.join('-')+'&motclef='+ current_motclef;
    
	$.mobile.changePage( newurl);
  	
	return true; 
}


function save_current_criteres(){

	if($('.checkzonegeo').lenght>0){
		current_zonegeo = new Array;
		$('.checkzonegeo').each(function(i) {
				if($(this).prop('checked')){
					current_zonegeo.push($(this).val());
				}
			});	
	}
	
	if($('.checkfonction').lenght>0){	
	current_fonction = new Array;	
	$('.checkfonction').each(function(i) {
			if($(this).prop('checked')){
				current_fonction.push($(this).val());
			}
		});	
	}
	
	if($('.checkcontrat').lenght>0){	
		current_contrat = new Array;	
		$('.checkcontrat').each(function(i) {			
			if($(this).prop('checked')){
				current_contrat.push($(this).val());
			}
		});	
	}	
	
	//if($('.checkmetier').lenght>0){
	//	$('.checkmetier').each(function(i) {
		
	//		if($(this).is(':checked')) {
	//			if(metier!='')metier+='|';
	//			metier+=$(this).val();
	//		}
	//	});
	//}
	if($('.checkexperience').lenght>0){
		current_experience = new Array;		
		$('.checkexperience').each(function(i) {
			if($(this).prop('checked')){
				current_experience.push($(this).val());
			}
		});
	}	
	
	current_motclef=$('[id=recherche-detail-mot-clef]').val();
			
	return false;		
} 