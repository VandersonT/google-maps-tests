var map;
var geocoder;

function initMap(){

    var mapOptions = {
        center: {lat: -18.5485, lng: -42.7659},
        zoom: 13,
        mapTypeId: 'roadmap' //roadmap, satellite, hybrid, terrain
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Adicionar marcador
    var marker = new google.maps.Marker({
        position: {lat: -18.5485, lng: -42.7659},
        map: map,
        title: 'Pichorra',
        //label: 'P',
        icon: {
            url: './posa.png',
            scaledSize: new google.maps.Size(32, 32)
        },
        animation: google.maps.Animation.DROP, //drop, bounce e pesquise mais se quiser
        draggable: true
    });


    //remover marcador
    //marker .setMap(null);


    //Barra de pesquisa
    var input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
  
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    
        var address = '';
        if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map);
    });
}

document.getElementById('satellite').addEventListener('click', function() {
    map.setMapTypeId('satellite');
});

document.getElementById('roadmap').addEventListener('click', function() {
    map.setMapTypeId('roadmap');
});

document.getElementById('hybrid').addEventListener('click', function() {
    map.setMapTypeId('hybrid');
});