var DIRSCRIPTS = 'http://bo.v2.batiactuemploi.com/scripts/';
//var DIRSCRIPTS = 'http://local.back2012.batiactuemploi.com/scripts/';

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
	
	
	$.mobile.changePage('#recherche');
	
	var mot = $('#recherche-detail-mot-clef').val();
	

	var fonction = '';
	var metier = '';
	var experience = '';
	var contrat = '';
	var zonegeo = '';
	
	if(advanceMode) {
		$('.checkcontrat').each(function(i) {
			
			if($(this).is(':checked')) {
				if(contrat!='')contrat+='|';
				contrat+=$(this).val();
			}
		});	
			
		$('.checkfonction').each(function(i) {
			
			if($(this).is(':checked')) {
				if(fonction!='')fonction+='|';
				fonction+=$(this).val();
			}
		});	
		
		$('.checkmetier').each(function(i) {
			
			if($(this).is(':checked')) {
				if(metier!='')metier+='|';
				metier+=$(this).val();
			}
		});
			
		$('.checkexperience').each(function(i) {
			
			if($(this).is(':checked')) {
				if(experience!='')experience+='|';
				experience+=$(this).val();
			}
		});	
			
		$('.checkzonegeo').each(function(i) {
			
			if($(this).is(':checked')) {
				if(zonegeo!='')zonegeo+='|';
				zonegeo+=$(this).val();
			}
		});	
			
			
	}
	else {
		var zonegeo = $('#accueil #zone-geo').val();
	}

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
		}
	});

	
	return false;
}

