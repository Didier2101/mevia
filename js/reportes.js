/**
 * reportes.js — Reportes financieros (Coltanques)
 */

let filteredReporte = [];

async function obtenerReporte() {
    try {
        const data = await apiFetch('/reporte');
        // Si data es un array, lo tomamos directo; si es objeto buscamos .reporte
        filteredReporte = Array.isArray(data) ? data : (data.reporte || []);
        
        renderTablaReporte();
    } catch (e) {
        console.error('obtenerReporte:', e);
    }
}

function filtrarReporte() {
    const query = document.getElementById('reporte-search').value.toLowerCase();
    filteredReporte = DATA_MOCK.reporte.filter(r => 
        r.placa.toLowerCase().includes(query) || 
        r.conductor.toLowerCase().includes(query) ||
        r.cod_flete.toLowerCase().includes(query) ||
        r.cliente.toLowerCase().includes(query)
    );
    renderTablaReporte();
}

function renderTablaReporte() {
    const tbody = document.getElementById('reporte-body');
    const tfoot = document.getElementById('reporte-totales');
    if (!tbody) return;

    if (filteredReporte.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron registros.</td></tr>';
        if (tfoot) tfoot.innerHTML = '';
        return;
    }

    const fmt = n => `$${Number(n).toLocaleString('es-CO')}`;
    const fmtPct = n => `${Number(n).toLocaleString('es-CO')}%`;

    tbody.innerHTML = filteredReporte.map(r => {
        const margenClass = r.margen >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';
        return `<tr>
            <td><strong>${r.cod_flete}</strong></td>
            <td>${r.cliente}</td>
            <td><span class="badge" style="background:#2d2d2d;color:#fff;padding:4px 8px;">${r.placa}</span></td>
            <td>${r.conductor}</td>
            <td style="font-size:0.75rem;color:var(--text-muted)">${r.fecha_asignacion}</td>
            <td><strong>${fmt(r.costo_total)}</strong></td>
            <td style="color:var(--primary);font-weight:800">${fmt(r.venta)}</td>
            <td><span class="${margenClass}">${fmtPct(r.margen)}</span></td>
            <td>
                <button class="btn-action primary" onclick="verDetalleReporte('${r.cod_flete}')" title="Ver Detalles">
                    <i class="fas fa-eye"></i> Detalles
                </button>
            </td>
        </tr>`;
    }).join('');

    // Fila de totales
    if (tfoot) {
        const sum = key => filteredReporte.reduce((a, r) => a + Number(r[key] || 0), 0);
        const totalCosto  = sum('costo_total');
        const totalVenta  = sum('venta');
        // Si el margen ahora es porcentual por fila, el total debería ser el promedio o recalculado
        // Por ahora, seguimos la instrucción de cambiar el signo.
        const totalMargen = filteredReporte.length > 0 ? (sum('margen') / filteredReporte.length) : 0; 
        const mc = totalMargen >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';
        tfoot.innerHTML = `<tr style="font-weight:800; border-top: 2px solid #eee; background: #fafafa;">
            <td colspan="5">TOTALES FILTRADOS</td>
            <td>${fmt(totalCosto)}</td>
            <td style="color:var(--primary)">${fmt(totalVenta)}</td>
            <td><span class="${mc}">${fmtPct(totalMargen)}</span></td>
            <td></td>
        </tr>`;
    }
}

function verDetalleReporte(codFlete) {
    const r = filteredReporte.find(x => x.cod_flete === codFlete) || DATA_MOCK.reporte.find(x => x.cod_flete === codFlete);
    if (!r) return;

    document.getElementById('panel-reporte-titulo').innerText = `Operación: ${r.cod_flete}`;
    
    const fmt = n => `$${Number(n).toLocaleString('es-CO')}`;
    const fmtPct = n => `${Number(n).toLocaleString('es-CO')}%`;

    const htmlInfo = `
        <div class="vehiculo-detail-grid">
            <div class="detail-item"><label>Flete</label><span>${r.cod_flete}</span></div>
            <div class="detail-item"><label>Cliente</label><span>${r.cliente}</span></div>
            <div class="detail-item"><label>Producto</label><span>${r.producto}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Placa Vehículo</label><span>${r.placa}</span></div>
            <div class="detail-item"><label>Conductor</label><span>${r.conductor}</span></div>
            <div class="detail-item"><label>Fecha Asignación</label><span>${r.fecha_asignacion}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Distancia Vacío</label><span>${r.distancia_vacio_km} km</span></div>
            <div class="detail-item"><label>Distancia Viaje</label><span>${r.distancia_viaje_km} km</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Combustible</label><span>${fmt(r.costo_combustible)}</span></div>
            <div class="detail-item"><label>Peajes</label><span>${fmt(r.costo_peajes)}</span></div>
            <div class="detail-item"><label>Costos Fijos</label><span>${fmt(r.costos_fijos)}</span></div>
            <div class="detail-item"><label>Costo Total</label><strong>${fmt(r.costo_total)}</strong></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Venta Total</label><strong style="color:var(--primary)">${fmt(r.venta)}</strong></div>
            <div class="detail-item"><label>Margen Operativo</label><strong style="color:${r.margen >= 0 ? '#10b981' : 'var(--primary)'}">${fmtPct(r.margen)}</strong></div>
        </div>
    `;

    document.getElementById('panel-reporte-body').innerHTML = htmlInfo;
    document.getElementById('reporte-modal').classList.add('open');
}

function cerrarPanelReporte() {
    document.getElementById('reporte-modal').classList.remove('open');
}
