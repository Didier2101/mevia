let mapa = null;
let capaRuta = null;
let capaVacio = null;
let marcadores = [];
let recomendacionesActuales = []; // Persistencia temporal para auditoría

function mostrarPestana(pestana) {
    document.querySelectorAll('[id^="tab-"]').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.top-nav li').forEach(li => li.classList.remove('active'));

    const tab = document.getElementById(`tab-${pestana}`);
    if (tab) tab.style.display = 'block';

    const activeLink = document.getElementById(`nav-${pestana}`);
    if (activeLink) activeLink.classList.add('active');

    const titulos = {
        'dashboard': 'CENTRO DE CONTROL',
        'fletes': 'LOGÍSTICA DE FLETES',
        'vehiculos': 'PARQUE AUTOMOTOR',
        'conductores': 'GESTIÓN DE CONDUCTORES',
        'reporte': 'RENDIMIENTO FINANCIERO'
    };
    if (titulos[pestana]) document.getElementById('page-title').innerText = titulos[pestana];

    // Asegurar que el contenedor principal esté visible y el de asignación oculto
    document.getElementById('main-view-container').style.display = 'block';
    document.getElementById('assignment-view').style.display = 'none';

    if (pestana === 'dashboard') obtenerDatosDashboard();
    else if (pestana === 'fletes') obtenerFletes();
    else if (pestana === 'vehiculos') obtenerVehiculos();
    else if (pestana === 'conductores') obtenerConductores();
    else if (pestana === 'reporte') obtenerReporte();
}

const Notificacion = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
});

function inicializarMapa() {
    if (mapa) return;
    mapa = L.map('map').setView([4.5709, -74.2973], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Coltanques'
    }).addTo(mapa);
}

function mostrarTrayectoCompletoEnMapa(posCamion, puntosVacio, puntosViaje, origen, destino, peajes = []) {
    inicializarMapa();
    const placeholder = document.getElementById('map-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    if (capaRuta) mapa.removeLayer(capaRuta);
    if (capaVacio) mapa.removeLayer(capaVacio);
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];

    capaVacio = L.polyline(puntosVacio.map(p => [p[1], p[0]]), { color: '#4b5563', weight: 6, opacity: 0.9 }).addTo(mapa);
    capaRuta = L.polyline(puntosViaje.map(p => [p[1], p[0]]), { color: '#dc2626', weight: 8, opacity: 0.9 }).addTo(mapa);

    const icons = {
        camion: L.divIcon({ html: '<i class="fas fa-truck" style="color:#111; font-size:24px;"></i>', className: 'custom-div-icon', iconSize: [30, 30] }),
        origen: L.divIcon({ html: '<i class="fas fa-box" style="color:#222; font-size:20px;"></i>', className: 'custom-div-icon', iconSize: [25, 25] }),
        destino: L.divIcon({ html: '<i class="fas fa-flag-checkered" style="color:#dc2626; font-size:24px;"></i>', className: 'custom-div-icon', iconSize: [30, 30] }),
        peaje: L.divIcon({ html: '<i class="fas fa-id-card" style="color:#f59e0b; font-size:18px;"></i>', className: 'custom-div-icon', iconSize: [20, 20] })
    };

    marcadores.push(L.marker([posCamion[0], posCamion[1]], { icon: icons.camion }).addTo(mapa).bindPopup("Camión"));
    marcadores.push(L.marker([origen[0], origen[1]], { icon: icons.origen }).addTo(mapa).bindPopup("Carga"));
    marcadores.push(L.marker([destino[0], destino[1]], { icon: icons.destino }).addTo(mapa).bindPopup("Destino"));

    peajes.forEach(p => {
        marcadores.push(L.marker([p.lat, p.lon], { icon: icons.peaje }).addTo(mapa).bindPopup(`<b>${p.nombre}</b><br>$${p.costo.toLocaleString()}`));
    });

    const grupo = new L.featureGroup([capaRuta, capaVacio, ...marcadores]);
    mapa.fitBounds(grupo.getBounds(), { padding: [50, 50] });
    setTimeout(() => mapa.invalidateSize(), 200);
}

async function abrirVistaAsignacion(id) {
    document.getElementById('main-view-container').style.display = 'none';
    document.getElementById('assignment-view').style.display = 'block';
    document.body.classList.add('immersive-mode'); // Activar pantalla completa


    document.getElementById('assignment-loading').style.display = 'block';
    document.getElementById('recommendation-container').innerHTML = '';

    try {
        // MOCK: Simulación de API
        const flete = DATA_MOCK.fletes.find(f => f.cod_flete === id);
        const recommendations = DATA_MOCK.recomendaciones[id] || [];
        const datos = { flete, recommendations };
        
        await new Promise(r => setTimeout(r, 800)); // Simular delay
        document.getElementById('assignment-loading').style.display = 'none';

        if (datos.error || !datos.flete) {
            Notificacion.fire({ icon: 'error', title: datos.error || 'Flete no encontrado' });
            if (typeof volverAlDashboardLocal === 'function') volverAlDashboardLocal();
            return;
        }

        recomendacionesActuales = datos.recommendations;
        const f = datos.flete;
        
        // Poblar Header Compacto
        if (headerInfo) {
            headerInfo.innerHTML = `
                <div class="info-item">
                    <label>CLIENTE</label>
                    <span>${f.cliente}</span>
                </div>
                <div class="info-item">
                    <label>PRODUCTO</label>
                    <span>${f.producto}</span>
                </div>
                <div class="info-item">
                    <label>ORIGEN</label>
                    <span>${f.punto_carga}</span>
                </div>
                <div class="info-item">
                    <label>DESTINO</label>
                    <span>${f.destino_nombre || 'Ver mapa'}</span>
                </div>
                <div class="info-item">
                    <label>CARGA</label>
                    <span>${f.peso} | ${(parseFloat(f.peso) * 1000).toLocaleString()} KG</span>
                </div>
            `;
        }

        const contenedor = document.getElementById('recommendation-container');
        datos.recommendations.forEach((r, i) => {
            const coordO = f.origen.split(',').map(Number);
            const coordD = f.destino.split(',').map(Number);

            contenedor.innerHTML += `
                <div class="rec-card ${i === 0 ? 'best' : ''}">
                    <div class="rec-rank">#${i + 1}</div>
                    <div class="rec-header">
                        <h4>${r.placa} <small>(${r.marca})</small></h4>
                        <strong>$${r.costo_total.toLocaleString()}</strong>
                    </div>
                    <div class="rec-driver-info"><span><i class="fas fa-user"></i> ${r.conductor}</span><span><i class="fas fa-id-card"></i> ${r.licencia}</span></div>
                    <div class="rec-points">
                        <span class="rec-points-label"><i class="fas fa-star" style="color:#f59e0b"></i> Puntos: <strong>${r.puntos_conductor} / 18</strong></span>
                        <div class="rec-points-bar-bg"><div class="rec-points-bar-fill" style="width:${Math.min((r.puntos_conductor / 18) * 100, 100)}%"></div></div>
                    </div>
                    <div class="rec-details">
                        <p><i class="fas fa-truck-moving" style="color:#666"></i> <strong>A Recogida:</strong> ${r.distancia_vacio} km</p>
                        <p><i class="fas fa-route" style="color:#dc2626"></i> <strong>A Destino:</strong> ${r.distancia_viaje} km</p>
                    </div>
                    <div class="rec-final">
                        <button class="btn-detail" onclick="mostrarDetalleRecomendacion(${i})"><i class="fas fa-info-circle"></i> Ver Detalle</button>
                        <button class="btn-maps" style="background: var(--dark-carbon);" onclick='mostrarTrayectoCompletoEnMapa(${JSON.stringify(r.truck_pos)}, ${JSON.stringify(r.route_vacio_points)}, ${JSON.stringify(r.route_points)}, [${coordO}], [${coordD}], ${JSON.stringify(r.peajes)})'>Ver Ruta</button>
                        <button class="btn-assign" style="background: var(--primary);" onclick="asignarCamion('${id}', '${r.cod_vehiculo}')">Asignar Unidad</button>
                    </div>
                </div>`;
        });
    } catch (e) {
        console.error('Error en abrirVistaAsignacion:', e);
        document.getElementById('assignment-loading').style.display = 'none';
        Notificacion.fire({ icon: 'error', title: 'Error al cargar los datos del flete' });
        if (typeof volverAlDashboardLocal === 'function') {
            volverAlDashboardLocal();
        } else {
            document.getElementById('assignment-view').style.display = 'none';
            document.getElementById('main-view-container').style.display = 'block';
        }
    }
}

function mostrarDetalleRecomendacion(index) {
    const r = recomendacionesActuales[index];
    if (!r) return;

    const body = document.getElementById('detail-body');
    body.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-truck"></i> ESTATUS DEL VEHÍCULO</h3>
            <p><strong>PLACA:</strong> ${r.placa} | <strong>CONDUCTOR:</strong> ${r.conductor}</p>
            ${r.km_actual >= r.km_proximo_aceite ? '<div class="badge badge-assigned" style="margin-top:10px; background: #000;">MANTENIMIENTO REQUERIDO</div>' : ''}
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-route"></i> LOGÍSTICA ESTIMADA</h3>
            <div class="cost-breakdown-card">
                <div class="cost-row"><span>DISTANCIA VACÍO</span><span>${r.distancia_vacio} KM</span></div>
                <div class="cost-row"><span>DISTANCIA EN TRÁNSITO</span><span>${r.distancia_viaje} KM</span></div>
                <div class="cost-row"><span>TIEMPO TOTAL OPERATIVO</span><span>${r.tiempo_total_min} MIN</span></div>
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-dollar-sign"></i> ESTRUCTURA DE COSTOS</h3>
            <div class="cost-breakdown-card">
                <div class="cost-row"><span>COSTO COMBUSTIBLE</span><span>$${r.costo_combustible.toLocaleString()}</span></div>
                <div class="cost-row"><span>PEAJES ESTIMADOS</span><span>$${r.costo_peajes.toLocaleString()}</span></div>
                <div class="cost-row"><span>COSTOS FIJOS / VIÁTICOS</span><span>$${r.costos_fijos.toLocaleString()}</span></div>
                <div class="cost-row total"><span>INVERSIÓN TOTAL</span><span>$${r.costo_total.toLocaleString()}</span></div>
            </div>
        </div>
    `;

    document.getElementById('detail-modal').style.display = 'block';
}

function cerrarModalDetalle() {
    document.getElementById('detail-modal').style.display = 'none';
}

// Compatibilidad: si volverAlDashboardLocal no está definida (por ej. en app standalone)
function volverAlDashboard() {
    document.body.classList.remove('immersive-mode');
    const av = document.getElementById('assignment-view');
    const mv = document.getElementById('main-view-container');
    if (av) av.style.display = 'none';
    if (mv) mv.style.display = 'block';
}

async function obtenerDatosDashboard() {
    try {
        // MOCK: Simulación de API
        const fletes = DATA_MOCK.fletes;
        const vehiculos = DATA_MOCK.vehiculos;
        
        await new Promise(r => setTimeout(r, 400)); // Simular delay

        if (document.getElementById('total-fletes')) {
            document.getElementById('total-fletes').innerText = fletes.length;
            document.getElementById('total-pendientes').innerText = fletes.filter(f => f.estado === 'sin_asignar').length;
            document.getElementById('total-vehiculos').innerText = vehiculos.filter(v => v.estado === 'En Ruta').length;
        }

        const tbody = document.getElementById('fletes-body');
        if (tbody) {
            tbody.innerHTML = fletes.map(f => `
                <tr>
                    <td>${f.cod_flete}</td>
                    <td>${f.cliente}</td>
                    <td>${f.producto}</td>
                    <td>${f.peso} Ton</td>
                    <td>${f.punto_carga}</td>
                    <td><span class="badge ${f.estado === 'asignado' ? 'badge-assigned' : 'badge-pending'}">${f.estado}</span></td>
                    <td>
                        ${f.estado === 'sin_asignar'
                    ? `<button class="btn-assign-sm" onclick="abrirVistaAsignacion('${f.cod_flete}')">Ejecutar</button>`
                    : `<button class="btn-unassign-sm" onclick="desasignarCamion('${f.cod_flete}')">Liberar</button>`
                }
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

function obtenerFletes() { obtenerDatosDashboard(); }

async function obtenerReporte() {
    try {
        // MOCK: Simulación de API
        const data = DATA_MOCK.reporte;
        await new Promise(r => setTimeout(r, 300));
        const tbody = document.getElementById('reporte-body');
        const tfoot = document.getElementById('reporte-totales');
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="14" style="text-align:center;color:var(--text-muted);padding:2rem">No hay fletes asignados aún.</td></tr>';
            tfoot.innerHTML = '';
            return;
        }

        const fmt = n => `$${Number(n).toLocaleString('es-CO')}`;

        tbody.innerHTML = data.map(r => {
            const margenClass = r.margen >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';
            return `<tr>
                <td><strong>${r.cod_flete}</strong></td>
                <td>${r.cliente}</td>
                <td><span class="badge" style="background:#111;color:#fff; padding: 4px 8px;">${r.placa}</span></td>
                <td>${r.conductor}</td>
                <td style="font-size:0.75rem;color:var(--text-muted)">${r.fecha_asignacion}</td>
                <td><strong>${fmt(r.costo_total)}</strong></td>
                <td style="color:var(--primary);font-weight:800">${fmt(r.venta)}</td>
                <td><span class="${margenClass}">${fmt(r.margen)}</span></td>
            </tr>`;
        }).join('');

        // Fila de totales
        const sum = key => data.reduce((a, r) => a + Number(r[key] || 0), 0);
        const totalCosto = sum('costo_total');
        const totalVenta = sum('venta');
        const totalMargen = totalVenta - totalCosto;
        const margenClass = totalMargen >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';
        tfoot.innerHTML = `<tr style="background: var(--bg-gray); font-weight: 800;">
            <td colspan="5" style="text-align: right; text-transform: uppercase; letter-spacing: 1px;">TOTALES (${data.length} fletes)</td>
            <td>${fmt(totalCosto)}</td>
            <td style="color:var(--primary)">${fmt(totalVenta)}</td>
            <td><span class="${margenClass}">${fmt(totalMargen)}</span></td>
        </tr>`;
    } catch (e) {
        console.error(e);
        Notificacion.fire({ icon: 'error', title: 'Error al cargar el reporte' });
    }
}

async function obtenerConductores() {
    try {
        // MOCK: Simulación de API
        const data = DATA_MOCK.conductores;
        await new Promise(r => setTimeout(r, 300));
        const tbody = document.getElementById('conductores-body');
        if (tbody) tbody.innerHTML = data.map(c => `
            <tr>
                <td>${c.cod_empleado}</td>
                <td><strong>${c.nombre}</strong></td>
                <td><span class="badge" style="background:#111; color:white">${c.estado_operativo}</span></td>
                <td>${c.licencia}</td>
                <td>${c.vacaciones}</td>
                <td>${c.telefono}</td>
            </tr>
        `).join('');
    } catch (e) { console.error(e); }
}

async function obtenerVehiculos() {
    try {
        // MOCK: Simulación de API
        const data = DATA_MOCK.vehiculos;
        await new Promise(r => setTimeout(r, 300));
        const tbody = document.getElementById('vehiculos-body');
        if (tbody) tbody.innerHTML = data.map(v => {
            const statusClass = v.estado === 'Disponible' ? 'badge-pending' : 'badge-assigned';
            const assignmentClass = v.flete_activo === 'Ninguno' ? '' : 'badge-flete';
            return `
                <tr>
                    <td>${v.cod_vehiculo}</td>
                    <td><strong>${v.placa}</strong></td>
                    <td>${v.km_actual}</td>
                    <td>${v.km_proximo_aceite}</td>
                    <td>${v.estado_llantas}</td>
                    <td><span class="badge ${statusClass}">${v.estado}</span></td>
                    <td>${v.flete_activo === 'Ninguno' ? '<span style="color:var(--text-muted)">Ninguno</span>' : `<span class="badge badge-flete">${v.flete_activo}</span>`}</td>
                </tr>
            `;
        }).join('');
    } catch (e) { console.error(e); }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('#toggle-sidebar i');
    sidebar.classList.toggle('collapsed');

    if (sidebar.classList.contains('collapsed')) {
        icon.classList.replace('fa-chevron-left', 'fa-chevron-right');
    } else {
        icon.classList.replace('fa-chevron-right', 'fa-chevron-left');
    }

    // Invalidar mapa si existe para que se ajuste al nuevo ancho
    if (mapa) {
        setTimeout(() => mapa.invalidateSize(), 400);
    }
}

// Eliminar toggleSidebar ya que el diseño es horizontal
function toggleSidebar() { }

async function asignarCamion(f, v) {
    try {
        // MOCK: Simulación de API
        const flete = DATA_MOCK.fletes.find(fl => fl.cod_flete === f);
        if (flete) flete.estado = 'asignado';
        
        const vehiculo = DATA_MOCK.vehiculos.find(ve => ve.cod_vehiculo === v);
        if (vehiculo) {
            vehiculo.estado = 'En Ruta';
            vehiculo.flete_activo = f;
        }

        const d = { message: 'ASIGNACIÓN EXITOSA - DATOS SINCRONIZADOS' };
        await new Promise(r => setTimeout(r, 500));
        
        if (true) { // Simular éxito
            Notificacion.fire({ icon: 'success', title: d.message, background: '#fff', color: '#000' });
            
            // Si existe la función local para cerrar la vista inmersiva, usarla
            if (typeof volverAlDashboardLocal === 'function') {
                volverAlDashboardLocal();
            }
            
            // Actualizar fletes si estamos en la página de fletes
            if (typeof obtenerFletes === 'function') obtenerFletes();
        } else {
            Notificacion.fire({ icon: 'error', title: 'ERROR EN PROCESO' });
        }
    } catch (e) {
        console.error(e);
        Notificacion.fire({ icon: 'error', title: 'ERROR DE CONEXIÓN' });
    }
}

async function desasignarCamion(f) {
    try {
        // MOCK: Simulación de API
        const flete = DATA_MOCK.fletes.find(fl => fl.cod_flete === f);
        if (flete) flete.estado = 'sin_asignar';
        
        const vehiculo = DATA_MOCK.vehiculos.find(ve => ve.flete_activo === f);
        if (vehiculo) {
            vehiculo.estado = 'Disponible';
            vehiculo.flete_activo = 'Ninguno';
        }

        const d = { message: 'Desasignación exitosa (MOCK)' };
        await new Promise(r => setTimeout(r, 500));
        
        if (true) { // Simular éxito
            Notificacion.fire({ icon: 'success', title: d.message || 'Desasignación exitosa' });
            if (typeof obtenerFletes === 'function') obtenerFletes();
        } else {
            Notificacion.fire({ icon: 'error', title: d.error || 'Error al desasignar' });
        }
    } catch (e) {
        console.error(e);
        Notificacion.fire({ icon: 'error', title: 'Error de conexión' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarPestana('dashboard');
    document.getElementById('api-status').innerText = 'Conectado';
    document.getElementById('status-dot').classList.add('online');
});
