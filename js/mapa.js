/**
 * mapa.js — Módulo de control del mapa Leaflet (Coltanques)
 */

let mapa = null;
let capaRuta = null;
let capaVacio = null;
let capaRetorno = null;
let marcadores = [];

function inicializarMapa() {
    if (mapa) return;
    mapa = L.map('map').setView([4.5709, -74.2973], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Coltanques'
    }).addTo(mapa);
}

function mostrarTrayectoCompletoEnMapa(posCamion, puntosVacio, puntosViaje, origen, destino, peajes = [], puntosRetorno = []) {
    inicializarMapa();
    const placeholder = document.getElementById('map-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    if (capaRuta) mapa.removeLayer(capaRuta);
    if (capaVacio) mapa.removeLayer(capaVacio);
    if (capaRetorno) mapa.removeLayer(capaRetorno);
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];

    capaVacio    = L.polyline(puntosVacio.map(p => [p[1], p[0]]),   { color: '#6b7280', weight: 6, opacity: 0.8 }).addTo(mapa);
    capaRetorno  = L.polyline(puntosRetorno.map(p => [p[1], p[0]]), { color: '#dc2626', weight: 6, opacity: 0.8 }).addTo(mapa);
    capaRuta     = L.polyline(puntosViaje.map(p => [p[1], p[0]]),   { color: '#10b981', weight: 8, opacity: 0.9 }).addTo(mapa);

    const icons = {
        camion:  L.divIcon({ html: '<div style="background:#111; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4);"><i class="fas fa-truck" style="font-size:18px;"></i></div>', className: 'custom-div-icon', iconSize: [34, 34], iconAnchor: [17, 17] }),
        origen:  L.divIcon({ html: '<div style="background:#10b981; color:white; width:30px; height:30px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4);"><i class="fas fa-map-marker-alt" style="transform:rotate(45deg); font-size:14px;"></i></div>', className: 'custom-div-icon', iconSize: [30, 30], iconAnchor: [15, 30] }),
        destino: L.divIcon({ html: '<div style="background:#dc2626; color:white; width:30px; height:30px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4);"><i class="fas fa-flag-checkered" style="transform:rotate(45deg); font-size:14px;"></i></div>', className: 'custom-div-icon', iconSize: [30, 30], iconAnchor: [15, 30] }),
        parqueo: L.divIcon({ html: '<div style="background:#2563eb; color:white; width:30px; height:30px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4);"><i class="fas fa-parking" style="transform:rotate(45deg); font-size:14px;"></i></div>', className: 'custom-div-icon', iconSize: [30, 30], iconAnchor: [15, 30] }),
        peaje:   L.divIcon({ html: '<i class="fas fa-id-card" style="color:#f59e0b; font-size:18px;"></i>', className: 'custom-div-icon', iconSize: [20, 20] })
    };

    marcadores.push(L.marker([posCamion[0], posCamion[1]], { icon: icons.camion }).addTo(mapa).bindPopup('Punto de Partida (Vehículo)'));
    marcadores.push(L.marker([origen[0],    origen[1]],    { icon: icons.origen  }).addTo(mapa).bindPopup('Cargue (Origen)'));
    marcadores.push(L.marker([destino[0],   destino[1]],   { icon: icons.destino }).addTo(mapa).bindPopup('Descargue (Destino)'));

    if (puntosRetorno && puntosRetorno.length > 0) {
        const lastPoint = puntosRetorno[puntosRetorno.length - 1];
        marcadores.push(L.marker([lastPoint[1], lastPoint[0]], { icon: icons.parqueo }).addTo(mapa).bindPopup('Parqueo Final'));
    }

    peajes.forEach(p => {
        marcadores.push(
            L.marker([p.lat, p.lon], { icon: icons.peaje })
             .addTo(mapa)
             .bindPopup(`<b>${p.nombre}</b><br>$${p.costo.toLocaleString()}`)
        );
    });

    const grupo = new L.featureGroup([capaRuta, capaVacio, capaRetorno, ...marcadores]);
    mapa.fitBounds(grupo.getBounds(), { padding: [50, 50] });
    setTimeout(() => mapa.invalidateSize(), 200);
}
