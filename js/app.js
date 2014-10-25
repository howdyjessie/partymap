// FIREBASE =====================================================================
var fb = new Firebase("https://blinding-torch-598.firebaseio.com/");

function addParty() {
  fb.push({
    name: "Sigma Nu Rumble",
    location: {
      street: "803 W. 30th St. Apt. 15",
      city: "Los Angeles",
      state: "California",
      zip: 90007

    },
    cost: 5,
    status: true,
  });
}

// GEOLOCATION & GOOGLE MAP =====================================================================
function initialize()
{
    var myOptions = {
    zoom: 4,
    mapTypeControl: true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    navigationControl: true,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP      
  } 
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  google.maps.event.addDomListener(window, 'resize', initialize);
  if(geoPosition.init())
  {
    document.getElementById('current').innerHTML="Receiving...";
    geoPosition.getCurrentPosition(showPosition,function(){document.getElementById('current').innerHTML="Couldn't get location"},{enableHighAccuracy:true});
  }
  else
  {
    document.getElementById('current').innerHTML="Functionality not available";
  }
}

function showPosition(p)
{
  var latitude = parseFloat( p.coords.latitude );
  var longitude = parseFloat( p.coords.longitude );
  document.getElementById('current').innerHTML="latitude=" + latitude + " longitude=" + longitude;
  var pos=new google.maps.LatLng( latitude , longitude);
  map.setCenter(pos);
  map.setZoom(14);

  var infowindow = new google.maps.InfoWindow({
    content: "<strong>Current Location</strong>"
  });

  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title:"You are here"
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}