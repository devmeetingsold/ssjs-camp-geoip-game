var GeoIp = this.GeoIp || {};

this.GeoIp.users = (function(){
  var container = $('#user-list');
  
  return {
    render : function(data) {
      container.html('');
      data.forEach(function(el){
        var item = $('<p>' + el.name + ' ' + ~~el.dist +'km ('+el.ip+')</p>')
        item.appendTo(container);
        GeoIp.map.addMarker(el.geo, el.ip + ' ' + el.name + ' ' + ~~el.dist+'km', {
          image : 'http://code.google.com/apis/maps/documentation/javascript/examples/images/beachflag.png'
        })
      })
    }
  }
  
});