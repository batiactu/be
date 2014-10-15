(function($){
    $.fn.extend({
        
		completeListMesRecherches: function(options) {    		       
			//notify('Chargement...', '#mes-recherches', 3000);
            var defaults = {
               template:'#mes-recherches-resultat-tpl'
                ,url:'fill-url-source'
                ,data:{  }                
            }
   
            var options = $.extend(defaults, options);
            
			 var myList = $(this);
			 var template = Handlebars.compile($(options.template).html());
			  
			 if(options.noLoading==null) $.mobile.loading( 'show' );

	            //alert(tsearchs + " / "+$.jStorage.storageSize());
	
				nb = Object.keys(tsearchs).length;
			
				myList.html('');

				var Tab=new Array;
			 		
		 		$.each(tsearchs,function(i, row) {
		 	       
			 		var item = new Array;
			 							                  
					item["item_no_criteres"] = 'Recherche globale (sans critère)';
			 		for (k in row) {
			 			if(row[k]!= '')item["item_no_criteres"]=null;
						  switch(k){
			 			 	case 'current_zonegeo':			 			 	
			 			 	if(row[k]=='')item["item_lib_"+k] = row[k];
			 			 	else item["item_lib_"+k] = Tregions[row[k]];
			 			 	break;
			 			 	
			 			 	case 'current_fonction':
			 			 	if(row[k]=='')item["item_lib_"+k] = row[k];
			 			 	else item["item_lib_"+k] = Tfonctions[row[k]];
			 			 	break;
			 			 	
			 			 	case 'current_experience':
			 			 	if(row[k]=='')item["item_lib_"+k] = row[k];
			 			 	else item["item_lib_"+k] = Texperiences[row[k]];
			 			 	break
			 			 	
			 			 	case 'current_contrat':
			 			 	if(row[k]=='')item["item_lib_"+k] = row[k];
			 			 	else item["item_lib_"+k] = Tcontrats[row[k]];
			 			 	break

                          case 'push':
                              item["item_"+k] = row[k];
                          break

			 			 	
			 			 	default:

						 }
						 item["item_"+k] = row[k];						 			
			 		}
			 		item["item_hash"]=i;


			 		if (batiMP !== null && batiMP.getAllNotifications() != []) {
                        var listeNotif = batiMP.getAllNotifications();

                        var lgTab = listeNotif.length;

                        item["nbAlerte"] = 0;

                        // recheche du hash dans les notifs reçues + affectation du nb d'alerte trouvé
                        // on part des push les plus recents
                        for (g=lgTab-1;g>=0;g--) {
                            if (listeNotif[g].data["idAlerte"] == i) {
                                //on prend le premier push qui correspond
                                item["nbAlerte"] += parseInt(listeNotif[g].data["nbAlerte"]);
                                break;
                            }
                        }
                    }

                    //item["nbAlerte"] = 4;
			 		Tab.push(item);
			 	});
			 	
			 	myList.html(template(Tab));

			 	myList.show();
			 	//myList.listview('refresh');

			 	if(options.noLoading==null){ remove_notify('#mes-recherches');$.mobile.loading( 'hide' )};
			 	
			 	if(use_infinite){
			 		$.waypoints();
	    			$.waypoints('refresh');
	    		}
    }
    
    ,completeListItem: function(options) {            
			//notify('Chargement...', '#recherche',30000	);
            var defaults = {
               template:'#recherche-resultat-tpl'
                ,url:'fill-url-source'
                ,data:{  }                
            }
                
            var options = $.extend(defaults, options);
            
			 var myList = $(this);
			 var template = Handlebars.compile($(options.template).html());
			  
			 if(options.noLoading==null) $.mobile.loading( 'show' );
			 
			 //myList.hide();
	
			 if(options.dataType==null) options.dataType='jsonp';
	         
			 $.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:options.dataType
			 	,async :false
			 }).done(function(dataSearch) {
			 	data = dataSearch['TResults'];
				nbTotal = dataSearch['nb'];
				//myList.html('');


				var Tab=new Array;
				/*
				 * A revoir
				 */
			    if(options.dataType=='xml') {
			    	xml = data;
			    	data=new Array;
			    	
			    	$('item',xml).each(function(i) {
							var newItem = blank.clone();
					 		newItem.removeAttr('id');
					 		ligne = newItem.html();
					
							$('*',this).each(function(j, o) {
									
								
									k= o.tagName;
									v = $(o).text();
									if(k=='enclosure') {
										v = $(o).attr('url');
										k='image';	
									}
									
						 			var myRegexp= new RegExp("item_"+k+"","gi");
						 			
						 			ligne = ligne.replace(myRegexp, v);
						 				
							});
					
						
					 		
					 		
					 		
					 		newItem.html(ligne);
					 		newItem.show();
					 		myList.append(newItem);
					 		
					});	
			    	//data = $.parseHTML(data.html());
			    }
			 	else {
			 		nb = data.length;			 		
			 		$.each(data,function(i, row) {
			 	        var prevP = i>0?data[i-1]['origine']:null;
			 	        var nextP = i<nb-1?data[i+1]['origine']:null;
				 		var item = new Array;
				 		
						search_list_id.push((data[i]['origine']).toString());
						
				 		for (k in row) {
				 			
							switch(k){
								case 'region':
								//Tregions
								item["item_lib_"+k]="";
								var string = row[k] + '';
								var tab = string.split(',');
								for(j in tab){ 
									if(item["item_lib_"+k]!='')item["item_lib_"+k]+=',';
									item["item_lib_"+k] += Tregions[tab[j]];
								}
								break;
								
								case 'dept':
			 					//Tdepts
			 					item["item_lib_"+k]="";
								var string = row[k] + '';
								var tab = string.split(',');
								for(j in tab){ 
									if(item["item_lib_"+k]!='')item["item_lib_"+k]+=',';
									item["item_lib_"+k] += Tdepts[tab[j]];
								}
			 					break;
			 			
			 					case 'contrat':
								if(row[k]=='')row[k]='Tous contrats';
								break; 

								
							}	
							item["item_"+k] = row[k];			 			
				 		}
				 		item["item_previous"]=prevP;
				 		item["item_next"]=nextP;
				 		
				 		Tab.push(item);
				 		
				 	});
				 	
			 	}
			 	
			 	current_nb_annonce = nbTotal;

			 	if(!use_infinite){
					var current_nb = parseInt($('#recherche #next').attr('data-next'));
					var starting = current_nb-nb_results_by_page-1;
					if(starting<0)starting=0;
					Tab = Tab.slice(starting,current_nb-1);
				}
				
			 	myList.html(template(Tab));
			 				 	
                var $content = $('#recherche').children( ":jqmData(role=content)" );			
                
                $content.find( "#nb_results" ).removeClass('noresult');
				switch(nbTotal){
					case 0:
						res = 'Aucune offre d\'emploi ne correspond à vos critères';
						$content.find( "#nb_results" ).addClass('noresult');
					break;
					case 1:
						res = '1 offre d\'emploi';
					break;
					case Limit_Annonce:
						res = nbTotal+' premières offres d\'emploi';
					break;
					default:
						res = nbTotal+' offres d\'emploi';										
				}
					
				
			 	myList.show();
			 	myList.listview().listview('refresh');
	
				$content.find( "#nb_results" ).text(res);				
                $content.find( ".btn_display1" ).css('display','block');
                if(nbTotal>nb_results_by_page)$content.find( ".btn_display2" ).css('display','block');
                
                if(use_infinite){	
					$('#recherche #next').trigger('create');
					$('#recherche #next').button();	
					if((current+nb_results_by_page)<=current_nb_annonce){		
			 			$('#recherche #next').removeClass('displaynone');
					}else{
						$('#recherche #next').addClass('displaynone');
					}
					$('#recherche #next').trigger('create');

			    }

			 	if(options.noLoading==null){ remove_notify('#recherche');$.mobile.loading( 'hide' )};
			 	
			 	if(use_infinite){
			 		$.waypoints();
	    			$.waypoints('refresh');
	    		}else{
					pagination(current_nb);
					$.mobile.silentScroll(0);
				}
	
	        });    

    }
    
    ,getItem: function(options) {
           
            var defaults = {
                template:'#annonce-detail-tpl'
                ,itemtarget:'#annonce'
				,url:'fill-url-source'
                ,data:{  }
            }
                
            var options = $.extend(defaults, options);            
			var myItem = $(this);
			var myItemId = myItem.attr('id');
			var template = Handlebars.compile($(options.template).html()); 
            //var templatefooter = Handlebars.compile($('#nav-annonce-detail-tpl').html());
            //Handlebars.registerPartial("nav", $("#nav-annonce-detail-tpl").html());
            //notify('chargement...', '#annonce');
			$.mobile.loading( 'show' );
			
			$.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:'jsonp'
			 	,async : false
			 	,success:function(row) {

                    $(options.itemtarget+' :jqmData(role=footer)').remove();
                    $(options.itemtarget+' :jqmData(class="content_annonce")').remove();
                    $(options.itemtarget).append(template(row));//.trigger('create');
                    _refresh_datas();
                    
                    
					var template2 = Handlebars.compile($("#nav-annonce-detail-tpl").html());		 		
					Tab=new Array;
					Tab['nav']=[{'PREVIOUS':prevP,'NEXT':nextP}];
					TabComplete=new Array;
					TabComplete.push(Tab);	 
					$('#annonce #nav-annonce').remove();
					$('#annonce').append(template2(TabComplete)).trigger('pagecreate');;
					$('#annonce').trigger('create');
					$.mobile.loading( 'hide' );	
													        
			 	}
			 	,error:function() {
			 		$.mobile.loading( 'hide' );
			 	}
			 });
			//remove_notify('#annonce');           

			return this;

    }
    
    
    });
    
})(jQuery);