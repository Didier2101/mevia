/**
 * Mock data para el Freight Dashboard de Coltanques
 * Estos datos simulan la respuesta de una API para que el frontend sea funcional sin backend.
 */

const DATA_MOCK = {
    fletes: [
        {
            cod_flete: "FLT-001",
            cliente: "Cervecería Nacional",
            producto: "Malta de Cebada",
            peso: 32,
            punto_carga: "Puerto de Cartagena",
            destino_nombre: "Bogotá, D.C.",
            origen: "10.3910, -75.4794",
            destino: "4.6097, -74.0817",
            estado: "sin_asignar"
        },
        {
            cod_flete: "FLT-002",
            cliente: "Ramo S.A.",
            producto: "Harina de Trigo",
            peso: 28,
            punto_carga: "Planta Mosquera",
            destino_nombre: "Medellín, Antioquia",
            origen: "4.7059, -74.2302",
            destino: "6.2442, -75.5812",
            estado: "sin_asignar"
        },
        {
            cod_flete: "FLT-003",
            cliente: "Cementos Argos",
            producto: "Cemento P-45",
            peso: 35,
            punto_carga: "Sogamoso",
            destino_nombre: "Ibagué, Tolima",
            origen: "5.7159, -72.9333",
            destino: "4.4389, -75.2322",
            estado: "asignado"
        },
        {
            cod_flete: "FLT-004",
            cliente: "Nutresa",
            producto: "Aceite Vegetal",
            peso: 25,
            punto_carga: "Cali",
            destino_nombre: "Pasto, Nariño",
            origen: "3.4516, -76.5320",
            destino: "1.2136, -77.2811",
            estado: "sin_asignar"
        }
    ],

    vehiculos: [
        { cod_vehiculo: "V-101", placa: "SZK-123", marca: "Kenworth", modelo: "T800", ano: 2018, km_actual: 45000, km_proximo_aceite: 46000, estado_llantas: "Bueno", soat_vencimiento: "2026-08-15", rtm_vencimiento: "2026-09-01", capacidad_ton: 35, conductor_asignado: "Jhonathan Puertas", estado: "Disponible", flete_activo: "Ninguno", lat: 4.6097, lon: -74.0817 },
        { cod_vehiculo: "V-102", placa: "TUV-456", marca: "International", modelo: "WorkStar", ano: 2015, km_actual: 82000, km_proximo_aceite: 81500, estado_llantas: "Desgastado", soat_vencimiento: "2025-11-20", rtm_vencimiento: "2025-10-15", capacidad_ton: 32, conductor_asignado: "Carlos Rodriguez", estado: "En Ruta", flete_activo: "FLT-003", lat: 5.1234, lon: -73.4567 },
        { cod_vehiculo: "V-103", placa: "JKL-789", marca: "Freightliner", modelo: "Cascadia", ano: 2021, km_actual: 15600, km_proximo_aceite: 25000, estado_llantas: "Excelente", soat_vencimiento: "2027-01-10", rtm_vencimiento: "2027-02-20", capacidad_ton: 36, conductor_asignado: "Sin Asignar", estado: "Disponible", flete_activo: "Ninguno", lat: 10.4116, lon: -75.5036 },
        { cod_vehiculo: "V-104", placa: "MNO-321", marca: "Mack", modelo: "Anthem", ano: 2019, km_actual: 112000, km_proximo_aceite: 115000, estado_llantas: "Normal", soat_vencimiento: "2026-05-14", rtm_vencimiento: "2026-06-11", capacidad_ton: 34, conductor_asignado: "Mario Benitez", estado: "Mantenimiento", flete_activo: "Ninguno", lat: 4.6150, lon: -74.0900 },
        { cod_vehiculo: "V-105", placa: "PQR-654", marca: "Volvo", modelo: "FH16", ano: 2022, km_actual: 8500, km_proximo_aceite: 18000, estado_llantas: "Excelente", soat_vencimiento: "2027-03-22", rtm_vencimiento: "2027-04-10", capacidad_ton: 38, conductor_asignado: "Luis Parra", estado: "Disponible", flete_activo: "Ninguno", lat: 3.4516, lon: -76.5320 },
        { cod_vehiculo: "V-106", placa: "STU-987", marca: "Kenworth", modelo: "T680", ano: 2017, km_actual: 210000, km_proximo_aceite: 215000, estado_llantas: "Cambio Sugerido", soat_vencimiento: "2025-08-11", rtm_vencimiento: "2025-09-05", capacidad_ton: 35, conductor_asignado: "Pedro Gómez", estado: "En Ruta", flete_activo: "FLT-012", lat: 6.2442, lon: -75.5812 },
        { cod_vehiculo: "V-107", placa: "VWX-135", marca: "Scania", modelo: "R500", ano: 2020, km_actual: 65000, km_proximo_aceite: 64500, estado_llantas: "Bueno", soat_vencimiento: "2026-12-05", rtm_vencimiento: "2026-11-20", capacidad_ton: 36, conductor_asignado: "Andres Felipe", estado: "Disponible", flete_activo: "Ninguno", lat: 4.1420, lon: -73.6266 },
        { cod_vehiculo: "V-108", placa: "YZA-246", marca: "Hino", modelo: "Serie 700", ano: 2016, km_actual: 320000, km_proximo_aceite: 325000, estado_llantas: "Crítico", soat_vencimiento: "2025-02-14", rtm_vencimiento: "2025-01-30", capacidad_ton: 30, conductor_asignado: "Sin Asignar", estado: "Taller", flete_activo: "Ninguno", lat: 4.6097, lon: -74.0817 },
        { cod_vehiculo: "V-109", placa: "BCD-357", marca: "International", modelo: "ProStar", ano: 2018, km_actual: 154000, km_proximo_aceite: 155000, estado_llantas: "Normal", soat_vencimiento: "2026-07-20", rtm_vencimiento: "2026-08-15", capacidad_ton: 32, conductor_asignado: "Miguel Rojas", estado: "Disponible", flete_activo: "Ninguno", lat: 10.9685, lon: -74.7813 },
        { cod_vehiculo: "V-110", placa: "EFG-468", marca: "Kenworth", modelo: "T800", ano: 2019, km_actual: 98000, km_proximo_aceite: 100000, estado_llantas: "Bueno", soat_vencimiento: "2026-10-10", rtm_vencimiento: "2026-11-05", capacidad_ton: 35, conductor_asignado: "Juan Pablo", estado: "En Ruta", flete_activo: "FLT-009", lat: 7.1139, lon: -73.1198 },
        { cod_vehiculo: "V-111", placa: "HIJ-579", marca: "Mack", modelo: "Granite", ano: 2014, km_actual: 450000, km_proximo_aceite: 445000, estado_llantas: "Normal", soat_vencimiento: "2025-05-12", rtm_vencimiento: "2025-06-01", capacidad_ton: 38, conductor_asignado: "Hector Diaz", estado: "Mantenimiento", flete_activo: "Ninguno", lat: 5.0681, lon: -75.5174 },
        { cod_vehiculo: "V-112", placa: "KLM-680", marca: "Volvo", modelo: "FMX", ano: 2021, km_actual: 32000, km_proximo_aceite: 40000, estado_llantas: "Excelente", soat_vencimiento: "2027-05-20", rtm_vencimiento: "2027-06-15", capacidad_ton: 40, conductor_asignado: "Jose Antonio", estado: "Disponible", flete_activo: "Ninguno", lat: 4.6097, lon: -74.0817 },
        { cod_vehiculo: "V-113", placa: "NOP-791", marca: "Freightliner", modelo: "M2 112", ano: 2017, km_actual: 280000, km_proximo_aceite: 285000, estado_llantas: "Desgastado", soat_vencimiento: "2025-09-09", rtm_vencimiento: "2025-10-01", capacidad_ton: 30, conductor_asignado: "Ricardo Silva", estado: "En Ruta", flete_activo: "FLT-045", lat: 8.7479, lon: -75.8814 },
        { cod_vehiculo: "V-114", placa: "QRS-802", marca: "Scania", modelo: "G410", ano: 2019, km_actual: 120000, km_proximo_aceite: 118000, estado_llantas: "Bueno", soat_vencimiento: "2026-04-18", rtm_vencimiento: "2026-05-10", capacidad_ton: 34, conductor_asignado: "Fernando Toro", estado: "Disponible", flete_activo: "Ninguno", lat: 10.3910, lon: -75.4794 },
        { cod_vehiculo: "V-115", placa: "TUV-913", marca: "Kenworth", modelo: "T660", ano: 2015, km_actual: 380000, km_proximo_aceite: 385000, estado_llantas: "Normal", soat_vencimiento: "2025-11-30", rtm_vencimiento: "2025-12-20", capacidad_ton: 35, conductor_asignado: "Oscar Naranjo", estado: "Disponible", flete_activo: "Ninguno", lat: 4.7059, lon: -74.2302 },
        { cod_vehiculo: "V-116", placa: "WXY-024", marca: "International", modelo: "LT625", ano: 2022, km_actual: 15000, km_proximo_aceite: 25000, estado_llantas: "Excelente", soat_vencimiento: "2027-08-14", rtm_vencimiento: "2027-09-01", capacidad_ton: 36, conductor_asignado: "Diego Franco", estado: "En Ruta", flete_activo: "FLT-088", lat: 3.8653, lon: -76.3005 },
        { cod_vehiculo: "V-117", placa: "ZAB-135", marca: "Volvo", modelo: "VNL 860", ano: 2023, km_actual: 5000, km_proximo_aceite: 15000, estado_llantas: "Nueva", soat_vencimiento: "2028-01-10", rtm_vencimiento: "2028-02-05", capacidad_ton: 38, conductor_asignado: "Mauricio Ceballos", estado: "Disponible", flete_activo: "Ninguno", lat: 4.6097, lon: -74.0817 },
        { cod_vehiculo: "V-118", placa: "CDE-246", marca: "Mack", modelo: "Pinnacle", ano: 2018, km_actual: 195000, km_proximo_aceite: 192000, estado_llantas: "Cambio Sugerido", soat_vencimiento: "2026-02-28", rtm_vencimiento: "2026-03-15", capacidad_ton: 35, conductor_asignado: "Sin Asignar", estado: "Taller", flete_activo: "Ninguno", lat: 4.6097, lon: -74.0817 },
        { cod_vehiculo: "V-119", placa: "FGH-357", marca: "Freightliner", modelo: "Coronado", ano: 2016, km_actual: 410000, km_proximo_aceite: 415000, estado_llantas: "Bueno", soat_vencimiento: "2025-07-22", rtm_vencimiento: "2025-08-10", capacidad_ton: 32, conductor_asignado: "Victor Arias", estado: "Disponible", flete_activo: "Ninguno", lat: 11.2408, lon: -74.1990 },
        { cod_vehiculo: "V-120", placa: "IJK-468", marca: "Kenworth", modelo: "T800", ano: 2020, km_actual: 54000, km_proximo_aceite: 60000, estado_llantas: "Excelente", soat_vencimiento: "2026-11-15", rtm_vencimiento: "2026-12-01", capacidad_ton: 35, conductor_asignado: "Simon Bolivar", estado: "En Ruta", flete_activo: "FLT-023", lat: 2.4448, lon: -76.6147 },
        { cod_vehiculo: "V-121", placa: "LMN-579", marca: "Hino", modelo: "Serie 500", ano: 2019, km_actual: 135000, km_proximo_aceite: 140000, estado_llantas: "Normal", soat_vencimiento: "2026-06-30", rtm_vencimiento: "2026-07-20", capacidad_ton: 28, conductor_asignado: "Jorge Isaacs", estado: "Disponible", flete_activo: "Ninguno", lat: 4.5338, lon: -75.6811 },
        { cod_vehiculo: "V-122", placa: "OPQ-680", marca: "Scania", modelo: "P360", ano: 2021, km_actual: 22000, km_proximo_aceite: 32000, estado_llantas: "Bueno", soat_vencimiento: "2027-09-12", rtm_vencimiento: "2027-10-05", capacidad_ton: 32, conductor_asignado: "Camilo Torres", estado: "Disponible", flete_activo: "Ninguno", lat: 4.6097, lon: -74.0817 }
    ],

    conductores: [
        { cod_empleado: "EMP-001", nombre: "Jhonathan Puertas", estado_operativo: "Activo", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "300 123 4567", vehiculo_habitual: "V-101", fecha_ingreso: "2020-05-12", rh: "O+", capacitaciones: ["Manejo Defensivo", "Primeros Auxilios"], puntos_licencia: 0 },
        { cod_empleado: "EMP-002", nombre: "Carlos Rodriguez", estado_operativo: "Activo", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "301 987 6543", vehiculo_habitual: "V-102", fecha_ingreso: "2018-11-20", rh: "A+", capacitaciones: ["Manejo de Carga Peligrosa"], puntos_licencia: 3 },
        { cod_empleado: "EMP-003", nombre: "Mario Benitez", estado_operativo: "Descanso", licencia: "C3", vacaciones: "Sí", incapacidad: "No", telefono: "315 222 3344", vehiculo_habitual: "Ninguno", fecha_ingreso: "2019-02-14", rh: "B+", capacitaciones: ["Mecánica Básica"], puntos_licencia: 0 },
        { cod_empleado: "EMP-004", nombre: "Luis Parra", estado_operativo: "Activo", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "310 444 5566", vehiculo_habitual: "V-105", fecha_ingreso: "2021-08-01", rh: "O-", capacitaciones: ["Normatividad Vial"], puntos_licencia: 0 },
        { cod_empleado: "EMP-005", nombre: "Pedro Gómez", estado_operativo: "En Ruta", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "320 666 7788", vehiculo_habitual: "V-106", fecha_ingreso: "2017-03-10", rh: "A-", capacitaciones: ["Eco-Driving"], puntos_licencia: 6 },
        { cod_empleado: "EMP-006", nombre: "Andres Felipe", estado_operativo: "Activo", licencia: "C2", vacaciones: "No", incapacidad: "No", telefono: "312 888 9900", vehiculo_habitual: "V-107", fecha_ingreso: "2022-01-15", rh: "O+", capacitaciones: ["Manejo Defensivo"], puntos_licencia: 0 },
        { cod_empleado: "EMP-007", nombre: "Miguel Rojas", estado_operativo: "Activo", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "318 111 2233", vehiculo_habitual: "V-109", fecha_ingreso: "2019-10-05", rh: "O+", capacitaciones: ["Primeros Auxilios"], puntos_licencia: 0 },
        { cod_empleado: "EMP-008", nombre: "Juan Pablo", estado_operativo: "En Ruta", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "300 333 4455", vehiculo_habitual: "V-110", fecha_ingreso: "2020-12-12", rh: "A+", capacitaciones: ["Manejo de Carga"], puntos_licencia: 2 },
        { cod_empleado: "EMP-009", nombre: "Hector Diaz", estado_operativo: "Incapacitado", licencia: "C3", vacaciones: "No", incapacidad: "Sí", telefono: "314 555 6677", vehiculo_habitual: "Ninguno", fecha_ingreso: "2016-06-20", rh: "B-", capacitaciones: ["Mecánica Avanzada"], puntos_licencia: 0 },
        { cod_empleado: "EMP-010", nombre: "Jose Antonio", estado_operativo: "Activo", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "311 777 8899", vehiculo_habitual: "V-112", fecha_ingreso: "2021-04-10", rh: "O+", capacitaciones: ["Manejo Defensivo"], puntos_licencia: 0 },
        { cod_empleado: "EMP-011", nombre: "Ricardo Silva", estado_operativo: "En Ruta", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "317 999 0011", vehiculo_habitual: "V-113", fecha_ingreso: "2018-09-15", rh: "AB+", capacitaciones: ["Gestión de Rutas"], puntos_licencia: 0 },
        { cod_empleado: "EMP-012", nombre: "Fernando Toro", estado_operativo: "Activo", licencia: "C3", vacaciones: "No", incapacidad: "No", telefono: "316 111 2222", vehiculo_habitual: "V-114", fecha_ingreso: "2019-07-01", rh: "O+", capacitaciones: ["Primeros Auxilios"], puntos_licencia: 0 }
    ],

    reporte: [
        {
            cod_flete: "FLT-003",
            cliente: "Cementos Argos",
            producto: "Cemento P-45",
            placa: "TUV-456",
            conductor: "Carlos Rodriguez",
            fecha_asignacion: "2024-03-11 08:30",
            distancia_vacio_km: 15.5,
            distancia_viaje_km: 245.0,
            costo_combustible: 450000,
            costo_peajes: 85000,
            costos_fijos: 120000,
            costo_total: 655000,
            venta: 1200000,
            margen: 545000
        }
    ],

    // Recomendaciones para el flete FLT-001 (Puerto de Cartagena -> Bogotá)
    recomendaciones: {
        "FLT-001": [
            {
                cod_vehiculo: "V-103",
                placa: "JKL-789",
                marca: "Freightliner",
                conductor: "Jhonathan Puertas",
                licencia: "C3",
                costo_total: 1850000,
                costo_combustible: 1200000,
                costo_peajes: 450000,
                costos_fijos: 200000,
                puntos_conductor: 16,
                distancia_vacio: 5.2,
                distancia_viaje: 650.0,
                tiempo_total_min: 720,
                truck_pos: [10.4116, -75.5036],
                route_vacio_points: [[-75.5036, 10.4116], [-75.4794, 10.3910]],
                route_points: [[-75.4794, 10.3910], [-74.9, 10.0], [-74.0817, 4.6097]],
                peajes: [
                    { nombre: "Gambote", lat: 10.158, lon: -75.28, costo: 15000 },
                    { nombre: "Tulin", lat: 4.9, lon: -74.4, costo: 18000 }
                ]
            },
            {
                cod_vehiculo: "V-101",
                placa: "SZK-123",
                marca: "Kenworth",
                conductor: "Carlos Rodriguez",
                licencia: "C3",
                costo_total: 1980000,
                costo_combustible: 1320000,
                costo_peajes: 450000,
                costos_fijos: 210000,
                puntos_conductor: 14,
                distancia_vacio: 12.4,
                distancia_viaje: 650.0,
                tiempo_total_min: 740,
                truck_pos: [4.6097, -74.0817],
                route_vacio_points: [[-74.0817, 4.6097], [-75.4794, 10.3910]],
                route_points: [[-75.4794, 10.3910], [-74.9, 10.0], [-74.0817, 4.6097]],
                peajes: [
                    { nombre: "Gambote", lat: 10.158, lon: -75.28, costo: 15000 },
                    { nombre: "Tulin", lat: 4.9, lon: -74.4, costo: 18000 }
                ]
            }
        ],
        "FLT-002": [
            {
                cod_vehiculo: "V-101",
                placa: "SZK-123",
                marca: "Kenworth",
                conductor: "Carlos Rodriguez",
                licencia: "C3",
                costo_total: 920000,
                costo_combustible: 600000,
                costo_peajes: 180000,
                costos_fijos: 140000,
                puntos_conductor: 14,
                distancia_vacio: 8.3,
                distancia_viaje: 280.0,
                tiempo_total_min: 320,
                truck_pos: [4.6097, -74.0817],
                route_vacio_points: [[-74.0817, 4.6097], [-74.2302, 4.7059]],
                route_points: [[-74.2302, 4.7059], [-74.8, 5.5], [-75.5812, 6.2442]],
                peajes: [
                    { nombre: "La Punta", lat: 5.0, lon: -74.5, costo: 22000 },
                    { nombre: "Medellin Sur", lat: 6.0, lon: -75.4, costo: 25000 }
                ]
            }
        ],
        "FLT-003": [
            {
                cod_vehiculo: "V-103",
                placa: "JKL-789",
                marca: "Freightliner",
                conductor: "Jhonathan Puertas",
                licencia: "C3",
                costo_total: 1100000,
                costo_combustible: 720000,
                costo_peajes: 210000,
                costos_fijos: 170000,
                puntos_conductor: 16,
                distancia_vacio: 11.7,
                distancia_viaje: 350.0,
                tiempo_total_min: 400,
                truck_pos: [10.4116, -75.5036],
                route_vacio_points: [[-75.5036, 10.4116], [-72.9333, 5.7159]],
                route_points: [[-72.9333, 5.7159], [-73.5, 5.0], [-75.2322, 4.4389]],
                peajes: [
                    { nombre: "Bogotá Norte", lat: 5.3, lon: -73.2, costo: 18000 }
                ]
            }
        ],
        "FLT-004": [
            {
                cod_vehiculo: "V-101",
                placa: "SZK-123",
                marca: "Kenworth",
                conductor: "Carlos Rodriguez",
                licencia: "C3",
                costo_total: 1450000,
                costo_combustible: 950000,
                costo_peajes: 320000,
                costos_fijos: 180000,
                puntos_conductor: 14,
                distancia_vacio: 9.5,
                distancia_viaje: 420.0,
                tiempo_total_min: 480,
                truck_pos: [4.6097, -74.0817],
                route_vacio_points: [[-74.0817, 4.6097], [-76.5320, 3.4516]],
                route_points: [[-76.5320, 3.4516], [-76.8, 2.5], [-77.2811, 1.2136]],
                peajes: [
                    { nombre: "Juanambú", lat: 2.4, lon: -77.0, costo: 28000 }
                ]
            },
            {
                cod_vehiculo: "V-103",
                placa: "JKL-789",
                marca: "Freightliner",
                conductor: "Jhonathan Puertas",
                licencia: "C3",
                costo_total: 1510000,
                costo_combustible: 1000000,
                costo_peajes: 320000,
                costos_fijos: 190000,
                puntos_conductor: 16,
                distancia_vacio: 14.2,
                distancia_viaje: 420.0,
                tiempo_total_min: 490,
                truck_pos: [10.4116, -75.5036],
                route_vacio_points: [[-75.5036, 10.4116], [-76.5320, 3.4516]],
                route_points: [[-76.5320, 3.4516], [-76.8, 2.5], [-77.2811, 1.2136]],
                peajes: [
                    { nombre: "Juanambú", lat: 2.4, lon: -77.0, costo: 28000 }
                ]
            }
        ]
    }
};
