/**
 * vehiculos.js — Parque automotor (Coltanques)
 */

let currentPage = 1;
const ITEMS_PER_PAGE = 7;
let allVehicles = []; // Cache local para busquedas
let filteredVehicles = [];
let apiFetchError = false;

async function obtenerVehiculos() {
  ui_mostrarCarga("vehiculos-body", "Cargando flota...", 8);

  try {
    apiFetchError = false;
    const data = await apiFetch("/vehiculos");
    console.log('DATA_VEHICULOS', data);
    // Si data es un array, lo tomamos directo; si es objeto buscamos .vehiculos
    allVehicles = Array.isArray(data) ? data : data.vehiculos || [];
    filteredVehicles = allVehicles;

    renderTablaVehiculos();
    renderPagination();
  } catch (e) {
    console.error("obtenerVehiculos:", e);
    apiFetchError = true;
    renderTablaVehiculos();
  }
}

function filtrarVehiculos() {
  const query = document.getElementById("vehiculos-search").value.toLowerCase();
  filteredVehicles = allVehicles.filter((v) =>
    v.placa.toLowerCase().includes(query),
  );
  currentPage = 1;
  updateView();
}

function renderTablaVehiculos() {
  const tbody = document.getElementById("vehiculos-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (apiFetchError) {
    ui_mostrarError("vehiculos-body", obtenerVehiculos, "No se pudo establecer conexión con el servidor para obtener el parque automotor.", 8);
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedItems = filteredVehicles.slice(start, end);

  paginatedItems.forEach((v) => {
    const aceiteVencido = v.km_actual >= v.km_proximo_aceite;
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><strong>${v.placa}</strong></td>
            <td>${v.marca}</td>
            <td>${v.km_actual.toLocaleString()} km</td>
            <td>
                <span class="badge ${aceiteVencido ? "badge-pending" : "badge-assigned"}">
                    ${aceiteVencido ? "⚠ VENCIDO" : "Al día"}
                </span>
            </td>
            <td>${v.estado_llantas}</td>
            <td>
                <span class="badge ${v.estado === "En Ruta" ? "badge-assigned" : v.estado === "Disponible" ? "badge-success" : "badge-pending"}">
                    ${v.estado}
                </span>
            </td>
            <td>${v.flete_activo}</td>
            <td>
                <button class="btn-action primary" onclick="verDetalleVehiculo('${v.cod_vehiculo}')" title="Ver Detalles">
                    <i class="fas fa-eye"></i> Detalles
                </button>
            </td>`;
    tbody.appendChild(tr);
  });
}

function renderPagination() {
  const pagination = document.getElementById("vehiculos-pagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);

  // Prev Button
  const btnPrev = document.createElement("button");
  btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
  btnPrev.disabled = currentPage === 1;
  btnPrev.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      updateView();
    }
  };
  pagination.appendChild(btnPrev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.onclick = () => {
      currentPage = i;
      updateView();
    };
    pagination.appendChild(btn);
  }

  // Next Button
  const btnNext = document.createElement("button");
  btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
  btnNext.disabled = currentPage === totalPages;
  btnNext.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateView();
    }
  };
  pagination.appendChild(btnNext);
}

function updateView() {
  renderTablaVehiculos();
  renderPagination();
}

/* --- PANEL LATERAL DE DETALLES --- */
function verDetalleVehiculo(codVehiculo) {
  const v = allVehicles.find((x) => x.cod_vehiculo === codVehiculo);
  if (!v) return;

  document.getElementById("panel-vehiculo-titulo").innerText =
    `Vehículo ${v.placa}`;

  const htmlInfo = `
        <div class="vehiculo-detail-grid">
            <div class="detail-item"><label>Placa</label><span>${v.placa}</span></div>
            <div class="detail-item"><label>ID Único</label><span>${v.cod_vehiculo}</span></div>
            <div class="detail-item"><label>Marca</label><span>${v.marca}</span></div>
            <div class="detail-item"><label>Tipo de Plancha</label><span>${v.tipo_plancha || 'No especificado'}</span></div>
            <div class="detail-item"><label>Color</label><span>${v.color}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Kilometraje Actual</label><span>${v.km_actual.toLocaleString()} km</span></div>
            <div class="detail-item"><label>Próx. Cambio Aceite</label><span style="color:${v.km_actual >= v.km_proximo_aceite ? "var(--primary)" : "inherit"}">${v.km_proximo_aceite.toLocaleString()} km</span></div>
            <div class="detail-item"><label>Estado Llantas</label><span>${v.estado_llantas}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Dirección Parqueo</label><span>${v.punto_parqueo?.direccion || 'No registrada'}</span></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Estado Operativo</label><span>${v.estado}</span></div>
            <div class="detail-item"><label>Flete Actual</label><span>${v.flete_activo}</span></div>
        </div>
    `;

  document.getElementById("panel-vehiculo-body").innerHTML = htmlInfo;
  document.getElementById("vehiculo-modal").classList.add("open");
}

function cerrarPanelVehiculo() {
  document.getElementById("vehiculo-modal").classList.remove("open");
}
