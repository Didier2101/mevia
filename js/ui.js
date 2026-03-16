/**
 * ui.js — Utilidades de interfaz: notificaciones, modal y navegación (Coltanques)
 */

const Notificacion = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

let backendConectado = true;
let backendStatusInicializado = false;

/**
 * Actualiza el indicador de conexión (dot + texto) y muestra una notificación al usuario.
 * @param {boolean} conectado
 * @param {string} [mensaje]
 */
function setBackendConnectionStatus(conectado, mensaje) {
  // Evita mostrar notificaciones repetidas en recargas/llamadas en cadena
  if (backendStatusInicializado && backendConectado === conectado) return;

  backendConectado = conectado;
  backendStatusInicializado = true;

  const dot = document.querySelector(".dot");
  const label = document.querySelector(".status-label");
  if (dot) {
    dot.classList.toggle("online", conectado);
    dot.classList.toggle("offline", !conectado);
  }
  if (label) {
    label.innerText = conectado ? "ONLINE" : "OFFLINE";
  }

  if (!conectado) {
    Notificacion.fire({
      icon: "error",
      title: mensaje ? `Error de conexión: ${mensaje}` : "Sin conexión con el servidor",
      timer: 4000,
    });
    return;
  }

  // Restaurado
  Notificacion.fire({
    icon: "success",
    title: "Conexión restaurada",
    timer: 2000,
  });
}


let recomendacionesActuales = [];

function cerrarModalDetalle() {
  document.getElementById("detail-modal").style.display = "none";
}

function mostrarDetalleRecomendacion(index) {
  const r = recomendacionesActuales[index];
  if (!r) return;

  const body = document.getElementById("detail-body");
  body.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-truck"></i> ESTATUS DEL VEHÍCULO</h3>
            <p><strong>PLACA:</strong> ${r.placa} | <strong>CONDUCTOR:</strong> ${r.conductor}</p>
            ${
              r.km_actual >= r.km_proximo_aceite
                ? '<div class="badge badge-assigned" style="margin-top:10px; background: #000;">MANTENIMIENTO REQUERIDO</div>'
                : ""
            }
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

  document.getElementById("detail-modal").style.display = "block";
}

// Navegación inmersiva: ocultar header al entrar al optimizador
function entrarModoInmersivo() {
  document.body.classList.add("immersive-mode");
  document.getElementById("main-view-container").style.display = "none";
  document.getElementById("assignment-view").style.display = "block";
}

function salirModoInmersivo() {
  document.body.classList.remove("immersive-mode");
  document.getElementById("assignment-view").style.display = "none";
  document.getElementById("main-view-container").style.display = "block";
}

// Alias para compatibilidad con fletes.html
function volverAlDashboard() {
  salirModoInmersivo();
}

// Acciones del Header
function confirmarSalida() {
  Swal.fire({
    title: "¿Cerrar Sesión?",
    text: "¿Estás seguro de que quieres salir del sistema?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e30613",
    cancelButtonColor: "#333",
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Sesión Finalizada",
        text: "Has salido correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        location.reload(); // Simulación de salida
      });
    }
  });
}

function mostrarConfiguracion() {
  Swal.fire({
    title: "En Construcción",
    text: "Esta sección estará disponible próximamente.",
    icon: "info",
    confirmButtonColor: "#e30613",
    confirmButtonText: "Entendido",
  });
}

/**
 * Muestra un spinner de carga en el cuerpo de una tabla.
 * @param {string} idTbody - ID del elemento tbody.
 * @param {string} mensaje - Mensaje a mostrar junto al spinner.
 * @param {number} colspan - Número de columnas para centrar el mensaje.
 */
function ui_mostrarCarga(idTbody, mensaje = "Cargando datos...", colspan = 10) {
  const tbody = document.getElementById(idTbody);
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td colspan="${colspan}" style="text-align:center; padding:3rem;">
        <i class="fas fa-spinner fa-spin fa-2x" style="color:var(--primary); margin-bottom:10px; display:block;"></i>
        <span style="color:var(--text-muted); font-weight:600;">${mensaje}</span>
      </td>
    </tr>`;
}

/**
 * Muestra un estado de error en el cuerpo de una tabla con opción de reintento.
 * @param {string} idTbody - ID del elemento tbody.
 * @param {Function} callbackReintento - Función a ejecutar al pulsar reintentar.
 * @param {string} mensaje - Mensaje de error descriptivo.
 * @param {number} colspan - Número de columnas.
 */
function ui_mostrarError(
  idTbody,
  callbackReintento,
  mensaje = "No se pudo conectar con el servidor",
  colspan = 10,
) {
  const tbody = document.getElementById(idTbody);
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="${colspan}" style="text-align:center; padding:3rem;">
        <i class="fas fa-plug-circle-xmark fa-3x" style="color:var(--primary); margin-bottom:15px; display:block;"></i>
        <h3 style="margin-bottom:10px; color:var(--black);">Error de Conexión</h3>
        <p style="color:var(--text-muted); max-width:400px; margin:0 auto 20px;">
          ${mensaje}. Asegúrate de tener conexión a internet o intenta de nuevo en unos minutos.
        </p>
        ${
          callbackReintento
            ? `
          <button class="btn-header-action" onclick="${callbackReintento.name}()" style="float:none; display:inline-flex;">
            <i class="fas fa-sync-alt" style="margin-right:8px;"></i> REINTENTAR CONEXIÓN
          </button>`
            : ""
        }
      </td>
    </tr>`;
}
