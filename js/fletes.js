let currentPage = 1;
const ITEMS_PER_PAGE = 7;
let allFletes = []; // Cache local para busquedas
let apiFetchError = false;

async function obtenerFletes() {
  ui_mostrarCarga("fletes-body", "Conectando con el servidor...", 7);

  try {
    apiFetchError = false; // Reset error state on new attempt
    const data = await apiFetch("/fletes");
    console.log(">>> [DEBUG] Datos recibidos de /fletes:", data);

    // Si data es un array, lo tomamos directo; si es objeto buscamos .fletes
    allFletes = Array.isArray(data) ? data : data.fletes || [];
    filteredFletes = allFletes;
    renderTablaFletes();
    renderPagination();
  } catch (e) {
    console.error("obtenerFletes:", e);
    apiFetchError = true;
    renderTablaFletes();
  }
}

function filtrarFletes() {
  const query = document.getElementById("fletes-search").value.toLowerCase();
  const statusFilter = document.getElementById("flete-status-filter").value;

  filteredFletes = allFletes.filter((f) => {
    const matchesQuery =
      f.cod_flete.toLowerCase().includes(query) ||
      f.cliente.toLowerCase().includes(query) ||
      f.producto.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "todos" || f.estado === statusFilter;

    return matchesQuery && matchesStatus;
  });

  currentPage = 1;
  updateView();
}

function renderTablaFletes() {
  const tbody = document.getElementById("fletes-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (apiFetchError) {
    ui_mostrarError("fletes-body", obtenerFletes, "No se pudo establecer conexión con el servidor.", 7);
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedItems = filteredFletes.slice(start, end);

  if (paginatedItems.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No se encontraron fletes</td></tr>';
    return;
  }

  paginatedItems.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><strong>${f.cod_flete}</strong></td>
            <td>${f.cliente}</td>
            <td>${f.producto}</td>
            <td>${f.peso} Ton</td>
            <td>${f.punto_carga}</td>
            <td><span class="badge ${f.estado === "asignado" ? "badge-assigned" : "badge-pending"}">${f.estado}</span></td>
            <td>
                <div style="display: flex; gap: 5px;">
                    <button class="btn-action primary" onclick="verDetalleFlete('${f.cod_flete}')" title="Ver Detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <div class="main-action-btn"></div>
                </div>
            </td>`;

    const btn = document.createElement("button");
    if (f.estado === "sin_asignar") {
      btn.className = "btn-assign-sm";
      btn.textContent = "Ejecutar";
      btn.onclick = () =>
        (location.href = `optimizador-de-rutas-ia.html?flete=${f.cod_flete}`);
    } else {
      btn.className = "btn-unassign-sm";
      btn.textContent = "Liberar";
      btn.onclick = () => desasignarCamion(f.cod_flete);
    }
    tr.querySelector(".main-action-btn").appendChild(btn);
    tbody.appendChild(tr);
  });
}

function verDetalleFlete(codFlete) {
  const f = allFletes.find((x) => x.cod_flete === codFlete);
  if (!f) return;

  document.getElementById("panel-flete-titulo").innerText =
    `Flete: ${f.cod_flete}`;

  const htmlInfo = `
        <div class="vehiculo-detail-grid">
            <div class="detail-item"><label>Código</label><span>${f.cod_flete}</span></div>
            <div class="detail-item"><label>Cliente</label><span>${f.cliente}</span></div>
            <div class="detail-item"><label>Producto</label><span>${f.producto}</span></div>
            <div class="detail-item"><label>Peso</label><span>${f.peso} Ton</span></div>
            <div class="detail-item"><label>Valor Venta</label><strong style="color:var(--primary)">$${(f.venta || 0).toLocaleString()}</strong></div>
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Punto de Carga</label><strong>${f.punto_carga}</strong></div>
            <div class="detail-item"><label>Destino Final</label><strong>${f.destino || "No definido"}</strong></div>
            <div class="detail-item"><label>Estado</label><span>${f.estado.toUpperCase()}</span></div>
            ${f.vehiculo ? `
            <hr style="border:0; border-top:1px solid #ddd; margin: 10px 0;">
            <div class="detail-item"><label>Vehículo Asignado</label><strong>${f.vehiculo.placa} (${f.vehiculo.marca})</strong></div>
            <div class="detail-item"><label>Estado Vehículo</label><span>${f.vehiculo.estado}</span></div>
            ` : ''}
        </div>
    `;

  document.getElementById("panel-flete-body").innerHTML = htmlInfo;
  document.getElementById("flete-modal").classList.add("open");
}

function cerrarPanelFlete() {
  document.getElementById("flete-modal").classList.remove("open");
}

function renderPagination() {
  const pagination = document.getElementById("fletes-pagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredFletes.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

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
  renderTablaFletes();
  renderPagination();
}

// ─── Liberación ──────────────────────────────────────────────────

async function desasignarCamion(idFlete) {
  const confirm = await Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Deseas liberar el vehículo asignado al flete ${idFlete}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#E30613",
    cancelButtonColor: "#404040",
    confirmButtonText: "Sí, liberar",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    await apiFetch(`/unassign/${idFlete}`, { method: "POST" });

    Notificacion.fire({ icon: "success", title: "Desasignación exitosa" });
    obtenerFletes();
  } catch (e) {
    console.error("desasignarCamion:", e);
    Notificacion.fire({
      icon: "error",
      title: "Error al liberar: " + e.message,
    });
  }
}
