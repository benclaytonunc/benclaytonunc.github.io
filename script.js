const API_URL_ISS = 'https://api.wheretheiss.at/v1/satellites/25544'; // ISS API



async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


async function getISSData() {
    const data = await fetchData(API_URL_ISS);
    const issData = {
        lat: data.latitude,
        lng: data.longitude,
        alt: data.altitude,
        vel: data.velocity
    };
    return issData;
}


function updateISSDataOnDOM(lat, lng, alt, vel) {
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lng;
    document.getElementById('altitude').textContent = alt;
    document.getElementById('velocity').textContent = vel;
}


function updateMarkerPosition(coords, marker) {
    const newPosition = new google.maps.LatLng(coords.lat, coords.lng);
    marker.setPosition(newPosition);
}


function initMap() {
    const initCoords = { lat: 32, lng: -97 }; // Defaults to U.S. coordinates

    updateISSDataOnDOM('Acquiring lattitude...', 'Acquiring longitude...',
        'Acquiring altitude...', 'Acquiring velocity...');

    const map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 4,
            center: initCoords,
            streetViewControl: false,
            mapTypeId: 'hybrid'
        }
    );

    const marker = new google.maps.Marker({
        title: 'ISS',
        position: initCoords,
        map: map,
        clickable: true,
        icon: {
            url: 'images/sattelite-icon.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    setInterval(() => {
        const promise = getISSData();
        promise.then(issData => {
            const coords = { lat: issData.lat, lng: issData.lng };
            map.setCenter(coords);
            updateISSDataOnDOM(issData.lat, issData.lng, issData.alt, issData.vel);
            updateMarkerPosition(coords, marker);
        });
    }, 2000);
}

 /*
function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: issData.lat, lng: issData.lng},
      zoom: 8,
    });
  }
  
  */

window.onload = () => initMap();
