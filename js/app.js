// FIREBASE =====================================================================

// Firebase DB connection 
var fb = new Firebase("https://blinding-torch-598.firebaseio.com/");

//Read parties in Firebase
function viewParties() {
  fb.on("value", function(snapshot) {
    console.log(snapshot.val());

  }, function(error){
    console.log("There was an error displaying: " + error.code);
  });
}

// Get form data
var $name = $("form[name='name']").val();
var $street = $("form[name='street']").val();
var $city = $("form[name='city']").val();
var $state = $("form[name='state']").val();
var $zip = $("form[name='zip']").val();
var $cost = $("form[name='cost']").val();
var $url = $("form[name='url']").val();

//Add a party to Firebase
function addParty() {
  fb.push({
    name: $name,
    location: {
      street: $street,
      city: $city,
      state: $state,
      zip: $zip

    },
    cost: $cost,
    url: $url
  },
  function(error) {
    if (error) {
      alert("Data couldn't be saved! Error: " + error);
    } else {
      alert("Data saved successfully!");
    }
  });

}

//Edit an existing party in Firebase
function editParty(partyID) {
  var party = fb.child(partyID);
  party.update({
    name: $name,
    location: {
      street: $street,
      city: $city,
      state: $state,
      zip: $zip

    },
    cost: $cost,
    url: $url
  },
  function(error) {
    if (error) {
      alert("Data couldn't be saved! Error: " + error);
    } else {
      alert("Data saved successfully!");
    }
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