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
			
			 $.mobile.loading( 'show' );
			 
			 //myList.hide();
	
			 $.ajax({
			 	url : options.url
			 	,data : options.data
			 	,dataType:'jsonp'
			 	
			 }).done(function(data) {
			 	myList.html('');
			 
			 	$.each(data,function(i, row) {
			 		
			 		var newItem = blank.clone();
			 		newItem.removeAttr('id');
			 		
			 		ligne = newItem.html();
			 		
			 		for (k in row) {
			 			var myRegexp= new RegExp("item_"+k+"","gi");
			 			
			 			ligne = ligne.replace(myRegexp, row[k]);
			 				
			 		}
			 		
			 		newItem.html(ligne);
			 		newItem.show();
			 		myList.append(newItem);
			 		
			 	});
			 	
			 	
			 	myList.show();
			 	myList.listview('refresh');
			 	$.mobile.loading( 'hide' );
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
			 			
			 			myItem.find('#item_'+k).html(row[k]);
			 				
			 		}
			 		
					$.mobile.loading( 'hide' );
			 	
			 });
	       
    }
    
    
    });
    
})(jQuery);