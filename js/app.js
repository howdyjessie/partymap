// FIREBASE =====================================================================

// Firebase DB connection 
var fb = new Firebase("https://blinding-torch-598.firebaseio.com/");

//Display all parties in Firebase
function showParties() {
  //Limits query to ten items
  var parties = fb.limit(10);
  var def = $.Deferred(); // <--- jQuery handles deferred/async/promise functions
    
  parties.on('value', function(snapshot) {
    var partyInfo = snapshot.val();
    def.resolve(partyInfo);
  });
  return def.promise();
}


// Get form data
function getFormData() {
  var $name = $("input[name='name']").val();
  var $street = $("input[name='street']").val();
  var $city = $("input[name='city']").val();
  var $state = $("input[name='state']").val();
  var $zip = $("input[name='zip']").val();
  var $cost = $("input[name='cost']").val();
  var $url = $("input[name='url']").val();
  
  return {
    name: $name,
    street: $street,
    city: $city,
    state: $state,
    zip: $zip,
    cost: $cost,
    url: $url
  };
}

//Add a party to Firebase
function addParty(data) {
  fb.push({
    partyName: data.name,
    location: {
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip
    },
    cost: data.cost,
    url: data.url
  },
  function(error) {
    if (error) {
      alert("Party couldn't be saved! Error: " + error);
    } else {
      alert("Party added succesfully!");
    }
  });

}

//TODO: Edit an existing party in Firebase
function editParty(partyID) {
  var party = fb.child(partyID);
  party.update({
    partyName: $name,
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

//TODO: Destroy invalid or expired parties






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
    var current = document.getElementById("current");
    current.innerHTML="Retrieving...";
    var img = document.createElement("img");
    img.src = "cat.gif";
    document.getElementById("map_canvas").appendChild(img);
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
  var pos = new google.maps.LatLng( latitude , longitude);
  getReverseGeocodingData(pos, function(location) {
    document.getElementById('current').innerHTML="Current Location: " + location;
  });
  
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

function getReverseGeocodingData(latLng, fn) {
  //making the Geocode request
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latLng}, function (results, status) {
    if (status !== google.maps.GeocoderStatus.OK) {
      alert(status);
    }

    // checking if the Geocode status is ok before proceeding
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results[0].formatted_address);
      fn(results[0].formatted_address);
    }
  });
}

// Plots a marker given a human-friendly address
function geocodeData(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function (results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({map: map, position: results[0].geometry.location });
     } else {
        console.log("Geocode was not successful for the following reason: " + status);
     }
  });
}

// Places markers on map via party
function mapParties(data) { 
  for (i = 0; i < data.length; i++) {
    var address = data[i].street + data[i].city + data[i].state + data[i].zip;
    geocodeData(address);
  }
}