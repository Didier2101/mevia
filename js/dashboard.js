/**
 * dashboard.js — Dashboard de estadísticas (Coltanques)
 */

async function obtenerDatosDashboard() {
  try {
    console.log(">>> [DEBUG] Cargando datos consolidados para el Dashboard...");

    // Cargamos todos los datos en paralelo para mayor eficiencia
    const [fletes, vehiculos, conductores, reporte] = await Promise.all([
      apiFetch("/fletes").catch(() => []),
      apiFetch("/vehiculos").catch(() => []),
      apiFetch("/conductores").catch(() => []),
      apiFetch("/reporte").catch(() => []), 
    ]);

    console.log(">>> [DEBUG] Datos consolidados:", {
      fletes,
      vehiculos,
      conductores,
      reporte,
    });

    // 1. Actualizar Tarjetas de Estadísticas
    const actualizaTexto = (id, valor) => {
      const el = document.getElementById(id);
      if (el) el.innerText = valor;
    };

    const fmt = (n) => `$${(n / 1000000).toFixed(1)}M`;
    const fmtMoney = (n) => `$${Number(n).toLocaleString("es-CO")}`;

    // Obtener arrays limpios (manejando si la API devuelve {fletes: []} o [])
    const listFletes = Array.isArray(fletes) ? fletes : fletes.fletes || [];
    const listVehiculos = Array.isArray(vehiculos)
      ? vehiculos
      : vehiculos.vehiculos || [];
    const listConductores = Array.isArray(conductores)
      ? conductores
      : conductores.conductores || [];
    const listReporte = Array.isArray(reporte)
      ? reporte
      : reporte.reportes || reporte.reporte || [];

    actualizaTexto("total-fletes", listFletes.length);
    actualizaTexto(
      "total-pendientes",
      listFletes.filter((f) => f.estado === "sin_asignar").length,
    );
    actualizaTexto("total-vehiculos-count", listVehiculos.length);
    actualizaTexto("total-conductores", listConductores.length);

    const margenTotal = listReporte.reduce(
      (a, r) => a + (Number(r.margen) || 0),
      0,
    );
    actualizaTexto(
      "total-margen-valor",
      margenTotal > 1000000 ? fmt(margenTotal) : fmtMoney(margenTotal),
    );

    const vehiculosEnRuta = listVehiculos.filter(
      (v) => v.estado === "En Ruta",
    ).length;
    const porcentajeUtilizacion =
      listVehiculos.length > 0
        ? ((vehiculosEnRuta / listVehiculos.length) * 100).toFixed(0)
        : 0;
    actualizaTexto("utilizacion-flota", `${porcentajeUtilizacion}%`);

    // 2. Alertas dinámicas basadas en datos reales
    const alertsContainer = document.getElementById("dashboard-alerts");
    if (alertsContainer) {
      const maintenanceCount = listVehiculos.filter(
        (v) => v.km_actual >= v.km_proximo_aceite && v.km_proximo_aceite > 0,
      ).length;
      if (maintenanceCount > 0) {
        alertsContainer.innerHTML = `
                    <div class="activity-item">
                        <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                        <div>
                            <strong>Mantenimiento</strong>
                            <p>${maintenanceCount} unidades requieren revisión técnica.</p>
                        </div>
                    </div>`;
      } else {
        alertsContainer.innerHTML = `
                    <div class="activity-item">
                        <i class="fas fa-check-circle" style="color: #10b981;"></i>
                        <div>
                            <strong>Estado Óptimo</strong>
                            <p>Toda la flota operativa está al día.</p>
                        </div>
                    </div>`;
      }
    }

    // Las gráficas se han movido a la sección de Reportes por solicitud del usuario
  } catch (e) {
    console.error("obtenerDatosDashboard:", e);
    const existingBanner = document.getElementById("dashboard-offline-banner");
    if (existingBanner) existingBanner.remove();

    const container = document.querySelector(".section-container");
    if (container) {
      const banner = document.createElement("div");
      banner.id = "dashboard-offline-banner";
      banner.style.cssText =
        "padding: 1rem; background:#ffe9e9; border:1px solid #f5b5b5; color:#9b0000; margin-bottom:1rem; border-radius: 6px;";
      banner.innerText =
        "No se pudo conectar con el servidor. Verifica la conexión de red o intenta de nuevo más tarde.";
      container.prepend(banner);
    }
  }
}
