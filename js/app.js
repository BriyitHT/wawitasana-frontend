/* ============================================================
   WawitaSana — Navegación del prototipo (vanilla JS)
   Sin frameworks, sin build step: solo muestra/oculta secciones
   dentro del marco del smartphone. Pensado para que cualquier
   miembro del equipo lo pueda leer y extender fácilmente.
   ============================================================ */

/* ---------- Iconos SVG reutilizables (sin emojis) ---------- */
const ICONS = {
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  calendar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  fileText:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  image:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  paperclip:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.4 11.1l-9.2 9.2a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.7 3.7 0 0 1 5.2 5.2l-9.3 9.2a1.8 1.8 0 0 1-2.6-2.6l8.5-8.4"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  checkCircle:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4L12 14.01l-3-3"/></svg>',
  phoneCall:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

/* Arma el contenido de un botón con icono + texto (ver .btn-icon-row en css) */
function iconLabel(iconSvg, texto) {
  return `<span class="btn-icon-row">${iconSvg}${texto}</span>`;
}

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- Barra inferior: cada rol ve solo su propio menú ---------- */
function setNav(role) {
  const navCuidador = document.getElementById("bottomNav");
  const navMedico = document.getElementById("bottomNavMedico");
  navCuidador.hidden = role !== "cuidador";
  navMedico.hidden = role !== "medico";
}

function setNavActive(navId, destino) {
  const nav = document.getElementById(navId);
  nav.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === destino);
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Banner de notificación tipo push (estilo WhatsApp) ---------- */
function showPushBanner(icono, titulo, detalle, alClic) {
  const banner = document.getElementById("pushBanner");
  document.getElementById("pushBannerIcono").innerHTML = icono || ICONS.bell;
  document.getElementById("pushBannerTitulo").textContent = titulo;
  document.getElementById("pushBannerDetalle").textContent = detalle;

  banner.classList.add("show");
  clearTimeout(showPushBanner._t);
  showPushBanner._t = setTimeout(() => banner.classList.remove("show"), 4000);

  banner.onclick = () => {
    banner.classList.remove("show");
    if (alClic) alClic();
  };
}

/* ---------- Pinta la ruta del paciente usando DEMO ---------- */
function renderRutaInto(containerId) {
  const track = document.getElementById(containerId);
  const actual = DEMO.paciente.faseActual;
  track.innerHTML = DEMO.rutaPasos
    .map((paso, i) => {
      let cls = "ruta-step";
      if (i < actual) cls += " done";
      if (i === actual) cls += " current";
      return `
      <div class="${cls}">
        <div class="line"></div>
        <div class="dot"></div>
        <div class="label">${paso.label}</div>
      </div>`;
    })
    .join("");
}
function renderRuta() {
  renderRutaInto("rutaTrack");
}

/* ---------- Pinta la lista de médicos con su switch de acceso ---------- */
function renderConsentimiento() {
  document.getElementById("txtPacienteNombreConsent").textContent =
    DEMO.paciente.nombre;

  const lista = document.getElementById("listaMedicos");
  lista.innerHTML = DEMO.medicos
    .map(
      (med) => `
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
      <div style="min-width:0;">
        <p style="font-weight:700;font-size:14px;margin:0;">${med.nombre}</p>
        <p style="font-size:12px;color:var(--ink-soft);margin:2px 0 0;">${med.especialidad}</p>
        <p style="font-size:11.5px;color:var(--ink-soft);margin:1px 0 0;">${med.hospital}</p>
      </div>
      <label class="switch" style="flex-shrink:0;">
        <input type="checkbox" data-med-id="${med.id}" ${med.documentosVisibles ? "checked" : ""}>
        <span class="slider"></span>
      </label>
    </div>
  `,
    )
    .join("");

  // Escucha los cambios de cada switch recién pintado
  lista.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = Number(e.target.dataset.medId);
      const medico = DEMO.medicos.find((m) => m.id === id);

      if (!e.target.checked) {
        // Retirar acceso a documentos pide confirmación: se revierte el
        // switch a "encendido" hasta que el usuario confirme en el modal.
        // El nivel de riesgo y las alertas de seguimiento (seguimientoVisible)
        // nunca se tocan acá, sea cual sea la respuesta del usuario.
        e.target.checked = true;
        abrirModalRetirarAcceso(medico, e.target);
        return;
      }

      medico.documentosVisibles = true;
      showToast(
        `Le diste acceso a documentos a ${medico.nombre.split(" ").slice(-1)}`,
      );
    });
  });
}

/* ---------- Modal de confirmación al retirar acceso a un médico ---------- */
let medicoPendienteRetiro = null;
let inputPendienteRetiro = null;

function abrirModalRetirarAcceso(medico, input) {
  medicoPendienteRetiro = medico;
  inputPendienteRetiro = input;
  document.getElementById("modalRetirarAccesoNombre").textContent =
    medico.nombre;
  document.getElementById("modalRetirarAccesoEspecialidad").textContent =
    medico.especialidad;
  document.getElementById("modalRetirarAcceso").hidden = false;
}

function cerrarModalRetirarAcceso() {
  document.getElementById("modalRetirarAcceso").hidden = true;
  medicoPendienteRetiro = null;
  inputPendienteRetiro = null;
}

function confirmarRetirarAcceso() {
  if (!medicoPendienteRetiro) return;
  // Solo afecta documentosVisibles: seguimientoVisible es información de
  // seguridad del paciente y se mantiene intacta pase lo que pase acá.
  medicoPendienteRetiro.documentosVisibles = false;
  if (inputPendienteRetiro) inputPendienteRetiro.checked = false;
  const nombre = medicoPendienteRetiro.nombre;
  cerrarModalRetirarAcceso();
  showToast(
    `Le quitaste el acceso a documentos a ${nombre.split(" ").slice(-1)}`,
  );
}

/* ---------- Vista del médico: lista de pacientes con acceso activo ---------- */
function renderMedicoHome() {
  const medico = DEMO.medicos.find((m) => m.id === DEMO.medicoSesion.medicoId);
  document.getElementById("txtMedicoNombre").textContent = medico.nombre;

  const lista = document.getElementById("listaPacientesMedico");

  // El médico aparece en la lista si tiene documentos visibles o (como
  // mínimo, siempre) el seguimiento de riesgo — nunca queda sin nada.
  if (!medico.documentosVisibles && !medico.seguimientoVisible) {
    lista.innerHTML = `
      <div class="card" style="text-align:center;padding:28px 18px;">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="1.8" style="margin:0 auto 10px;"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-6.5 0-10-8-10-8a19.4 19.4 0 0 1 4.22-5.44M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 8 10 8a19.4 19.4 0 0 1-2.19 3.19M1 1l22 22"/></svg>
        <p style="font-weight:700;margin:0 0 4px;">Ningún paciente activo por ahora</p>
        <p style="font-size:12.5px;color:var(--ink-soft);margin:0;">Cuando una familia active tu acceso, su paciente aparecerá aquí.</p>
      </div>`;
    return;
  }

  lista.innerHTML = `
    <button class="card" style="display:flex;align-items:center;gap:14px;width:100%;text-align:left;cursor:pointer;" id="btnAbrirPacienteMedico">
      <div class="role-icon" style="background:var(--wawa-tint);color:var(--wawa-dark);">
        <img src="images/nino.jpeg" alt="Paciente" />
      </div>
      <div>
        <div class="role-title">${DEMO.paciente.nombre}</div>
        <div class="role-desc">${DEMO.paciente.edad} años · Fase: ${DEMO.rutaPasos[DEMO.paciente.faseActual].label}</div>
      </div>
    </button>`;

  document
    .getElementById("btnAbrirPacienteMedico")
    .addEventListener("click", () => {
      renderMedicoPaciente();
      showScreen("screen-medico-paciente");
    });
}

/* ---------- Vista del médico: detalle de un paciente (solo lectura) ---------- */
function renderMedicoPaciente() {
  document.getElementById("txtMedicoPacienteNombre").textContent =
    DEMO.paciente.nombre;
  document.getElementById("txtMedicoPacienteEdad").textContent =
    DEMO.paciente.edad + " años";

  const pill = document.getElementById("pillRiesgoMedico");
  pill.className = "pill pill-" + DEMO.paciente.riesgo;
  pill.textContent = "Riesgo " + DEMO.paciente.riesgo;

  renderRutaInto("rutaTrackMedico");

  // El score de riesgo y la ruta de arriba se ven siempre (seguimientoVisible).
  // Los documentos solo si la familia le dio acceso a ESTE médico.
  const medicoSesion = DEMO.medicos.find(
    (m) => m.id === DEMO.medicoSesion.medicoId,
  );
  if (medicoSesion.documentosVisibles) {
    pintarDocumentos("listaDocumentosMedico");
  } else {
    document.getElementById("listaDocumentosMedico").innerHTML = `
      <div class="card" style="text-align:center;padding:20px;">
        <p style="font-size:12.5px;color:var(--ink-soft);margin:0;">
          La familia todavía no compartió documentos contigo.
        </p>
      </div>`;
  }

  const btnAsistencia = document.getElementById("btnMarcarAsistencia");
  btnAsistencia.disabled = false;
  btnAsistencia.style.opacity = "1";
  btnAsistencia.innerHTML = iconLabel(
    ICONS.checkCircle,
    "Marcar asistencia a este control",
  );
}

/* ---------- Perfil propio del médico ---------- */
function renderMedicoPerfil() {
  const medico = DEMO.medicos.find((m) => m.id === DEMO.medicoSesion.medicoId);
  document.getElementById("txtPerfilMedicoNombre").textContent = medico.nombre;
  document.getElementById("txtPerfilMedicoEspecialidad").textContent =
    medico.especialidad;
  document.getElementById("txtPerfilMedicoCmp").textContent = medico.cmp;
  document.getElementById("txtPerfilMedicoHospital").textContent =
    medico.hospital;
  document.getElementById("txtPerfilMedicoTelefono").textContent =
    medico.telefono;
  document.getElementById("txtPerfilMedicoEmail").textContent = medico.email;
}

/* ---------- Documentos: usada por la vista del médico, el perfil y "Subir documento" ---------- */
const ICONOS_DOC = { PDF: ICONS.fileText, JPG: ICONS.image, PNG: ICONS.image };

function pintarDocumentos(containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  if (DEMO.documentos.length === 0) {
    cont.innerHTML = `
      <div class="card" style="text-align:center;padding:20px;">
        <p style="font-size:12.5px;color:var(--ink-soft);margin:0;">Todavía no subes ningún documento.</p>
      </div>`;
    return;
  }
  cont.innerHTML = DEMO.documentos
    .map(
      (doc) => `
    <div class="card" style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:38px;height:38px;border-radius:10px;background:var(--paper-2);display:flex;align-items:center;justify-content:center;color:var(--salud);flex-shrink:0;">
        <span class="icon-sm" style="width:18px;height:18px;">${ICONOS_DOC[doc.tipo] || ICONS.paperclip}</span>
      </div>
      <div style="min-width:0;">
        <p style="font-weight:700;font-size:13.5px;margin:0;">${doc.nombre}</p>
        <p style="font-size:11.5px;color:var(--ink-soft);margin:1px 0 0;">${doc.tipo} · ${doc.fecha}</p>
      </div>
    </div>`,
    )
    .join("");
}

/* ---------- Pantalla "Subir documento" ---------- */
function renderDocumentosCuidador() {
  document.getElementById("txtDocPacienteNombre").textContent =
    DEMO.paciente.nombre;
  pintarDocumentos("listaDocumentosCuidador");
}

/* ---------- Avatar del niño ---------- */
let ninoOrigen = "splash"; // recuerda a dónde volver: 'splash' o 'dashboard'

function abrirNino(origen) {
  ninoOrigen = origen;
  document.getElementById("txtNinoNombre").textContent = DEMO.paciente.nombre;
  renderAvatarVisual();
  showScreen("screen-nino");
}

/* Cambia el color, tamaño e insignia del avatar según su nivel (simula su evolución) */
function renderAvatarVisual() {
  const nivel = DEMO.avatar.nivel;
  document.getElementById("txtNinoNivel").textContent = nivel;

  const circulo = document.getElementById("avatarCirculo");
  const insignia = document.getElementById("avatarInsignia");
  const etapa = document.getElementById("txtNinoEtapa");

  if (nivel <= 2) {
    circulo.style.background = "#F0B979";
    circulo.style.width = circulo.style.height = "128px";
    insignia.style.display = "none";
    etapa.firstChild.textContent = "Recién comenzando · Nivel ";
  } else if (nivel <= 4) {
    circulo.style.background = "var(--wawa)";
    circulo.style.width = circulo.style.height = "150px";
    insignia.style.display = "none";
    etapa.firstChild.textContent = "Tu compañero de ruta · Nivel ";
  } else {
    circulo.style.background = "var(--wawa-dark)";
    circulo.style.width = circulo.style.height = "164px";
    insignia.style.display = "flex";
    etapa.firstChild.textContent = "¡Poder desbloqueado! · Nivel ";
  }
}

/* ---------- Reporte descargable ---------- */
function renderReporte() {
  const medicosActivos =
    DEMO.medicos
      .filter((m) => m.documentosVisibles)
      .map((m) => m.nombre)
      .join(", ") || "Ninguno por ahora";
  document.getElementById("reporteContenido").innerHTML = `
    <p style="font-size:11px;font-weight:700;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Datos del paciente</p>
    <p style="margin:0 0 4px;"><strong>Nombre:</strong> ${DEMO.paciente.nombre}</p>
    <p style="margin:0 0 4px;"><strong>Edad:</strong> ${DEMO.paciente.edad} años</p>
    <p style="margin:0 0 4px;"><strong>Fase del tratamiento:</strong> ${DEMO.rutaPasos[DEMO.paciente.faseActual].label}</p>
    <p style="margin:0 0 14px;"><strong>Nivel de riesgo de abandono:</strong> ${DEMO.paciente.riesgo}</p>

    <p style="font-size:11px;font-weight:700;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Próxima cita</p>
    <p style="margin:0 0 4px;">${DEMO.proximaCita.tipo}</p>
    <p style="margin:0 0 14px;">${DEMO.proximaCita.fecha}, ${DEMO.proximaCita.hora} — ${DEMO.proximaCita.lugar}</p>

    <p style="font-size:11px;font-weight:700;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Médicos con acceso a este reporte</p>
    <p style="margin:0;">${medicosActivos}</p>
  `;
}

/* ---------- Mapa de hospitales cercanos ---------- */
function renderMapa() {
  document.getElementById("listaHospitales").innerHTML = DEMO.hospitalesCercanos
    .map(
      (h) => `
    <div class="card" style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <p style="font-weight:700;font-size:14px;margin:0;">${h.nombre}</p>
        <span class="pill pill-bajo" style="flex-shrink:0;">${h.distancia}</span>
      </div>
      <p style="font-size:12px;color:var(--ink-soft);margin:4px 0 12px;">${h.direccion}</p>
      <a href="https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}" target="_blank" rel="noopener"
         class="btn-primary" style="display:block;text-align:center;text-decoration:none;box-sizing:border-box;">Cómo llegar</a>
    </div>
  `,
    )
    .join("");
}

/* ---------- Tab Ruta: detalle completo + factores de riesgo + historial ---------- */
function renderRutaTab() {
  document.getElementById("txtRutaPacienteNombre").textContent =
    DEMO.paciente.nombre;
  renderRutaInto("rutaTrackDetalle");

  const pill = document.getElementById("pillRiesgoRuta");
  pill.className = "pill pill-" + DEMO.paciente.riesgo;
  pill.textContent = "Riesgo " + DEMO.paciente.riesgo;

  document.getElementById("listaFactoresRiesgo").innerHTML = DEMO.factoresRiesgo
    .map(
      (f) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);">
      <div>
        <p style="font-size:12.5px;font-weight:600;margin:0;">${f.factor}</p>
        <p style="font-size:11.5px;color:var(--ink-soft);margin:1px 0 0;">${f.valor}</p>
      </div>
      <span class="pill pill-${f.peso}" style="flex-shrink:0;">${f.peso}</span>
    </div>`,
    )
    .join("");

  document.getElementById("listaHistorial").innerHTML = DEMO.historialControles
    .map(
      (h) => `
    <div class="card" style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px;background:${h.asistio ? "#E7F5EE" : "#F8E7E1"};color:${h.asistio ? "var(--riesgo-bajo)" : "var(--riesgo-alto)"};">
        ${h.asistio ? "✓" : "✕"}
      </div>
      <div>
        <p style="font-weight:700;font-size:13.5px;margin:0;">${h.tipo}</p>
        <p style="font-size:11.5px;color:var(--ink-soft);margin:1px 0 0;">${h.fecha} · ${h.asistio ? "Asistió" : "No asistió"}</p>
      </div>
    </div>`,
    )
    .join("");
}

/* ---------- Tab Alertas ---------- */
const ICONOS_ALERTA = {
  cita: ICONS.calendar,
  documento: ICONS.fileText,
  motivacion: ICONS.heart,
};

/* Cada tipo de alerta se pinta con el color de marca correspondiente,
   en vez de dejar todas las tarjetas en blanco plano. */
const ESTILO_ALERTA = {
  cita: { fondo: "var(--salud-tint)", tinte: "card--tint-salud", icono: "var(--salud-dark)" },
  documento: { fondo: "var(--primario-tint)", tinte: "card--tint-primario", icono: "var(--primario-dark)" },
  motivacion: { fondo: "var(--wawa-tint)", tinte: "card--tint-wawa", icono: "var(--wawa-dark)" },
};

/* Aviso de seguimiento según el nivel de riesgo de abandono (deja claro
   QUIÉN va a contactar a la familia, nunca al médico como destinatario).
   Usa los colores reales de riesgo (no los de marca) porque acá sí
   corresponde: es justo el caso que ese color está reservado para.
   Riesgo bajo no genera aviso — no hace falta escalar ningún contacto. */
const COPY_ALERTA_RIESGO = {
  medio: {
    titulo: "La enfermera coordinadora de tu ruta te contactará esta semana",
    detalle: "Para acompañarte en el seguimiento de tu tratamiento.",
    fondo: "#fbf1de",
    icono: "var(--riesgo-medio)",
  },
  alto: {
    titulo: "El equipo de apoyo psicosocial se pondrá en contacto contigo",
    detalle:
      "En las próximas 24 a 48 horas, para ayudarte con lo que necesites.",
    fondo: "#f8e7e1",
    icono: "var(--riesgo-alto)",
  },
};

function renderAlertas() {
  document.getElementById("txtAlertasPacienteNombre").textContent =
    DEMO.paciente.nombre;
  pintarAlertas();

  // Simula una notificación push en tiempo real al entrar a la pantalla
  const sinLeer = DEMO.alertas.filter((a) => !a.leida);
  if (sinLeer.length > 0) {
    setTimeout(
      () =>
        showPushBanner(
          ICONOS_ALERTA[sinLeer[0].tipo] || ICONS.bell,
          sinLeer[0].titulo,
          sinLeer[0].detalle,
        ),
      350,
    );
  }
}

function pintarAlertas() {
  const cont = document.getElementById("listaAlertas");

  // Tarjeta de seguimiento por riesgo: no viene de DEMO.alertas (no es
  // una notificación que se marca como leída, es un estado vigente), así
  // que se arma aparte y va primero. No es un <button> con data-alerta-id
  // a propósito: no se puede descartar, solo cambia si cambia el riesgo.
  const copyRiesgo = COPY_ALERTA_RIESGO[DEMO.paciente.riesgo];
  const tarjetaRiesgo = copyRiesgo
    ? `
    <div class="card" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;background:${copyRiesgo.fondo};">
      <span class="icon-sm" style="width:20px;height:20px;flex-shrink:0;color:${copyRiesgo.icono};">${ICONS.phoneCall}</span>
      <div style="min-width:0;flex:1;">
        <p style="font-weight:700;font-size:13.5px;margin:0;">${copyRiesgo.titulo}</p>
        <p style="font-size:12px;color:var(--ink-soft);margin:2px 0 0;">${copyRiesgo.detalle}</p>
      </div>
    </div>`
    : "";

  cont.innerHTML =
    tarjetaRiesgo +
    DEMO.alertas
      .map((a) => {
        const estilo = ESTILO_ALERTA[a.tipo] || {
          fondo: "var(--surface)",
          tinte: "",
          icono: "var(--salud)",
        };
        return `
    <button class="card ${estilo.tinte}" data-alerta-id="${a.id}" style="display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;cursor:pointer;margin-bottom:10px;background:${estilo.fondo};${a.leida ? "opacity:0.6;" : ""}">
      <span class="icon-sm" style="width:20px;height:20px;flex-shrink:0;color:${estilo.icono};">${ICONOS_ALERTA[a.tipo] || ICONS.bell}</span>
      <div style="min-width:0;flex:1;">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
          <p style="font-weight:700;font-size:13.5px;margin:0;">${a.titulo}</p>
          ${a.leida ? "" : '<span style="width:8px;height:8px;border-radius:50%;background:var(--wawa);flex-shrink:0;margin-top:5px;"></span>'}
        </div>
        <p style="font-size:12px;color:var(--ink-soft);margin:2px 0 0;">${a.detalle}</p>
      </div>
    </button>`;
      })
      .join("");

  cont.querySelectorAll("[data-alerta-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.alertaId);
      const alerta = DEMO.alertas.find((a) => a.id === id);
      alerta.leida = true;
      pintarAlertas();
    });
  });
}

/* ---------- Tab Perfil ---------- */
function renderPerfil() {
  document.getElementById("txtPerfilNombre").textContent = DEMO.cuidador.nombre;
  document.getElementById("txtPerfilParentesco").textContent =
    DEMO.cuidador.parentesco;
  document.getElementById("txtPerfilDni").textContent = DEMO.cuidador.dni;
  document.getElementById("txtPerfilTelefono").textContent =
    DEMO.cuidador.telefono;
  document.getElementById("txtPerfilEmail").textContent = DEMO.cuidador.email;
  document.getElementById("txtPerfilDireccion").textContent =
    DEMO.cuidador.direccion;
  document.getElementById("txtPerfilPacienteNombre").textContent =
    DEMO.paciente.nombre;
  document.getElementById("txtPerfilEdad").textContent =
    DEMO.paciente.edad + " años";
  document.getElementById("txtPerfilSangre").textContent =
    DEMO.paciente.tipoSangre;
  pintarDocumentos("listaDocumentosPerfil");
}

function renderDashboard() {
  document.getElementById("txtCuidadorNombre").textContent =
    DEMO.cuidador.nombre.split(" ")[0];
  document.getElementById("txtPacienteNombre").textContent =
    DEMO.paciente.nombre;

  const pill = document.getElementById("pillRiesgo");
  const riesgo = DEMO.paciente.riesgo;
  pill.className = "pill pill-" + riesgo;
  pill.textContent = "Riesgo " + riesgo;

  renderRuta();
}

/* ---------- Detalle de la próxima cita ---------- */
function renderCitaDetalle() {
  const cita = DEMO.proximaCita;
  document.getElementById("txtCitaDetalleTipo").textContent = cita.tipo;
  document.getElementById("txtCitaDetalleFechaHora").textContent =
    cita.fecha + " · " + cita.hora;
  document.getElementById("txtCitaDetalleLugar").textContent = cita.lugar;
  document.getElementById("txtCitaDetalleDireccion").textContent =
    cita.direccion;
  document.getElementById("linkCitaDetalleMapa").href =
    `https://www.google.com/maps/search/?api=1&query=${cita.lat},${cita.lng}`;

  const medicoACargo =
    DEMO.medicos.find((m) => m.documentosVisibles)?.nombre ||
    DEMO.medicos[0].nombre;
  document.getElementById("txtCitaDetalleMedico").textContent = medicoACargo;

  document.getElementById("listaCitaDetallePreparacion").innerHTML =
    cita.preparacion
      .map(
        (item) => `
    <div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;">
      <span class="icon-sm" style="width:16px;height:16px;flex-shrink:0;margin-top:1px;color:var(--salud);">${ICONS.checkCircle}</span>
      <p style="font-size:12.5px;margin:0;color:var(--ink);">${item}</p>
    </div>`,
      )
      .join("");
}

/* ---------- Eventos ----------
   initApp() la llama js/loader.js una vez que las pantallas de
   sections/ ya están insertadas en el DOM. */
function initApp() {
  // Selector de rol
  document.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("click", () => {
      const role = card.dataset.role;
      if (card.classList.contains("disabled")) {
        showToast(
          "Este rol se habilita en la siguiente versión del prototipo",
        );
        return;
      }
      setNav(null); // ningún rol muestra el menú de otro mientras inicia sesión
      if (role === "cuidador") showScreen("screen-login");
      if (role === "medico") showScreen("screen-login-medico");
      if (role === "nino") showScreen("screen-login-nino");
    });
  });

  // Volver del login (cuidador) al selector
  document.getElementById("btnBackToSplash").addEventListener("click", () => {
    setNav(null);
    showScreen("screen-splash");
  });

  // Volver del login (médico) al selector
  document
    .getElementById("btnBackToSplashMedico")
    .addEventListener("click", () => {
      setNav(null);
      showScreen("screen-splash");
    });

  // Volver del código secreto del niño al selector
  document
    .getElementById("btnBackToSplashNino")
    .addEventListener("click", () => {
      setNav(null);
      showScreen("screen-splash");
    });

  // Entrar con el código secreto (demo: cualquier valor entra)
  document.getElementById("btnEntrarNino").addEventListener("click", () => {
    setNav(null); // el niño usa su propia pantalla de avatar, sin menú inferior
    abrirNino("splash");
  });

  // Ir del login al registro
  document.getElementById("btnIrRegistro").addEventListener("click", () => {
    showScreen("screen-registro");
  });

  // Volver del registro al login
  document
    .getElementById("btnBackFromRegistro")
    .addEventListener("click", () => {
      showScreen("screen-login");
    });

  // Crear cuenta (demo): toma lo que se escribió y actualiza los datos del prototipo
  document.getElementById("btnCrearCuenta").addEventListener("click", () => {
    const val = (id, fallback) =>
      document.getElementById(id).value.trim() || fallback;

    DEMO.cuidador.nombre = val("regNombre", DEMO.cuidador.nombre);
    DEMO.cuidador.dni = val("regDni", DEMO.cuidador.dni);
    DEMO.cuidador.email = val("regEmail", DEMO.cuidador.email);
    DEMO.cuidador.telefono = val("regTelefono", DEMO.cuidador.telefono);
    DEMO.cuidador.direccion = val("regDireccion", DEMO.cuidador.direccion);

    DEMO.paciente.nombre = val("regNinoNombre", DEMO.paciente.nombre);
    DEMO.paciente.edad = Number(val("regNinoEdad", DEMO.paciente.edad));
    DEMO.paciente.tipoSangre = val("regNinoSangre", DEMO.paciente.tipoSangre);
    DEMO.ninoCodigo = val("regCodigoNino", DEMO.ninoCodigo);

    showToast(
      "Cuenta creada. ¡Bienvenida, " + DEMO.cuidador.nombre.split(" ")[0] + "!",
    );
    renderDashboard();
    showScreen("screen-dashboard");
    setNav("cuidador");
    setNavActive("bottomNav", "inicio");
  });

  // Ir del login (médico) al registro
  document
    .getElementById("btnIrRegistroMedico")
    .addEventListener("click", () => {
      showScreen("screen-registro-medico");
    });

  // Volver del registro (médico) al login
  document
    .getElementById("btnBackFromRegistroMedico")
    .addEventListener("click", () => {
      showScreen("screen-login-medico");
    });

  // Crear cuenta de médico (demo): toma lo que se escribió y actualiza al médico en sesión
  document
    .getElementById("btnCrearCuentaMedico")
    .addEventListener("click", () => {
      const val = (id, fallback) =>
        document.getElementById(id).value.trim() || fallback;
      const medico = DEMO.medicos.find(
        (m) => m.id === DEMO.medicoSesion.medicoId,
      );

      medico.nombre = val("regMedNombre", medico.nombre);
      medico.cmp = val("regMedCmp", medico.cmp);
      medico.especialidad = val("regMedEspecialidad", medico.especialidad);
      medico.hospital = val("regMedHospital", medico.hospital);
      medico.email = val("regMedEmail", medico.email);
      medico.telefono = val("regMedTelefono", medico.telefono);

      showToast(
        "Cuenta creada. ¡Bienvenido/a, " + medico.nombre.split(" ")[0] + "!",
      );
      renderMedicoHome();
      showScreen("screen-medico-home");
      setNav("medico");
      setNavActive("bottomNavMedico", "medico-inicio");
    });

  // Login cuidador (demo: cualquier valor entra)
  document.getElementById("btnLogin").addEventListener("click", () => {
    renderDashboard();
    showScreen("screen-dashboard");
    setNav("cuidador");
    setNavActive("bottomNav", "inicio");
  });

  // Login médico (demo: cualquier valor entra)
  document.getElementById("btnLoginMedico").addEventListener("click", () => {
    renderMedicoHome();
    showScreen("screen-medico-home");
    setNav("medico");
    setNavActive("bottomNavMedico", "medico-inicio");
  });

  // Cerrar sesión del médico → vuelve al selector de rol
  document
    .getElementById("btnCerrarSesionMedico")
    .addEventListener("click", () => {
      setNav(null);
      showScreen("screen-splash");
    });

  // Volver del detalle de paciente a la lista del médico
  document
    .getElementById("btnBackToMedicoHome")
    .addEventListener("click", () => {
      showScreen("screen-medico-home");
    });

  // El médico marca asistencia: avanza la ruta, guarda historial y hace evolucionar el avatar
  document
    .getElementById("btnMarcarAsistencia")
    .addEventListener("click", (e) => {
      const hoy = new Date().toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      DEMO.historialControles.unshift({
        fecha: hoy,
        tipo: DEMO.proximaCita.tipo,
        asistio: true,
      });

      if (DEMO.paciente.faseActual < DEMO.rutaPasos.length - 1) {
        DEMO.paciente.faseActual += 1;
      }
      DEMO.avatar.nivel += 1;

      renderRutaInto("rutaTrackMedico"); // refleja el avance en la propia pantalla del médico

      const btn = e.currentTarget;
      btn.innerHTML = iconLabel(ICONS.checkCircle, "Asistencia registrada");
      btn.disabled = true;
      btn.style.opacity = "0.7";
      showToast(
        "Asistencia registrada. El avatar de " +
          DEMO.paciente.nombre +
          " subió de nivel",
      );
    });

  // Navegación inferior (cada menú solo mueve los tabs de su propia barra)
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.parentElement
        .querySelectorAll(".nav-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const destino = item.dataset.nav;
      // Menú del cuidador / niño
      if (destino === "inicio") showScreen("screen-dashboard");
      if (destino === "ruta") {
        renderRutaTab();
        showScreen("screen-ruta");
      }
      if (destino === "alertas") {
        renderAlertas();
        showScreen("screen-alertas");
      }
      if (destino === "perfil") {
        renderPerfil();
        showScreen("screen-perfil");
      }
      // Menú del médico
      if (destino === "medico-inicio") {
        renderMedicoHome();
        showScreen("screen-medico-home");
      }
      if (destino === "medico-perfil") {
        renderMedicoPerfil();
        showScreen("screen-medico-perfil");
      }
    });
  });

  // Desde Perfil: ir a gestionar el acceso de médicos
  document
    .getElementById("btnIrConsentimientoDesdePerfil")
    .addEventListener("click", () => {
      renderConsentimiento();
      showScreen("screen-consentimiento");
    });

  // Cerrar sesión: vuelve al selector de rol y oculta la barra inferior
  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    setNav(null);
    showScreen("screen-splash");
  });

  // Acciones rápidas del dashboard
  document.querySelectorAll(".action-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const accion = btn.dataset.action;
      if (accion === "consentimiento") {
        renderConsentimiento();
        showScreen("screen-consentimiento");
        return;
      }
      if (accion === "avatar") {
        abrirNino("dashboard");
        return;
      }
      if (accion === "reporte") {
        renderReporte();
        showScreen("screen-reporte");
        return;
      }
      if (accion === "mapa") {
        renderMapa();
        showScreen("screen-mapa");
        return;
      }
      if (accion === "documentos") {
        renderDocumentosCuidador();
        showScreen("screen-documentos");
        return;
      }
      showToast("Acción de demostración: se conecta en la siguiente iteración");
    });
  });

  // Volver de "Subir documento" al dashboard
  document
    .getElementById("btnBackFromDocumentos")
    .addEventListener("click", () => {
      showScreen("screen-dashboard");
    });

  // Subir un archivo de verdad (demo: se agrega a la lista, no se guarda el contenido)
  document.getElementById("inputArchivo").addEventListener("change", (e) => {
    const input = e.target;
    const file = input.files[0];
    if (!file) return;

    const overlay = document.getElementById("scanOverlay");
    const bar = document.getElementById("scanProgressBar");
    document.getElementById("scanArchivoNombre").textContent = file.name;

    bar.style.transition = "none";
    bar.style.width = "0%";
    overlay.classList.add("show");
    // Fuerza reflow para que el navegador aplique el 0% antes de animar a 100%
    void bar.offsetWidth;
    bar.style.transition = "";
    requestAnimationFrame(() => {
      bar.style.width = "100%";
    });

    // Simula el tiempo que tomaría leer el documento con OCR + IA
    setTimeout(() => {
      overlay.classList.remove("show");

      const partes = file.name.split(".");
      const extension =
        partes.length > 1 ? partes.pop().toUpperCase() : "ARCHIVO";
      const nombreSinExtension = partes.join(".") || file.name;
      const hoy = new Date().toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      DEMO.documentos.unshift({
        nombre: nombreSinExtension,
        fecha: hoy,
        tipo: extension,
      });
      pintarDocumentos("listaDocumentosCuidador");

      // Simula que la app "leyó" el documento y generó una alerta (en producción sería OCR + NLP real)
      const nuevaAlertaId = Date.now();
      DEMO.alertas.unshift({
        id: nuevaAlertaId,
        tipo: "documento",
        titulo: "Leímos tu documento",
        detalle:
          "Detectamos una posible fecha de control. Revísala en Alertas.",
        leida: false,
      });

      showPushBanner(
        ICONS.fileText,
        "Documento analizado",
        'Detectamos una posible fecha de control en "' + file.name + '"',
      );
      input.value = ""; // permite volver a subir el mismo archivo si se desea
    }, 2400);
  });

  // Desde Perfil: ir directo a subir un documento
  document
    .getElementById("btnIrDocumentosDesdePerfil")
    .addEventListener("click", () => {
      renderDocumentosCuidador();
      showScreen("screen-documentos");
    });

  // Volver de consentimiento al dashboard
  document
    .getElementById("btnBackToDashboard")
    .addEventListener("click", () => {
      showScreen("screen-dashboard");
    });

  // Modal de confirmación al retirar acceso a un médico
  document
    .getElementById("modalRetirarAccesoCancelar")
    .addEventListener("click", cerrarModalRetirarAcceso);
  document
    .getElementById("modalRetirarAccesoConfirmar")
    .addEventListener("click", confirmarRetirarAcceso);
  // Tocar fuera de la tarjeta (el fondo oscuro) equivale a cancelar
  document
    .getElementById("modalRetirarAcceso")
    .addEventListener("click", (e) => {
      if (e.target.id === "modalRetirarAcceso") cerrarModalRetirarAcceso();
    });

  // Salir del avatar del niño (vuelve a splash o al dashboard, según por dónde entró)
  document.getElementById("btnSalirNino").addEventListener("click", () => {
    showScreen(
      ninoOrigen === "dashboard" ? "screen-dashboard" : "screen-splash",
    );
  });

  // Cumplir el reto de hoy (demo)
  document.getElementById("btnCumplirReto").addEventListener("click", (e) => {
    DEMO.avatar.nivel += 1;
    renderAvatarVisual();
    const btn = e.currentTarget;
    btn.innerHTML = iconLabel(ICONS.checkCircle, "¡Poder desbloqueado!");
    btn.disabled = true;
    btn.style.opacity = "0.7";
    showToast("¡Kuntur subió de nivel!");
  });

  // Volver del reporte al dashboard
  document
    .getElementById("btnBackFromReporte")
    .addEventListener("click", () => {
      showScreen("screen-dashboard");
    });

  // Descargar / imprimir reporte
  document
    .getElementById("btnDescargarReporte")
    .addEventListener("click", () => {
      window.print();
    });

  // Volver del mapa al dashboard
  document.getElementById("btnBackFromMapa").addEventListener("click", () => {
    showScreen("screen-dashboard");
  });

  // Ver el detalle completo de la próxima cita
  document
    .getElementById("btnVerDetalleCita")
    .addEventListener("click", () => {
      renderCitaDetalle();
      showScreen("screen-cita-detalle");
    });

  // Volver del detalle de cita al dashboard
  document
    .getElementById("btnBackFromCitaDetalle")
    .addEventListener("click", () => {
      showScreen("screen-dashboard");
    });
}
