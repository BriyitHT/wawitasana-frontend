/* ============================================================
   WawitaSana — Datos de demostración (MOCK)
   Ningún dato real de pacientes. Solo para ilustrar el flujo
   ante el jurado. En producción esto vendría de un backend
   con los resguardos de la Ley N.° 29733 (protección de datos).
   ============================================================ */

const DEMO = {
  cuidador: {
    nombre: "Rosa Quispe",
    parentesco: "Mamá",
    dni: "45678912",
    telefono: "987 654 321",
    email: "rosa.quispe@ejemplo.com",
    direccion: "Jr. Los Andes 245, Andahuaylas",
  },
  paciente: {
    nombre: "Mateo",
    edad: 6,
    tipoSangre: "O+",
    faseActual: 2, // índice dentro de rutaPasos (0-based)
    riesgo: "medio", // "bajo" | "medio" | "alto"
    avatarNivel: 3,
  },
  rutaPasos: [
    { label: "Diagnóstico" },
    { label: "Inducción" },
    { label: "Mantenimiento" },
    { label: "Control" },
    { label: "Alta" },
  ],
  medicos: [
    {
      id: 1,
      nombre: "Dra. Mariana Rojas",
      cmp: "45678",
      especialidad: "Hematología pediátrica",
      hospital: "INSN San Borja",
      email: "mrojas@insnsb.gob.pe",
      telefono: "991 234 567",
      activo: true,
    },
    {
      id: 2,
      nombre: "Dr. Carlos Ninanya",
      cmp: "52341",
      especialidad: "Pediatría general",
      hospital: "Hospital Regional del Cusco",
      email: "cninanya@hrcusco.gob.pe",
      telefono: "984 112 233",
      activo: false,
    },
    {
      id: 3,
      nombre: "Dra. Lucía Fernández",
      cmp: "61809",
      especialidad: "Hematología pediátrica",
      hospital: "Hospital de Apoyo de Iquitos",
      email: "lfernandez@hai.gob.pe",
      telefono: "965 887 120",
      activo: false,
    },
  ],
  medicoSesion: { medicoId: 1 }, // La demo "inicia sesión" como el médico con id 1 (Dra. Mariana Rojas)
  factoresRiesgo: [
    { factor: "Tipo de seguro", valor: "SIS", peso: "alto" },
    {
      factor: "Distancia al centro de salud",
      valor: "Zona rural · ~3 h de viaje",
      peso: "alto",
    },
    { factor: "Fase del tratamiento", valor: "Mantenimiento", peso: "medio" },
    {
      factor: "Citas perdidas previas",
      valor: "1 en los últimos 3 meses",
      peso: "medio",
    },
  ],
  historialControles: [
    { fecha: "10 jul 2026", tipo: "Control hematológico", asistio: true },
    { fecha: "12 jun 2026", tipo: "Control hematológico", asistio: true },
    { fecha: "15 may 2026", tipo: "Control hematológico", asistio: false },
  ],
  alertas: [
    {
      id: 1,
      tipo: "cita",
      titulo: "Tu control es en 3 días",
      detalle: "Viernes 14 de agosto, 9:00 a. m.",
      leida: false,
    },
    {
      id: 2,
      tipo: "documento",
      titulo: "Sube tu último análisis",
      detalle: "Ayuda a que tu médico prepare la consulta",
      leida: false,
    },
    {
      id: 3,
      tipo: "motivacion",
      titulo: "Mensaje para Mateo",
      detalle: "Hoy toca su medicina a las 8:00 p. m.",
      leida: true,
    },
  ],
  ninoCodigo: "4821",
  avatar: {
    nombre: "Kuntur",
    nivel: 3,
    proximoPoder: "vuelo veloz",
  },
  hospitalesCercanos: [
    {
      nombre: "INSN San Borja",
      direccion: "Av. Javier Prado Este 3101, San Borja",
      distancia: "1.2 km",
      lat: -12.099,
      lng: -76.999,
    },
    {
      nombre: "Hospital del Niño (Breña)",
      direccion: "Av. Brasil 600, Breña",
      distancia: "6.4 km",
      lat: -12.055,
      lng: -77.045,
    },
    {
      nombre: "Hospital Nacional Edgardo Rebagliati (EsSalud)",
      direccion: "Av. Edgardo Rebagliati 490, Jesús María",
      distancia: "8.1 km",
      lat: -12.083,
      lng: -77.043,
    },
  ],
  documentos: [
    { nombre: "Informe hematológico", fecha: "10 jul 2026", tipo: "PDF" },
    { nombre: "Receta médica", fecha: "28 jul 2026", tipo: "JPG" },
    { nombre: "Resultado de laboratorio", fecha: "02 ago 2026", tipo: "PDF" },
  ],
  proximaCita: {
    tipo: "Control hematológico",
    fecha: "Viernes 14 de agosto",
    hora: "9:00 a. m.",
    lugar: "Instituto Nacional de Salud del Niño – San Borja",
    direccion: "Av. Javier Prado Este 3101, San Borja",
    lat: -12.099,
    lng: -76.999,
    preparacion: [
      "Trae el informe de tu último análisis",
      "Llega 15 minutos antes para el registro",
      "Trae el carné de citas y el DNI del niño",
    ],
  },
  recordatorio:
    "Recuerda traer el informe de tu último análisis a la cita del viernes.",
};
