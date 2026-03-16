/**
 * ui.js — Utilidades de interfaz: notificaciones, modal y navegación (Coltanques)
 */

const Notificacion = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
});

let recomendacionesActuales = [];

function cerrarModalDetalle() {
    document.getElementById('detail-modal').style.display = 'none';
}

function mostrarDetalleRecomendacion(index) {
    const r = recomendacionesActuales[index];
    if (!r) return;

    const body = document.getElementById('detail-body');
    body.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-truck"></i> ESTATUS DEL VEHÍCULO</h3>
            <p><strong>PLACA:</strong> ${r.placa} | <strong>CONDUCTOR:</strong> ${r.conductor}</p>
            ${r.km_actual >= r.km_proximo_aceite
                ? '<div class="badge badge-assigned" style="margin-top:10px; background: #000;">MANTENIMIENTO REQUERIDO</div>'
                : ''}
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
        </div>`;

    document.getElementById('detail-modal').style.display = 'block';
}

// Navegación inmersiva: ocultar header al entrar al optimizador
function entrarModoInmersivo() {
    document.body.classList.add('immersive-mode');
    document.getElementById('main-view-container').style.display = 'none';
    document.getElementById('assignment-view').style.display = 'block';
}

function salirModoInmersivo() {
    document.body.classList.remove('immersive-mode');
    document.getElementById('assignment-view').style.display = 'none';
    document.getElementById('main-view-container').style.display = 'block';
}

// Alias para compatibilidad con fletes.html
function volverAlDashboard() { salirModoInmersivo(); }

// Acciones del Header
function confirmarSalida() {
    Swal.fire({
        title: '¿Cerrar Sesión?',
        text: "¿Estás seguro de que quieres salir del sistema?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e30613',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Sesión Finalizada',
                text: 'Has salido correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                location.reload(); // Simulación de salida
            });
        }
    });
}

function mostrarConfiguracion() {
    Swal.fire({
        title: 'En Construcción',
        text: 'Esta sección estará disponible próximamente.',
        icon: 'info',
        confirmButtonColor: '#e30613',
        confirmButtonText: 'Entendido'
    });
}
