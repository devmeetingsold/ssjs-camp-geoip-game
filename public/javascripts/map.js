var GeoIp = this.GeoIp || {};

this.GeoIp.map = (function(){
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();

  var map = null;
  var mainMarker = null;
  
  function _addMarker(latLng, label, options) {
    if(!map) return;
    var location = new google.maps.LatLng(latLng[0], latLng[1])
    var marker = new google.maps.Marker({
      position : location,
      title : label,
      icon : options.image
    });
    
    if(options.main) {
      mainMarker && mainMarker.setMap(null);
      mainMarker = marker;
    } 
    marker.setMap(map);
  }
  
  return {
    initialize : function(latLng) {
      var myOptions = {
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = map || new google.maps.Map(document.getElementById("map_canvas"), myOptions);
      map.setCenter(new google.maps.LatLng(latLng[0], latLng[1]));
      
      _addMarker(latLng, "You wish you were here!", {main : true})
    },
    addMarker : _addMarker
  }
  
})();

//GeoIp.map.initialize(40.69847032728747, -73.9514422416687); //new york