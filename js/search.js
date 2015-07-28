var DIRHTTP = 'http://www.batiactuemploi.com/';
var DIRSCRIPTS = 'http://bo.v2.batiactuemploi.com/scripts/';
//var DIRHTTP = 'http://local.www2012.batiactuemploi.com/';
//var DIRSCRIPTS = 'http://local.back2012.batiactuemploi.com/scripts/';

DIRSCRIPTS = 'http://192.168.3.103/emploibatiactu/backoffice/scripts/';


var pageinit = false;

var back_popup_hash = "";
var use_infinite = true;

var Tfonctions_search = new Array;
var Tmetiers_search = new Array;
var Tregions_search = new Array;
var Tdepts_search = new Array;
var Texperiences_search = new Array;
var Tcontrats_search = new Array;

var Tregions = new Array;
var Tdepts = new Array;
var Tfonctions = new Array;
var Tmetiers = new Array;
var TmetiersCodeId = new Array;
var Texperiences = new Array;
var Tcontrats = new Array;

var Limit_Annonce = 200;
var Limit_Recherche = 50;

var nb_results_by_page = 20;

var current_zonegeo = new Array;
var current_dept = new Array;
var current_fonction = new Array;
var current_metier = new Array;
var current_experience = new Array;
var current_contrat = new Array;
var current_motclef = '';

// version temporaire
var current_zonegeo_tmp = new Array;
var current_dept_tmp = new Array;
var current_fonction_tmp = new Array;
var current_metier_tmp = new Array;
var current_experience_tmp = new Array;
var current_contrat_tmp = new Array;




var hash_searh_selected_to_del = '';

var current_nb_annonce = 0;
var last_search = new Object(); 

var search_list_id = new Array;
var nb_annonce = 2200;
var nb_annonce_cent_inf = (nb_annonce - nb_annonce%100);

tsearchs = new Object();



/**
 * Gestion de notification sur une page
 * @param message
 * @param page
 * @param time
 */
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

/**
 * Suppression des notification d'une page
 * @param page
 */
var remove_notify = function(page) {
  $(page+' .notifications').find('p').remove();
};

/**
 * Pagination
 * @param current
 */
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

/**
 * uncheck_cac
 *   - stocke les choix dans un tableau
 *   - permet de ne selectioner qu'un seul critère à la fois
 * @param type
 * @param el
 */
function uncheck_cac(type,el){
    // on reché le tableau (permet de vider l'ancien élément
	//window['current_'+type]=new Array;

	// desactivation des choix précédant
   /* $('.check'+type).each(function(){
		if(this.id!=el.attr('id')){
			$(this).prop('checked', false);
		}		
		$(this).checkboxradio().checkboxradio("refresh");
	});*/
    // on stocke le choix et on désactive celui qui vient d'etre désactivé (s'il'a été)


	var tabNameTmp =  'current_' + type + '_tmp';

	if(el.prop('checked')) {
        // element selectionné
        window[tabNameTmp].push(el.attr('value'));
    }
    else {
        // element désélectionné
        newTab = new Array;

        $(window[tabNameTmp]).each(function(idx, val) {
            if(val != el.attr('value')) {
                newTab.push(val);
            }
        });

        window[tabNameTmp] = newTab;
    }

}

/**
 * Permet de valider le type de recherche
 *
 * @param type
 */
function validate_cac(type) {

	var tabName = 'current_' + type;
	var tabNameTmp = 'current_' + type + '_tmp';

	var newTabType = new Array;
	$(window[tabNameTmp]).each(function(idx, val) {
		newTabType.push(val);
	});

	window[tabName] = newTabType;
}

function resetTotalCurrent(type) {
	var tabName = 'current_' + type;

	var newTabType = new Array;
	window[tabName] = newTabType;
}


function resetTmp_cac(type) {
	var tabName = 'current_' + type;
	var tabNameTmp = 'current_' + type + '_tmp';

	var newTabType = new Array;
	$(window[tabName]).each(function(idx, val) {
		newTabType.push(val);
	});

	window[tabNameTmp] = newTabType;
}


/**
 * view_list_mes_recherches : gestion des infos affichées dans la page "mes recherche"
 *
 */
function view_list_mes_recherches(){
	$('#resultat-mes-recherches').completeListMesRecherches({});	
}

/**
 * reset_search
 * @param gotodetail
 */
function reset_search(gotodetail){

	current_zonegeo = new Array;
	current_dept = new Array;
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


/**
 * saved_last_search
 */
function saved_last_search(){
	
	criteres_last_search = new Object(); 

	criteres_last_search['current_zonegeo'] = current_zonegeo;
	
	criteres_last_search['current_dept'] = current_dept;	

	criteres_last_search['current_fonction'] = current_fonction;
	
	criteres_last_search['current_metier'] = current_metier;

	criteres_last_search['current_experience'] = current_experience;

	criteres_last_search['current_contrat'] = current_contrat;
	
	criteres_last_search['current_motclef'] = current_motclef;
	
	$.jStorage.set('last_search',criteres_last_search);		
}

/**
 * Creation d'une alerte
 * en fonction de la recherche
 */
function createAlert() {
	var local_current_hash = 0;

	if ((local_current_hash = save_search()) != false) {
		// activation de l'alerte
		switch_alert_from_search('', local_current_hash);
		$('#popupCreateAlert').popup('open');
	}
	else {
		$('#popupAlreadyExistsAlert').popup('open');
	}
}

function save_search() {
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs= new Object();

	var current_search = new Object();

	current_search['current_zonegeo'] = current_zonegeo;
	
	current_search['current_dept'] = current_dept;

	current_search['current_fonction'] = current_fonction;
	
	current_search['current_metier'] = current_metier;

	current_search['current_experience'] = current_experience;

	current_search['current_contrat'] = current_contrat;

	current_search['current_motclef'] = current_motclef;

	var current_hash = convert_array_to_hash(current_search);

	if(tsearchs.hasOwnProperty(current_hash)){
		return false;
	}

	tsearchs[current_hash]=current_search;
	$.jStorage.set('tsearchs',tsearchs);

	return current_hash;
}

/**
 * saved_search
 */
function saved_search(){
	if (save_search() != false) {
		$('#popupSaveSearch').popup('open');
	}
	else {
		$('#popupAlreadyExistsSaveSearch').popup('open');
	}
}

/**
 * convert_array_to_hash
 * @param array_object
 * @returns {*}
 */
function convert_array_to_hash(array_object){ 
	var Tstr = [];
	$.each(array_object, function(i,v) {
        if (i != 'push') {
            // non prise en compte de la clé push dans le hash
            var str = i + ":" + v;
            Tstr.push(str);
        }
	});
	var str = Tstr.join(", ");
	return str.hashCode();
}

/**
 * String.prototype.hashCode
 * @returns {number}
 */
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

/**
 * gotosearch
 * @param hash
 * @returns {boolean}
 */
function gotosearch(hash){
	if(load_searh_from_hash(hash)){
		go_url_recherche();
		return false;		
	}
	else{
		console.log('erreur sur recherche de l\'alerte');
		return false;
	}
}

/**
 * select_del_search_from_hash
 * @param hsh
 */
function select_del_search_from_hash(hsh){


	hash_search_selected_to_del = hsh;
	//$('#confirmDeleteSearch').popup();
	$('#confirmDeleteSearch').popup('open', {history: false});
}

/**
 * candel_del_search
 */
function candel_del_search(){
	hash_search_selected_to_del = '';
}

/**
 * del_searh_from_hash
 * @param current_hash
 * @returns {boolean}
 */
function del_searh_from_hash(current_hash){

	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) tsearchs= new Object();
	if(tsearchs.hasOwnProperty(current_hash)){
		notify('Suppression...', '#mes-recherches');

		// on envoi l'info de desactivation
		if ( is_device ) {
			//batiMP.log('Désactivation alerte hash :' + current_hash , 'DEBUG');
			registerPush(batiMP.getPushToken(), {'put':'supp_push_alert', 'local_hash':current_hash});
		}

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

/**
 * load_searh_from_hash
 * @param current_hash
 * @returns {boolean}
 */
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

/**
 * saved_object_search
 * @param obj
 */
function saved_object_search(obj){

    tsearchs = $.jStorage.get('tsearchs');
    if(!tsearchs) tsearchs= new Object();


    var current_hash = convert_array_to_hash(obj);

    tsearchs[current_hash] = obj;
    $.jStorage.set('tsearchs',tsearchs);

}

/**
 * switch_alert_from_search
 * @param that
 * @param current_hash
 * @returns {*}
 */
function switch_alert_from_search(that, current_hash) {

    var valToReturn = '';

    tsearchs = $.jStorage.get('tsearchs');
    if(!tsearchs) tsearchs= new Object();


    if(! tsearchs.hasOwnProperty(current_hash)){
        notify('Erreur, ce hash ne correspond pas!', '#mes-recherches');
        return false;
    }

    if (typeof tsearchs[current_hash]['push'] != 'undefined' && tsearchs[current_hash]['push'] == true) {
		// desactivation de l'alerte
        tsearchs[current_hash]['push'] = false;
        // on envoi l'info de desactivation
        if ( is_device ) {
            //batiMP.log('Désactivation alerte hash :' + current_hash , 'DEBUG');
            registerPush(batiMP.getPushToken(), {'put':'supp_push_alert', 'local_hash':current_hash});
        }
        valToReturn = 'off';
    }
    else {
        // activation de l'alerte'
        tsearchs[current_hash]['push'] = true;
        // on envoi l'info d'activation

        var alerte = {};

        alerte.fonction = tsearchs[current_hash]['current_fonction'];
        alerte.zonegeo = tsearchs[current_hash]['current_zonegeo'];
        alerte.motclef = tsearchs[current_hash]['current_motclef'];

        if ( is_device ) {
            //batiMP.log('Activation alerte hash :' + current_hash , 'DEBUG');

			// modif pour activer le device (si pas déjà fait) si on active une alerte
			var localToken = batiMP.getPushToken();
			if (localToken == null) {
				// un register device est à faire avant
				batiMP.registerDevice('successHandler', 'errorHandler', 'onNotification');
			}

			registerPush(batiMP.getPushToken(), {'put':'add_push_alert', 'local_hash':current_hash, 'alerte':alerte});
        }
        valToReturn = 'onn';
    }

    saved_object_search( tsearchs[current_hash]);

    return valToReturn;
}

function getInfoAlerte () {
	var valToReturn = [];
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) {
		// rien a faire
		tsearchs= new Object();
		return false;
	}
	$.each(tsearchs, function(idx, val) {
		if (typeof tsearchs[idx]['push'] != 'undefined' && tsearchs[idx]['push'] == true) {
			valToReturn.push(idx);
		}
	});

	return valToReturn;
}

/**
 * active toutes les alertes
 *
 * @returns {boolean}
 */
function activateAlert() {
	var valToReturn = '';
	tsearchs = $.jStorage.get('tsearchs');
	if (!tsearchs) {
		// rien a faire
		tsearchs= new Object();
		return false;
	}

	$.each(tsearchs, function (idx, val) {
		if (typeof tsearchs[idx]['push'] == 'undefined' || tsearchs[idx]['push'] == false) {
			// activation de l'alerte
			tsearchs[idx]['push'] = true;
			// on envoi l'info de desactivation
			if (is_device) {

				var alerte = {};

				alerte.fonction = tsearchs[idx]['current_fonction'];
				alerte.zonegeo = tsearchs[idx]['current_zonegeo'];
				alerte.motclef = tsearchs[idx]['current_motclef'];


				//batiMP.log('Activation alerte hash :' + idx , 'DEBUG');
				registerPush(batiMP.getPushToken(), {'put': 'add_push_alert', 'local_hash': idx, 'alerte':alerte});
			}
		}
	});

	$.mobile.changePage('#mes-recherches', {allowSamePageTransition: true,
		transition: 'none',
		reload:true});
}

/**
 * Desactive toutes les alertes
 *
 * @returns {boolean}
 */
function desactivateAlert() {
	var valToReturn = '';
	tsearchs = $.jStorage.get('tsearchs');
	if(!tsearchs) {
		// rien a faire
		tsearchs= new Object();
		return false;
	}

	$.each(tsearchs, function(idx, val) {
		if (typeof tsearchs[idx]['push'] != 'undefined' && tsearchs[idx]['push'] == true) {
			// desactivation de l'alerte
			tsearchs[idx]['push'] = false;
			// on envoi l'info de desactivation
			if ( is_device ) {
				//batiMP.log('Désactivation alerte hash :' + idx , 'DEBUG');
				registerPush(batiMP.getPushToken(), {'put':'supp_push_alert', 'local_hash':idx});
			}
		}
	});

	$.mobile.changePage('#mes-recherches', {allowSamePageTransition: true,
		transition: 'none',
		reload:true});
}


/**
 * set_fields_from_current
 */
function set_fields_from_current(){

	$('[id^=selected-detail-page-]').html('');

    var lib = '';

	resetTmp_cac('zonegeo');
	$.each(current_zonegeo,function(i) {
		value = current_zonegeo[i];
		var type = 'zonegeo';
		$('[cac_type='+type+'][value='+value+']').attr('id');     
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		lib += get_value_by_key(Tregions,value);
		$('#selected-detail-page-'+type).html(lib);
        lib += '<br>';
	});

    lib = '';
	resetTmp_cac('fonction');
	$.each(current_fonction,function(i) {
		value = current_fonction[i];
		var type = 'fonction';                                             
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		lib += get_value_by_key(Tfonctions,value);
		$('#selected-detail-page-'+type).html(lib);
        lib += '<br>';
	});
	/*
    lib = '';
	resetTmp_cac('metier');
	$.each(current_metier,function(i) {
		value = current_metier[i];
		var type = 'metier';                                             
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		lib += get_value_by_key(Tmetiers,value);
		$('#selected-detail-page-'+type).html(lib);
        lib += '<br>';
	});
	*/

    lib = '';
	$.each(current_contrat,function(i) {
		value = current_contrat[i];
		var type = 'contrat';         
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		lib += get_value_by_key(Tcontrats,value);
		$('#selected-detail-page-'+type).html(lib);
        lib += '<br>';
	});

    lib = '';
	$.each(current_experience,function(i) {
		value = current_experience[i];
		var type = 'experience';
		$('[cac_type='+type+'][value='+value+']').attr('id');     		
		$('[cac_type='+type+'][value='+value+']').prop('checked', true);
		$('[cac_type='+type+'][value='+value+']').checkboxradio().checkboxradio("refresh");
		lib += get_value_by_key(Texperiences,value);
		$('#selected-detail-page-'+type).html(lib);
        lib += '<br>';
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
	
	if(current_dept.length>0){
		type = 'dept';
		content_criteres_code_wrp+= type + ' : ' + current_dept.join(',') + '\
		';		
		content_criteres_lib_wrp += type + ' : ';
		i = 0;
		$.each(current_dept,function(j) {
			value = current_dept[j];
			if(i>0)content_criteres_lib_wrp +=',';
			content_criteres_lib_wrp +=get_value_by_key(Tdepts,value);
			i++;
		});		
	    content_criteres_lib_wrp += '\
		';
	}
	
	if(current_metier.length>0){
		type = 'metier';
		content_criteres_code_wrp+= type + ' : ' + current_metier.join(',') + '\
		';		
		content_criteres_lib_wrp += type + ' : ';
		i = 0;
		$.each(current_metier,function(j) {
			value = current_metier[j];
			if(i>0)content_criteres_lib_wrp +=',';
			content_criteres_lib_wrp +=get_value_by_key(Tmetiers,value);
			i++;
		});		
	    content_criteres_lib_wrp += '\
		';
	}
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

/**
 * Permet de mettre a jour les données pour : Fonction
 * @param data
 */
function majTfonction(data) {
    Tfonctions_search = new Array;
    Tfonctions = [];
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
}

/**
 * Permet de mettre a jour les données pour : Metier
 * @param data
 */
function majTmetier(data) {
    Tmetiers_search = new Array;
    Tmetiers = [];
    TmetiersCodeId = [];
    var k=0;
    for(item in data) {

        //for(fonction in data[parent]["fonction"]) {
        for(metier in data[item]["metier"]) {

            label = data[item]["metier"][metier];
            Tmetiers_search.push({
                'item_value': metier
                ,'item_label':label
                ,'item_index':k
                ,'type':'metier'
            });
            Tmetiers[metier]=label;
            TmetiersCodeId[metier]=data[item]['id'];
            k++;
        }
    }
}

/**
 * Permet de mettre a jour les données pour : Zone-geo
 * @param data
 */
function majTregion(data) {

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

        majTregion(data);

        // mise en cache
        localStorage.setItem("tregion_data", JSON.stringify(data));

	}).fail(function() {
        // as t'on des données en cache ?
        var treg_data = localStorage.getItem("tregion_data");

        if (treg_data === null || treg_data === '') {
            console.log("une erreur lors de la récupération de donnée FONCTION SEARCH est survenue, merci de relancer l'application");
			return;
        }

        var data = JSON.parse(treg_data);

        majTregion(data);
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
				$("#strong-nb-ann").show();
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
        , success : function(data) {

            majTfonction(data);
            // mise en cache
            localStorage.setItem("tfonction_data", JSON.stringify(data));

        },
        error : function () {
            // as t'on des données en cache ?
            var tfct_data = localStorage.getItem("tfonction_data");

            if (tfct_data === null || tfct_data === '') {
                console.log("une erreur lors de la récupération de donnée FONCTION SEARCH est survenue, merci de relancer l'application");
				return;
            }

            var data = JSON.parse(tfct_data);

            majTfonction(data);

        }
	});

  $.ajax({
		url:DIRSCRIPTS+'interface-mobile.php'
		,data: {
			jsonp : 1
			,get:'metier'
		}
		,dataType:'jsonp'
		,async :false
		,cache :false
        , success : function(data) {

            majTmetier(data);
            // mise en cache
            localStorage.setItem("tmetier_data", JSON.stringify(data));

        },
        error : function () {
            // as t'on des données en cache ?
            var tfct_data = localStorage.getItem("tmetier_data");

            if (tfct_data === null || tfct_data === '') {
                console.log("une erreur lors de la récupération de donnée METIER SEARCH est survenue, merci de relancer l'application");
				return;
            }

            var data = JSON.parse(tfct_data);

            majTmetier(data);

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
		//Init zone geo détail

		Tdepts = new Array;
		
		var k=0;
		for(code in data) {
     			
     			label = data[code];
     			
     			Tdepts[code]=label;
     			
     		k++;		
     	}

	});
	/*
	
	// Pas besoin pour l'instant
    load_contrats();

	load_experiences();
*/
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
	var dept = '';
	
	if(advanceMode) {
	
		
		$.each(current_zonegeo,function(i) {
			if(zonegeo!='')zonegeo+='|';
			zonegeo+=this;
		});
		
		$.each(current_dept,function(i) {
			if(dept!='')dept+='|';
			dept+=this;
		});
		
		$.each(current_fonction,function(i) {
			if(fonction!='')fonction+='|';
			fonction+=this;
		});			
		
		$.each(current_metier,function(i) {		
			if(metier!='')metier+='|';
			metier+=TmetiersCodeId[this];
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
			,dept:dept
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

	//if(current_fonction.length>0){
		go_url_recherche();
	//}else{
	//	$('[href=#recherche-detail-page-fonction] > h2').addClass('border_red');
	//	$('#fonctionrequired').popup('open',{history:false});
	//}

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

  newurl = '#recherche' + '?zone=' + current_zonegeo.join('-')+'&dept='+  current_dept.join('-')+'&fct='+    current_fonction.join('-')+'&mtr='+    current_metier.join('-')+'&exp='+current_experience.join('-')+'&ctt='+  current_contrat.join('-')+'&motclef='+ current_motclef;
	newurl += '&t='+Math.round(+new Date()/1000);
	
	$.mobile.changePage( newurl);

	return true;
}


function save_current_criteres(){

	// fait dans check_cac et validate_cac
	// ne pas refaire le current_<type> ici

	/*if($('.checkzonegeo').lenght>0){
		current_zonegeo = new Array;
		$('.checkzonegeo').each(function(i) {
				if($(this).prop('checked')){
					current_zonegeo.push($(this).val());
				}
			});	
	}*/
	
	/*if($('.checkfonction').lenght>0){
	current_fonction = new Array;	
	$('.checkfonction').each(function(i) {
			if($(this).prop('checked')){
				current_fonction.push($(this).val());
			}
		});	
	}*/
	
	/*if($('.checkcontrat').lenght>0){
		current_contrat = new Array;	
		$('.checkcontrat').each(function(i) {			
			if($(this).prop('checked')){
				current_contrat.push($(this).val());
			}
		});	
	}	*/
	
	//if($('.checkmetier').lenght>0){
	//	$('.checkmetier').each(function(i) {
		
	//		if($(this).is(':checked')) {
	//			if(metier!='')metier+='|';
	//			metier+=$(this).val();
	//		}
	//	});
	//}
	/*if($('.checkexperience').lenght>0){
		current_experience = new Array;		
		$('.checkexperience').each(function(i) {
			if($(this).prop('checked')){
				current_experience.push($(this).val());
			}
		});
	}	*/


	// on garde que le mot clé
	current_motclef=$('[id=recherche-detail-mot-clef]').val();
			
	return false;		
} 
