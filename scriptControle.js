
/*--------------------DATABASE-SIMULATION-------------------------------*/
let posicoes = [
    {lat: -18.5475, lng: -42.7689, msg: 'Espancada', nome: 'raposa', img: 'posa.png', link: 'https://www.peritoanimal.com.br/a-raposa-como-animal-de-estimacao-20876.html'},
    {lat: -18.5465, lng: -42.7689, msg: 'Atropelado', nome: 'Cachorro', img: 'dog.png', link: 'https://www.portaldodog.com.br/cachorros/'},
    {lat: -18.5460, lng: -42.7679, msg: 'Picada na foice', nome: 'Cobra Sirucucu', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'},
    {lat: -18.5535, lng: -42.7610, msg: 'Pisada', nome: 'Cobra Sandaia', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'},
    {lat: -18.5530, lng: -42.7605, msg: 'Bebeu veneno', nome: 'Cobra Sucuri', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'},
    {lat: -18.5560, lng: -42.7605, msg: 'Bebeu veneno', nome: 'Cobra Sucuri', img: 'cobra.png', link: 'https://pt.wikipedia.org/wiki/Cobra'}
];

let marcadores = {};;
/*----------------------------------------------------------------------*/




/*--------------SEPARA MARCAÇÕES POR AREAS-------------------------------*/
function separarPorAreas(posicoes) {
// Função para calcular a distância entre duas coordenadas geográficas
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371; // Raio médio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  return distancia;
}

// Função auxiliar para converter graus em radianos
function toRad(graus) {
  return graus * Math.PI / 180;
}

const areas = [];

for (const posicao of posicoes) {
  let areaEncontrada = false;

  // Verificar se a posição está próxima de alguma área existente
  for (const area in areas) {
    const primeiraPosicao = areas[area][0];
    const distancia = calcularDistancia(
      primeiraPosicao.lat, primeiraPosicao.lng,
      posicao.lat, posicao.lng
    );

    // Se a posição estiver próxima da área, adicioná-la à área existente
    if (distancia <= 1) { // Defina a distância desejada em km
      areas[area].push(posicao);
      areaEncontrada = true;
      break;
    }
  }

  // Se a posição não estiver próxima de nenhuma área existente, criar uma nova área
  if (!areaEncontrada) {
    const novaArea = `area${Object.keys(areas).length + 1}`;
    areas[novaArea] = [posicao];
  }
}

return areas;
}


const areasProximas = separarPorAreas(posicoes);
//console.log(areasProximas);
/*----------------------------------------------------------------------*/





/*---------------------FUNÇÕES-AUXILIARES-------------------------------*/
function geraCirculos(){
    
    const quantidadeAreas = Object.keys(areasProximas).length;

    for(let i = 0; i < quantidadeAreas; i++){

        let currentArray = areasProximas['area'+(i+1)];

        /*Inicializando variavel*/
        let minLat = currentArray[0].lat;
        let maxLat = currentArray[0].lat;
        let minLng = currentArray[0].lng;
        let maxLng = currentArray[0].lng;
        
        for (let j = 1; j < currentArray.length; j++) {
            if (currentArray[j].lat < minLat) {
                minLat = currentArray[j].lat;
            }
            if (currentArray[j].lat > maxLat) {
                maxLat = currentArray[j].lat;
            }
            if (currentArray[j].lng < minLng) {
                minLng = currentArray[j].lng;
            }
            if (currentArray[j].lng > maxLng) {
                maxLng = currentArray[j].lng;
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
        for (let j = 0; j < currentArray.length; j++) {
            const distance = calcularDistancia(centerLat, centerLng, currentArray[j].lat, currentArray[j].lng);
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

        //console.log(radius)
    }
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

function editMarker(markerTitle){
    // marcadores['Cachorro'].title = 'chorro';
    
    let teste = marcadores[markerTitle].infoWindow;
    teste.setContent(`
        <h2>${markerTitle}[Editado]</h2>
        <p>ddddddd</p>
        <a href='#' target='_blank'">verifica no site</a>
        <br/><br/>
        <button>Editar</button>
        <button onClick="deletar()">Deletar</button>
    `)
}

function deletar(markerTitle){
    marcadores[markerTitle].setMap(null);
}

function realizaMarcações(){
    posicoes.map((item, index) => {
        //Adicionar marcador
        var marker = new google.maps.Marker({
            //position: {lat: -18.5485, lng: -42.7659},
            position: {lat: item.lat, lng: item.lng},
            map: map,
            title: item.nome, //leve isso como se fosse um id, o nome aqui deve ser unico
            //label: 'P',
            icon: {
                url: './'+item.img,
                scaledSize: new google.maps.Size(32, 32)
            },
            animation: google.maps.Animation.DROP, //drop, bounce e pesquise mais se quiser
            //draggable: true
        });

        let infoWindow = new google.maps.InfoWindow({
            content: `
                <h2>${item.nome}</h2>
                <p>${item.msg}</p>
                <a href='${item.link}' target='_blank'">verifica no site</a>
                <br/><br/>
                <button onClick="editMarker('${item.nome}')">Editar</button>
                <button onClick="deletar('${item.nome}')">Deletar</button>
            `
            // position: marker.getPosition(),
            // maxWidth: 200
        }); 

        marker.addListener('click', function() {
            marker.infoWindow = infoWindow;
            infoWindow.open(map, marker);
        });

        marcadores[marker.title] = marker;
        
    });
}

function newMarker(){
    map.addListener('dblclick', function(e){
        let latitude = e.latLng.lat();
        let longitude = e.latLng.lng();

        //Adiciona um marcador
        //Adicionar marcador
        var marker = new google.maps.Marker({
            //position: {lat: -18.5485, lng: -42.7659},
            position: {lat: latitude, lng: longitude},
            map: map,
            title: 'Novo marcador',
            //label: 'P',
            icon: {
                url: './posa.png',
                scaledSize: new google.maps.Size(32, 32)
            },
            animation: google.maps.Animation.DROP, //drop, bounce e pesquise mais se quiser
            //draggable: true
        });

        let infoWindow = new google.maps.InfoWindow({
            content: `
                <h2>Novo</h2>
                <p>nova marcação</p>
                <a href='https://google.com' target='_blank'">verifica no site</a>
                <br/><br/>
                <button onClick="editMarker('Novo marcador')">Editar</button>
                <button onClick="deletar('Novo marcador')">Deletar</button>
            `
            // position: marker.getPosition(),
            // maxWidth: 200
        }); 

        marker.addListener('click', function() {
            marker.infoWindow = infoWindow;
            infoWindow.open(map, marker);
        });

        marcadores[marker.title] = marker;
    });
}
/*----------------------------------------------------------------------*/






/*-----------------INICIO DO CÓDIGO DO MAPA-----------------------------*/
function initMap(){

    //Cria o mapa e renderiza o mesmo na tela
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -18.5530, lng: -42.7659},
        zoom: 14,
        mapTypeId: 'hybrid', //roadmap, satellite, hybrid, terrain
    });
    

    //Realiza as marcações que veio do banco de dados no mapa
    realizaMarcações();


    //Adiciona uma barra de pesquisa para procurar por uma localização
    barraPesquisa();


    //Gera os circulos que demarca as ocorrencias em cada área
    geraCirculos();


    //Ativa ação de adicionar nova marcação
    newMarker();
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

document.getElementById('terrain').addEventListener('click', function() {
    map.setMapTypeId('terrain');
});
/*-----------------------------------------------------------------------------*/