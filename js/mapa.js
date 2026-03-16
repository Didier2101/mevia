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
    mapa = L.map('map', {
        zoomControl: false, // Deshabilitar zoom default para ponerlo personalizado o dejarlo limpio
        scrollWheelZoom: true
    }).setView([4.5709, -74.2973], 6);

    // Tile Layer Premium: CartoDB Voyager (Más limpio y moderno)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; MEVIA | IA Optimizer',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mapa);

    // Control de zoom en la derecha para no estorbar
    L.control.zoom({ position: 'bottomright' }).addTo(mapa);
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

    // Estilos de líneas más "Premium" (Gradientes simulados con sombras)
    capaVacio    = L.polyline(puntosVacio.map(p => [p[1], p[0]]),   { color: '#64748b', weight: 4, opacity: 0.6, dashArray: '8, 8' }).addTo(mapa);
    capaRetorno  = L.polyline(puntosRetorno.map(p => [p[1], p[0]]), { color: '#ef4444', weight: 4, opacity: 0.6, dashArray: '5, 5' }).addTo(mapa);
    capaRuta     = L.polyline(puntosViaje.map(p => [p[1], p[0]]),   { color: '#e30613', weight: 7, opacity: 0.9, lineCap: 'round', shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' }).addTo(mapa);

    const icons = {
        camion:  L.divIcon({ html: '<div class="map-marker-premium truck"><i class="fas fa-truck-moving"></i></div>', className: 'custom-div-icon', iconSize: [40, 40], iconAnchor: [20, 20] }),
        origen:  L.divIcon({ html: '<div class="map-marker-premium origin"><i class="fas fa-location-dot"></i></div>', className: 'custom-div-icon', iconSize: [36, 48], iconAnchor: [18, 48] }),
        destino: L.divIcon({ html: '<div class="map-marker-premium destination"><i class="fas fa-flag-checkered"></i></div>', className: 'custom-div-icon', iconSize: [36, 48], iconAnchor: [18, 48] }),
        parqueo: L.divIcon({ html: '<div class="map-marker-premium parking"><i class="fas fa-parking"></i></div>', className: 'custom-div-icon', iconSize: [36, 48], iconAnchor: [18, 48] }),
        peaje:   L.divIcon({ html: '<div class="map-marker-peaje"><i class="fas fa-money-bill-1"></i></div>', className: 'custom-div-icon', iconSize: [24, 24], iconAnchor: [12, 12] })
    };

    // Marcadores: Usamos los puntos reales de la ruta para que coincidan perfectamente
    if (puntosViaje && puntosViaje.length > 0) {
        const startPoint = puntosViaje[0];
        const endPoint = puntosViaje[puntosViaje.length - 1];
        marcadores.push(L.marker([startPoint[1], startPoint[0]], { icon: icons.origen }).addTo(mapa).bindPopup('Cargue (Origen)'));
        marcadores.push(L.marker([endPoint[1],   endPoint[0]],   { icon: icons.destino }).addTo(mapa).bindPopup('Descargue (Destino)'));
    } else {
        marcadores.push(L.marker([origen[0],    origen[1]],    { icon: icons.origen  }).addTo(mapa).bindPopup('Cargue (Origen)'));
        marcadores.push(L.marker([destino[0],   destino[1]],   { icon: icons.destino }).addTo(mapa).bindPopup('Descargue (Destino)'));
    }

    marcadores.push(L.marker([posCamion[0], posCamion[1]], { icon: icons.camion }).addTo(mapa).bindPopup('Punto de Partida (Vehículo)'));

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
