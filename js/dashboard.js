/**
 * dashboard.js — Dashboard de estadísticas (Coltanques)
 */

async function obtenerDatosDashboard() {
    try {
        console.log('>>> [DEBUG] Cargando datos consolidados para el Dashboard...');
        
        // Cargamos todos los datos en paralelo para mayor eficiencia
        const [fletes, vehiculos, conductores, reporte] = await Promise.all([
            apiFetch('/fletes').catch(() => []),
            apiFetch('/vehiculos').catch(() => []),
            apiFetch('/conductores').catch(() => []),
            apiFetch('/reportes').catch(() => []) // o /reporte dependiendo de tu API
        ]);

        console.log('>>> [DEBUG] Datos consolidados:', { fletes, vehiculos, conductores, reporte });

        // 1. Actualizar Tarjetas de Estadísticas
        const actualizaTexto = (id, valor) => {
            const el = document.getElementById(id);
            if (el) el.innerText = valor;
        };

        const fmt = n => `$${(n / 1000000).toFixed(1)}M`;
        const fmtMoney = n => `$${Number(n).toLocaleString('es-CO')}`;

        // Obtener arrays limpios (manejando si la API devuelve {fletes: []} o [])
        const listFletes = Array.isArray(fletes) ? fletes : (fletes.fletes || []);
        const listVehiculos = Array.isArray(vehiculos) ? vehiculos : (vehiculos.vehiculos || []);
        const listConductores = Array.isArray(conductores) ? conductores : (conductores.conductores || []);
        const listReporte = Array.isArray(reporte) ? reporte : (reporte.reportes || reporte.reporte || []);

        actualizaTexto('total-fletes', listFletes.length);
        actualizaTexto('total-pendientes', listFletes.filter(f => f.estado === 'sin_asignar').length);
        actualizaTexto('total-vehiculos-count', listVehiculos.length);
        actualizaTexto('total-conductores', listConductores.length);

        const margenTotal = listReporte.reduce((a, r) => a + (Number(r.margen) || 0), 0);
        actualizaTexto('total-margen-valor', margenTotal > 1000000 ? fmt(margenTotal) : fmtMoney(margenTotal));

        const vehiculosEnRuta = listVehiculos.filter(v => v.estado === 'En Ruta').length;
        const porcentajeUtilizacion = listVehiculos.length > 0 ? ((vehiculosEnRuta / listVehiculos.length) * 100).toFixed(0) : 0;
        actualizaTexto('utilizacion-flota', `${porcentajeUtilizacion}%`);

        // 2. Alertas dinámicas basadas en datos reales
        const alertsContainer = document.getElementById('dashboard-alerts');
        if (alertsContainer) {
            const maintenanceCount = listVehiculos.filter(v => v.km_actual >= v.km_proximo_aceite && v.km_proximo_aceite > 0).length;
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

        // 3. Inicializar Gráfica de Rendimiento (Simulada con datos reales de reporte si hubiera históricos)
        const ctx = document.getElementById('performanceChart');
        if (ctx) {
            // Limpiar canvas anterior si existe
            const chartExist = Chart.getChart(ctx);
            if (chartExist) chartExist.destroy();

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Ventas',
                            data: [45, 52, 48, 61, 55, listReporte.reduce((a,r) => a+(r.venta/1000000), 0).toFixed(1)],
                            borderColor: '#e30613',
                            backgroundColor: 'rgba(227, 6, 19, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3
                        },
                        {
                            label: 'Costos',
                            data: [30, 35, 33, 40, 38, listReporte.reduce((a,r) => a+(r.costo_total/1000000), 0).toFixed(1)],
                            borderColor: '#333',
                            backgroundColor: 'transparent',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 2,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: value => '$' + value + 'M' }
                        }
                    }
                }
            });
        }

        // 4. Gráfica de Estado de la Flota (Dona)
        const ctxFleet = document.getElementById('fleetStatusChart');
        if (ctxFleet) {
            const chartExist = Chart.getChart(ctxFleet);
            if (chartExist) chartExist.destroy();

            const vehiculosDisponibles = listVehiculos.filter(v => v.estado === 'Disponible').length;
            const vehiculosMantenimiento = listVehiculos.filter(v => v.estado === 'Mantenimiento' || (v.km_actual >= v.km_proximo_aceite && v.km_proximo_aceite > 0)).length;

            new Chart(ctxFleet, {
                type: 'doughnut',
                data: {
                    labels: ['En Ruta', 'Disponible', 'Mantenimiento'],
                    datasets: [{
                        data: [vehiculosEnRuta, vehiculosDisponibles, vehiculosMantenimiento],
                        backgroundColor: ['#e30613', '#333', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' }
                    },
                    cutout: '70%'
                }
            });
        }
    } catch (e) {
        console.error('obtenerDatosDashboard:', e);
    }
}
