
var geocoder;
var map;

function initialize() {
 // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latlng = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
		
		geocoder = new google.maps.Geocoder();

 		geocoder.geocode({'latLng': latlng}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	      	
	     	  alert(results[1].formatted_address);
	        
	      } else {
	        alert('No results found');
	      }
	    } else {
	      alert('Geocoder failed due to: ' + status);
	    }
	  });

 		
    }, function() {
      	
    });
    
    
  } 
}


google.maps.event.addDomListener(window, 'load', initialize);

