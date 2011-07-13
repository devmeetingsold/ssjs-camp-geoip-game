var GeoIp = this.GeoIp || {};

(function(){
  var counter = 0;
  
  $('form').submit(function(){
    var dataString = 'username='+ $(this).context.username.value + '&ip=' + $(this).context.ip.value;
    now.sendData({
      username : $(this).context.username.value,
      ip : $(this).context.ip.value
    })
    console.log('data sent client');
    return false;
  })
  
  now.update = function(model) {
    refreshSite(model)
  }
  
  function refreshSite(data) {
    console.log(data);
    GeoIp.map.initialize(data.target);
    GeoIp.users().render(data.players); 
    counter++;
  }
})();