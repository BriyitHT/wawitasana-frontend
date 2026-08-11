/* ============================================================
   WawitaSana — Cargador de pantallas
   Cada pantalla vive en su propio archivo dentro de sections/.
   Este script las trae con fetch(), las inserta en #screenContainer
   en orden y recién ahí carga data.js + app.js y arranca la app.
   Nota: requiere servir el sitio por http(s):// (Live Server,
   `python -m http.server`, etc.). No funciona abriendo el archivo
   con doble clic (file://) por las restricciones de fetch().
   ============================================================ */

const SECTIONS = [
  "sections/auth/splash.html",
  "sections/auth/login-cuidador.html",
  "sections/auth/registro-cuidador.html",
  "sections/cuidador/dashboard.html",
  "sections/cuidador/cita-detalle.html",
  "sections/cuidador/consentimiento.html",
  "sections/auth/login-medico.html",
  "sections/auth/registro-medico.html",
  "sections/medico/home.html",
  "sections/medico/paciente.html",
  "sections/medico/perfil.html",
  "sections/nino/avatar.html",
  "sections/cuidador/reporte.html",
  "sections/cuidador/mapa.html",
  "sections/cuidador/ruta.html",
  "sections/cuidador/alertas.html",
  "sections/cuidador/perfil.html",
  "sections/cuidador/documentos.html",
  "sections/auth/login-nino.html",
];

async function cargarSecciones() {
  const contenedor = document.getElementById("screenContainer");
  const html = await Promise.all(
    SECTIONS.map((ruta) =>
      fetch(ruta).then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar ${ruta}`);
        return res.text();
      }),
    ),
  );
  contenedor.innerHTML = html.join("\n");
}

function cargarScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.body.appendChild(script);
  });
}

async function iniciarApp() {
  try {
    await cargarSecciones();
    await cargarScript("js/data.js");
    await cargarScript("js/app.js");
    initApp();
  } catch (err) {
    console.error(err);
    document.getElementById("screenContainer").innerHTML =
      '<p style="padding:20px;font-size:13px;color:#b00">No se pudieron cargar las pantallas. Abre este prototipo con un servidor local (por ejemplo Live Server o `python -m http.server`).</p>';
  }
}

iniciarApp();
