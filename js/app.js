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

function updateMap() {
  showParties().done(function(result) {
    for(entry in result){
      var obj = result[entry];
      var location = obj.location;
      var address = location.street + " " + location.city + " " + location.state + " " + location.zip;
      var contentString = "<strong>Event:</strong> " + obj.partyName + "<br><strong>Address:</strong> " + address + "<br><strong>Cost:</strong> $" + obj.cost
      + "<br><strong>URL:</strong> <a href='" + obj.url + "'>" + obj.url + "</a>";
      geocodeData(contentString, address);
    }
  });
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
var infowindow = new google.maps.InfoWindow();

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
  map.setZoom(15);

  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    title:"You are here"
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent("<strong>Current Location</strong>");
    infowindow.open(map, this);
  });
  updateMap();
}

function getReverseGeocodingData(latLng, fn) {
  //making the Geocode request
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latLng}, function (results, status) {
    // checking if the Geocode status is ok before proceeding
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results[0].formatted_address);
      fn(results[0].formatted_address);
    } else {
        console.log("Reverse geocode was not successful for the following reason: " + status);
    }
  });
}

// Plots a marker w/ info window given a human-friendly address
function geocodeData(contentString, address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function (results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({map: map, position: results[0].geometry.location });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(contentString);
          infowindow.open(map, this);
        });
     } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      setTimeout(function() {
        console.log("Retrying");
        geocodeData(contentString, address);
      }, 200);
    } else {
        console.log("Geocode was not successful for the following reason: " + status);
     }
  });
}