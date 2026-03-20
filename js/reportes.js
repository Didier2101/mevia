/**
 * reportes.js — Reportes financieros (Coltanques)
 */

let allReporte = []; // Cache local
let filteredReporte = [];
let margenTotalGeneral = 0; // Se almacena el margen global del backend
let apiFetchError = false;

// Funciones de formateo globales para asegurar consistencia y evitar cálculos en el front
const fmtReporte = n => {
    if (n === null || n === undefined) return '$0';
    // Se eliminan los decimales de los precios como se solicitó
    return '$' + Math.round(Number(n)).toLocaleString('es-CO');
};

const fmtPctReporte = n => {
    if (n === null || n === undefined) return '0,00%';
    return Number(n).toLocaleString('es-CO', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }) + '%';
};

const fmtFechaReporte = f => {
    if (!f) return '';
    try {
        const d = new Date(f.replace(' ', 'T')); // Maneja formato 'YYYY-MM-DD HH:mm'
        if (isNaN(d.getTime())) return f;
        
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = meses[d.getMonth()];
        const anio = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        
        return `${dia} - ${mes} - ${anio} : ${hora}:${mins}`;
    } catch (e) {
        return f;
    }
};

async function obtenerReporte() {
    let fechaInicio = document.getElementById('reporte-fecha-inicio').value;
    let fechaFin = document.getElementById('reporte-fecha-fin').value;

    // Si falta alguna fecha, no consultamos el backend (según lógica del back)
    if (!fechaInicio || !fechaFin) {
        limpiarReporte("Seleccione una fecha de inicio y una de fin para generar el reporte operativo.");
        return;
    }

    // Mostrar contenedor de resultados y ocultar bienvenida
    document.getElementById('reporte-resultados').style.display = 'block';
    document.getElementById('reporte-welcome').style.display = 'none';

    const endpoint = `/reporte?inicio=${fechaInicio}&fin=${fechaFin}`;
    
    ui_mostrarCarga('reporte-body', 'Consultando historial de fletes...', 9);

    try {
        apiFetchError = false;
        const data = await apiFetch(endpoint);
        console.log('DATA_REPORTE_API', data);
        
        // El back ahora envía un objeto con {fletes: [...], margen_total_general: X}
        allReporte = data.fletes || [];
        margenTotalGeneral = data.margen_total_general !== undefined ? data.margen_total_general : 0;
        filteredReporte = allReporte;
        
        renderTablaReporte();
        renderGraficasReporte();
    } catch (e) {
        console.error('obtenerReporte:', e);
        apiFetchError = true;
        renderTablaReporte();
    }
}

function limpiarReporte(mensaje) {
    document.getElementById('reporte-resultados').style.display = 'none';
    document.getElementById('reporte-welcome').style.display = 'block';

    const tbody = document.getElementById('reporte-body');
    const tfoot = document.getElementById('reporte-totales');
    if (tbody) tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:3rem; color:var(--text-muted); font-style:italic;"><i class="fas fa-calendar-alt" style="display:block; font-size:2rem; margin-bottom:10px; opacity:0.3;"></i> ${mensaje}</td></tr>`;
    if (tfoot) tfoot.innerHTML = '';
    
    // Destruir gráficas si existen
    ['reporteFinanceChart', 'reporteCostsChart'].forEach(id => {
        const ctx = document.getElementById(id);
        if (ctx) {
            const chart = Chart.getChart(ctx);
            if (chart) chart.destroy();
        }
    });
}

function renderGraficasReporte() {
    // 1. Gráfica de Rendimiento (Barras Comparativas)
    const ctxFinance = document.getElementById('reporteFinanceChart');
    if (ctxFinance) {
        const existingChart = Chart.getChart(ctxFinance);
        if (existingChart) existingChart.destroy();

        const totalVenta = filteredReporte.reduce((a, r) => a + (Number(r.venta) || 0), 0);
        const totalCosto = filteredReporte.reduce((a, r) => a + (Number(r.costo_total) || 0), 0);

        new Chart(ctxFinance, {
            type: 'bar',
            data: {
                labels: ['Consolidado Operativo'],
                datasets: [
                    {
                        label: 'Ventas Totales',
                        data: [totalVenta],
                        backgroundColor: '#e30613'
                    },
                    {
                        label: 'Costos Totales',
                        data: [totalCosto],
                        backgroundColor: '#333'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { callback: (v) => '$' + (v / 1000000).toFixed(1) + 'M' }
                    }
                }
            }
        });
    }
}

function filtrarReporte() {
    const query = document.getElementById('reporte-search').value.toLowerCase();
    filteredReporte = allReporte.filter(r => 
        r.placa.toLowerCase().includes(query) || 
        r.conductor.toLowerCase().includes(query) ||
        r.cod_flete.toLowerCase().includes(query) ||
        r.cliente.toLowerCase().includes(query)
    );
    renderTablaReporte();
    renderGraficasReporte();
}

function renderTablaReporte() {
    const tbody = document.getElementById('reporte-body');
    const tfoot = document.getElementById('reporte-totales');
    if (!tbody) return;

    if (apiFetchError) {
        ui_mostrarError('reporte-body', obtenerReporte, "No se pudo establecer conexión con el servidor para consolidar los datos financieros.", 10);
        if (tfoot) tfoot.innerHTML = '';
        return;
    }

    if (filteredReporte.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron registros.</td></tr>';
        if (tfoot) tfoot.innerHTML = '';
        return;
    }

    const fmt = fmtReporte;
    const fmtPct = fmtPctReporte;
    const fmtF = fmtFechaReporte;

    tbody.innerHTML = filteredReporte.map(r => {
        const margenClass = r.margen >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';
        const mtgClass = r.margen_total_general >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';
        return `<tr>
            <td><strong>${r.cod_flete}</strong></td>
            <td>${r.cliente}</td>
            <td><span class="badge" style="background:#2d2d2d;color:#fff;padding:4px 8px;">${r.placa}</span></td>
            <td>${r.conductor}</td>
            <td style="font-size:0.75rem;color:var(--text-muted)">${fmtF(r.fecha_asignacion)}</td>
            <td><strong>${fmt(r.costo_total)}</strong></td>
            <td style="font-weight:800">${fmt(r.venta)}</td>
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
        // Sumamos solo lo que es necesario para el filtrado, pero el margen GRAL lo tomamos directo del back (primer registro)
        const sum = key => filteredReporte.reduce((a, r) => a + Number(r[key] || 0), 0);
        const totalCosto  = sum('costo_total');
        const totalVenta  = sum('venta');
        
        // No hacemos cálculos de margen en el front, usamos el que viene del back (margenTotalGeneral)
        // aunque si está filtrado, mostramos el del primer registro como fallback
        const dispMargen = (filteredReporte.length === allReporte.length) ? margenTotalGeneral : (filteredReporte[0]?.margen || 0);

        const mc = dispMargen >= 0 ? 'reporte-margen-pos' : 'reporte-margen-neg';

        tfoot.innerHTML = `<tr style="font-weight:800; border-top: 2px solid #eee; background: #fafafa;">
            <td colspan="5">CONSOLIDADO</td>
            <td>${fmt(totalCosto)}</td>
            <td>${fmt(totalVenta)}</td>
            <td><span class="${mc}">${fmtPct(dispMargen)}</span></td>
            <td></td>
        </tr>`;
    }
}

function verDetalleReporte(codFlete) {
    const r = allReporte.find(x => x.cod_flete === codFlete);
    if (!r) return;

    document.getElementById('panel-reporte-titulo').innerText = `Operación: ${r.cod_flete}`;
    
    const fmt = fmtReporte;
    const fmtPct = fmtPctReporte;
    const fmtF = fmtFechaReporte;

    const htmlInfo = `
        <div class="vehiculo-detail-grid">
            <div class="detail-item"><label>Flete</label><span>${r.cod_flete}</span></div>
            <div class="detail-item"><label>Cliente</label><span>${r.cliente}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Placa Vehículo</label><span>${r.placa}</span></div>
            <div class="detail-item"><label>Conductor</label><span>${r.conductor}</span></div>
            <div class="detail-item"><label>Fecha Asignación</label><span>${fmtF(r.fecha_asignacion)}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Costo Total</label><strong>${fmt(r.costo_total)}</strong></div>
            <div class="detail-item"><label>Venta Total</label><strong>${fmt(r.venta)}</strong></div>
            <div class="detail-item"><label>Margen Operativo</label><strong style="color:${r.margen >= 0 ? '#10b981' : '#ff4d4d'}">${fmtPct(r.margen)}</strong></div>
        </div>
    `;

    document.getElementById('panel-reporte-body').innerHTML = htmlInfo;
    document.getElementById('reporte-modal').classList.add('open');
}

function cerrarPanelReporte() {
    document.getElementById('reporte-modal').classList.remove('open');
}
