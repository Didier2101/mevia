/**
 * conductores.js — Gestión de conductores (Coltanques)
 */

let currentPage = 1;
const ITEMS_PER_PAGE = 7;
let allDrivers = []; // Cache local para busquedas
let filteredDrivers = [];
let apiFetchError = false;

async function obtenerConductores() {
    ui_mostrarCarga('conductores-body', 'Cargando conductores...', 6);

    try {
        apiFetchError = false;
        const data = await apiFetch('/conductores');
        console.log('DATA_CONDUCTORES', data);
        // Si data es un array, lo tomamos directo; si es objeto buscamos .conductores
        allDrivers = Array.isArray(data) ? data : (data.conductores || []);
        filteredDrivers = allDrivers;
        
        renderTablaConductores();
        renderPagination();
    } catch (e) {
        console.error('obtenerConductores:', e);
        apiFetchError = true;
        renderTablaConductores();
    }
}

function filtrarConductores() {
    const query = document.getElementById('conductores-search').value.toLowerCase();
    filteredDrivers = allDrivers.filter(c => 
        c.nombre.toLowerCase().includes(query) || 
        c.cod_empleado.toLowerCase().includes(query)
    );
    currentPage = 1; // Reset a primera página al filtrar
    updateView();
}

function renderTablaConductores() {
    const tbody = document.getElementById('conductores-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (apiFetchError) {
        ui_mostrarError('conductores-body', obtenerConductores, "No se pudo establecer conexión con el servidor para obtener la lista de conductores.", 6);
        return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = filteredDrivers.slice(start, end);

    if (paginatedItems.length === 0 && filteredDrivers.length > 0) {
        currentPage = 1;
        renderTablaConductores();
        return;
    } else if (paginatedItems.length === 0 && filteredDrivers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron conductores.</td></tr>`;
        return;
    }

    paginatedItems.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.cod_empleado}</td>
            <td><strong>${c.nombre}</strong></td>
            <td>
                <span class="badge ${c.estado_operativo === 'Activo' ? 'badge-success' : (c.estado_operativo === 'En Ruta' ? 'badge-assigned' : 'badge-pending')}">
                    ${c.estado_operativo}
                </span>
            </td>
            <td>${c.vacaciones}</td>
            <td>${c.telefono}</td>
            <td>
                <button class="btn-action primary" onclick="verDetalleConductor('${c.cod_empleado}')" title="Ver Detalles">
                    <i class="fas fa-eye"></i> Detalles
                </button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function renderPagination() {
    const pagination = document.getElementById('conductores-pagination');
    if (!pagination) return;
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;
    
    // Prev Button
    const btnPrev = document.createElement('button');
    btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = () => { if(currentPage > 1) { currentPage--; updateView(); } };
    pagination.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => { currentPage = i; updateView(); };
        pagination.appendChild(btn);
    }

    // Next Button
    const btnNext = document.createElement('button');
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { if(currentPage < totalPages) { currentPage++; updateView(); } };
    pagination.appendChild(btnNext);
}

function updateView() {
    renderTablaConductores();
    renderPagination();
}

/* --- PANEL LATERAL DE DETALLES --- */
function verDetalleConductor(codEmpleado) {
    const c = allDrivers.find(x => x.cod_empleado === codEmpleado);
    if (!c) return;

    document.getElementById('panel-conductor-titulo').innerText = `Conductor: ${c.nombre}`;
    
    const htmlInfo = `
        <div class="vehiculo-detail-grid">
            <div class="detail-item"><label>Código Empleado</label><span>${c.cod_empleado}</span></div>
            <div class="detail-item"><label>Cédula</label><span>${c.cedula}</span></div>
            <div class="detail-item"><label>Nombre Completo</label><span>${c.nombre}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Teléfono</label><span>${c.telefono}</span></div>
            <div class="detail-item"><label>Puntos / Calificación</label><span><strong>${c.puntos} ⭐</strong></span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Estado Operativo</label><span>${c.estado_operativo}</span></div>
            <div class="detail-item"><label>Vacaciones</label><span>${c.vacaciones}</span></div>
            <div class="detail-item"><label>Incapacidad</label><span>${c.incapacidad}</span></div>
            <div class="detail-item"><label>Vehículo Habitual</label><span>${c.vehiculo_habitual}</span></div>
        </div>
    `;

    document.getElementById('panel-conductor-body').innerHTML = htmlInfo;
    document.getElementById('conductor-modal').classList.add('open');
}

function cerrarPanelConductor() {
    document.getElementById('conductor-modal').classList.remove('open');
}
