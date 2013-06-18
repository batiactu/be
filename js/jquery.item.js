(function($){
    $.fn.extend({
        
        //This is where you write your plugin's name
        completeListItem: function(options) {
          
            var defaults = {
               listItem:'#item-recherche-blank'
                ,url:'fill-url-source'
                ,data:{  }
            }
                
            var options = $.extend(defaults, options);
            
			 var myList = $(this);
			 
			 $(options.listItem).hide();
			 var blank = $(options.listItem).clone();
			 
			 if(options.noLoading==null) $.mobile.loading( 'show' );
			 
			 //myList.hide();
	
			 if(options.dataType==null) options.dataType='jsonp';
	
			 $.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:options.dataType
			 	
			 }).done(function(data) {
			 	myList.html('');

				/*var ligne = '';			 
			 	for(x in data) {
			 		ligne+=x+'='+data[x]+"\n";
			 	}
			 	alert(ligne);
			 	*/
				
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
			 	
				 		var newItem = blank.clone();
				 		newItem.removeAttr('id');
				 		
				 		ligne = newItem.html();
				 		
				 		for (k in row) {
				 			//alert(k);
				 			var myRegexp= new RegExp("item_"+k+"","gi");
				 			
				 			ligne = ligne.replace(myRegexp, row[k]);
				 				
				 		}
				 		
				 		newItem.html(ligne);
				 		newItem.show();
				 		myList.append(newItem);
				 		
				 	});
			 	}
			 	
			 	
			 	
			 	
			 	
			 	
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
			 
			 $.mobile.loading( 'show' );
			 
			 $.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:'jsonp'
			 	
			 }).done(function(row) {
			 	
			 		for (k in row) {
			 			
			 			myItem.find('.item_'+k).html(row[k]);
			 				
			 		}
			 		
					$.mobile.loading( 'hide' );
			 	
			 });
	       
    }
    
    
    });
    
})(jQuery);