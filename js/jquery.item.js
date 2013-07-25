(function($){
    $.fn.extend({
        
        //This is where you write your plugin's name
        completeListItem: function(options) {            
			notify('Chargement...');
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
			 	
			 }).done(function(dataSearch) {
			 	data = dataSearch['TResults'];
				nbTotal = dataSearch['nb'];
				myList.html('');


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
				 			item["item_"+k] = row[k];				 			
				 		}
				 		item["item_previous"]=prevP;
				 		item["item_next"]=nextP;
				 		
				 		Tab.push(item);
				 		
				 	});
				 	
			 	}
			 	
			 	myList.html(template(Tab));
			 				 	
                var $header = $('#recherche').children( ":jqmData(role=header)" );
                current_nb_annonce = nbTotal;
				switch(nbTotal){
					case 0:
						res = 'Aucun résultat';
					break;
					case 1:
						res = '1 résultat';
					break;
					case Limit_Annonce:
						res = 'les '+nbTotal+' premiers résultats';
					break;
					default:
						res = nbTotal+' résultats';										
				}
				
				$header.find( "h1" ).text(res);
								

			 	myList.show();
			 	myList.listview('refresh');
			 	//myList.page();
			 	//myList.trigger('pagecreate');
			 	if(options.noLoading==null){remove_notify(); $.mobile.loading( 'hide' )};
			 	
			 	$.waypoints();
	    		$.waypoints('refresh');
			 
			 	
	
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

			$.mobile.loading( 'show' );

			$.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:'jsonp'
			 	,async : false
			 	,success:function(row) {
			 		//var annonce = new Array();
			 		//for (k in row) {
			 		//nb = Object.keys(row).length;
			 		//for (k=0; k<nb; k++) {
			 		//	annonce[k] = row[k];	
			 		//}
                    
                    //row['nav']=[{'PREVIOUS':row['PREVIOUS'],'NEXT':row['NEXT']}];
                    $(options.itemtarget+' :jqmData(role=footer)').remove();
                    $(options.itemtarget+' :jqmData(role=content)').remove();
                    $(options.itemtarget).append(template(row));//.trigger('create');
                    _refresh_datas();
                    
                    $('#annonce #nav-annonce').remove();
					var template2 = Handlebars.compile($("#nav-annonce-detail-tpl").html());		 		
					Tab=new Array;
					Tab['nav']=[{'PREVIOUS':prevP,'NEXT':nextP}];
					TabComplete=new Array;
					TabComplete.push(Tab);	 
					$('#annonce').append(template2(TabComplete)).page().trigger('create');
	
                    //$(options.itemtarget).page();
                    
					$.mobile.loading( 'hide' );	
													        
			 	}
			 	,error:function() {
			 		$.mobile.loading( 'hide' );
			 	}
			 });

			$(options.itemtarget).trigger('create');
            //$(options.itemtarget).page();             

			return this;

    }
    
    
    });
    
})(jQuery);