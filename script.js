
/*--------------------DATABASE-SIMULATION-------------------------------*/
    let posicoes = [
        {lat: -18.5485, lng: -42.7659, msg: 'Atropelado', nome: 'raposa', img: 'posa.png', link: 'https://www.peritoanimal.com.br/a-raposa-como-animal-de-estimacao-20876.html'},
        {lat: -18.5455, lng: -42.7689, msg: 'Atropelado', nome: 'Cachorro', img: 'dog.png', link: 'https://www.portaldodog.com.br/cachorros/'},
        {lat: -18.5480, lng: -42.7659, msg: 'Picada na foice', nome: 'Cobra Sirucucu', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'},
        {lat: -18.5475, lng: -42.7659, msg: 'Pisada', nome: 'Cobra Sandaia', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'},
        {lat: -18.5465, lng: -42.7659, msg: 'Bebeu veneno', nome: 'Cobra Sucuri', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'}
    ];
/*----------------------------------------------------------------------*/




/*---------------------FUNÇÕES-AUXILIARES-------------------------------*/
    function geraCirculos(){
        //Circulo

        /*Inicializando variavel*/
        let minLat = posicoes[0].lat;
        let maxLat = posicoes[0].lat;
        let minLng = posicoes[0].lng;
        let maxLng = posicoes[0].lng;
        
        for (let i = 1; i < posicoes.length; i++) {
        if (posicoes[i].lat < minLat) {
            minLat = posicoes[i].lat;
        }
        if (posicoes[i].lat > maxLat) {
            maxLat = posicoes[i].lat;
        }
        if (posicoes[i].lng < minLng) {
            minLng = posicoes[i].lng;
        }
        if (posicoes[i].lng > maxLng) {
            maxLng = posicoes[i].lng;
        }
        }
        /****/

        centerLat = (minLat + maxLat) / 2;
        centerLng = (minLng + maxLng) / 2;

        function calcularDistancia(lat1, lng1, lat2, lng2) {
            const R = 6371; // raio médio da Terra em quilômetros
            const dLat = toRadians(lat2 - lat1);
            const dLng = toRadians(lng2 - lng1);
            const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return distance;
        }
        
        function toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }
        
        let maxDistance = 0;
        for (let i = 0; i < posicoes.length; i++) {
            const distance = calcularDistancia(centerLat, centerLng, posicoes[i].lat, posicoes[i].lng);
            if (distance > maxDistance) {
            maxDistance = distance;
            }
        }
        
        const radius = maxDistance * 1050; // converter para metros

        const circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeWeight: 2,
            strokeOpacity: 1,
            fillColor: '#FF0000',
            fillOpacity: .4,
            center: {lat: centerLat, lng: centerLng},
            radius: radius,
            map: map
        });

        console.log(radius)
    }

    function barraPesquisa(){
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

    function realizaMarcações(){
        posicoes.map((item, index) => {
            //Adicionar marcador
            var marker = new google.maps.Marker({
                //position: {lat: -18.5485, lng: -42.7659},
                position: {lat: item.lat, lng: item.lng},
                map: map,
                title: item.nome,
                //label: 'P',
                icon: {
                    url: './'+item.img,
                    scaledSize: new google.maps.Size(32, 32)
                },
                animation: google.maps.Animation.DROP, //drop, bounce e pesquise mais se quiser
                //draggable: true
            });

            let infoWindow = new google.maps.InfoWindow({
                //content: '<h2>'+item.msg+'</h2>', //Pode usar html normal e colocar classe e estilizar no css
                content: `
                    <h2>${item.nome}</h2>
                    <p>${item.msg}</p>
                    <a href='${item.link}' target='_blank'">verifica no site</a>
                `
                // position: marker.getPosition(),
                // maxWidth: 200
            }); 

            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        })
    }
/*----------------------------------------------------------------------*/






/*-----------------INICIO DO CÓDIGO DO MAPA-----------------------------*/
    function initMap(){


        //Cria o mapa e renderiza o mesmo na tela
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -18.5485, lng: -42.7659},
            zoom: 15,
            mapTypeId: 'roadmap' //roadmap, satellite, hybrid, terrain
        });
        

        //Realiza as marcações que veio do banco de dados no mapa
        realizaMarcações();


        //Adiciona uma barra de pesquisa para procurar por uma localização
        barraPesquisa();


        //Gera os circulos que demarca as ocorrencias em cada área
        geraCirculos();
    }
/*----------------------------------------------------------------------*/





/*--------------------BOTÕES PARA TROCAR DE MAPA-------------------------------*/
    document.getElementById('satellite').addEventListener('click', function() {
        map.setMapTypeId('satellite');
    });

    document.getElementById('roadmap').addEventListener('click', function() {
        map.setMapTypeId('roadmap');
    });

    document.getElementById('hybrid').addEventListener('click', function() {
        map.setMapTypeId('hybrid');
    });
/*-----------------------------------------------------------------------------*/