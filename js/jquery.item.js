(function($){
    $.fn.extend({
        
        //This is where you write your plugin's name
        completeListItem: function(options) {
          
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
			 	
			 }).done(function(data) {
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
					
							$('*',this).each(function(i, o) {
									
								
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
			 		$.each(data,function(i, row) {
			 	
				 		var item = new Array;
				 		
				 		for (k in row) {
				 			//alert(k);
				 			item["item_"+k] = row[k];
				 			
				 		}
				 		
				 		Tab.push(item);
				 		
				 	});
				 	
			 	}
			 	
			 	myList.html(template(Tab));
			 	
			 	myList.show();
			 	myList.listview('refresh');
			 	if(options.noLoading==null) $.mobile.loading( 'hide' );
			 });
			 
	            
	       
    }
    
    ,getItem: function(options) {
           
            var defaults = {
                url:'fill-url-source'
                ,data:{  }
            }
                
            var options = $.extend(defaults, options);
       
			var myItem = $(this);
			var template = Handlebars.compile(myItem.html()); 
			 
			 $.mobile.loading( 'show' );
			 
			 $.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:'jsonp'
			 	,async : false
			 	,success:function(row) {
			 		var item = new Array;
			 		for (k in row) {
			 			
			 			item[k] = row[k];
			 				
			 		}
			 		
			 		myItem.html(template(item));
				
			 		$.mobile.changePage('#annonce');
			 	}
			 	
			 });
			 
			 $.mobile.loading( 'hide' );
	       
    }
    
    
    });
    
})(jQuery);