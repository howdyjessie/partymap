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

//Edit an existing party in Firebase
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