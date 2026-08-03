#!/usr/bin/env node
// Genera el material gráfico del piloto de menú digital: la pieza que se pega
// o se para en la mesa, y la pieza cuadrada que el negocio puede subir a sus
// posts. Las dos llevan el QR de su propia ruta.
//
//   node scripts/qr-menu.mjs snacky el-tunel-delicias-mas
//
// Sale en .qr-menu/<slug>/ : mesa.html, post.html y —si hay Chrome— mesa.pdf y
// post.png. El HTML es la fuente: si algo se ve mal, se abre en el navegador y
// se imprime desde ahí.
//
// Lo que va impreso NO se puede corregir. Dos cosas que dependen de eso:
//   - El slug: una vez repartido el papel, renombrar el negocio rompería el QR.
//     Por eso existe `business_slug_history` y el redirect en /[slug]/menu.
//   - El `src`: es 'menu-qr' a secas, sin el nombre del negocio. El negocio ya
//     viaja en la ruta y el servidor lo guarda en qr_scans.business_id.

import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = join(RAIZ, ".qr-menu");
const DOMINIO = "https://vichente.com";
const SRC = "menu-qr";

// -- entorno ------------------------------------------------------------------

function cargarEnv() {
  const env = { ...process.env };
  for (const archivo of [".env.local", ".env"]) {
    const ruta = join(RAIZ, archivo);
    if (!existsSync(ruta)) continue;
    for (const linea of readFileSync(ruta, "utf8").split("\n")) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

const env = cargarEnv();
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Faltan SUPABASE_URL / SUPABASE_ANON_KEY (se leen de landing/.env.local).");
  process.exit(1);
}

// -- datos --------------------------------------------------------------------

async function traerNegocio(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}` +
      `&select=id,slug,name,business_services(id)`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase respondió ${res.status} para "${slug}"`);
  const [negocio] = await res.json();
  return negocio ?? null;
}

// -- QR -----------------------------------------------------------------------

// -l Q = 25% de corrección de error. Es el nivel con el que se midió el tamaño
// del código al elegir slug sobre UUID: aguanta que el papel se manche o se
// despegue una esquina sin volverse ilegible.
function qrSvg(url) {
  try {
    const svg = execFileSync("qrencode", ["-t", "SVG", "-l", "Q", "-m", "0", "-o", "-", url], {
      encoding: "utf8",
    });
    // Se le quita el tamaño fijo para poder escalarlo con CSS sin perder nitidez.
    return svg
      .replace(/<\?xml[^>]*\?>/, "")
      .replace(/<!DOCTYPE[^>]*>/, "")
      .replace(/width="[^"]*"/, "")
      .replace(/height="[^"]*"/, "")
      .trim();
  } catch {
    console.error(
      "No se pudo ejecutar `qrencode`. Instálalo con:  brew install qrencode"
    );
    process.exit(1);
  }
}

function assetBase64(nombre) {
  const ruta = join(RAIZ, "public", nombre);
  return `data:image/png;base64,${readFileSync(ruta).toString("base64")}`;
}

const ISOTIPO = assetBase64("vichente-isotipo.png");
const ISOTIPO_BLANCO = assetBase64("vichente-isotipo-white.png");

// -- piezas -------------------------------------------------------------------

const ESTILO_BASE = `
  @font-face { font-family: system; src: local("Inter"), local("Helvetica Neue"); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Outfit", "Inter", -apple-system, "Helvetica Neue", sans-serif;
    color: #1f1a14;
    -webkit-font-smoothing: antialiased;
  }
  .qr svg { width: 100%; height: auto; display: block; shape-rendering: crispEdges; }
  .qr svg rect:first-of-type { fill: #ffffff; }
`;

/**
 * Pieza de mesa: carta tipo "tienda de campaña" en tamaño carta. Se imprime,
 * se dobla a la mitad y se para sola — sin porta-folletos que comprar. La cara
 * de arriba va volteada 180° para que las dos se lean derechas al doblarla.
 */
function piezaDeMesa({ nombre, url, urlLegible, qr }) {
  const cara = (rotada) => `
    <section class="cara${rotada ? " rotada" : ""}">
      <div class="texto">
        <div class="marca">
          <img src="${ISOTIPO}" alt="">
          <span>Vichente App</span>
        </div>
        <h1>Nuestro menú</h1>
        <p class="instruccion">Apunta la cámara de tu teléfono al código.<br>Fotos y precios, sin descargar nada.</p>
        <p class="url">${urlLegible}</p>
      </div>
      <div class="qr">${qr}</div>
    </section>`;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Menú de mesa — ${nombre}</title>
<style>
  ${ESTILO_BASE}
  @page { size: letter portrait; margin: 0; }
  body { width: 8.5in; height: 11in; background: #fff; }
  .cara {
    height: 5.5in;
    padding: 0.55in 0.6in;
    display: flex; align-items: center; gap: 0.5in;
    background: #fff6e8;
  }
  .cara.rotada { transform: rotate(180deg); }
  .texto { flex: 1; min-width: 0; }
  .marca { display: flex; align-items: center; gap: 10px; }
  .marca img { width: 34px; height: 34px; object-fit: contain; }
  .marca span { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #e15204; }
  h1 { font-size: 54px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.02; margin-top: 14px; }
  .instruccion { font-size: 17px; line-height: 1.45; color: #6b5e48; margin-top: 14px; }
  .url { font-size: 15px; font-weight: 700; color: #e15204; margin-top: 16px; word-break: break-all; }
  .qr { width: 2.6in; flex: none; padding: 0.14in; background: #fff; border-radius: 10px; }
  /* La línea de doblez: se corta justo a la mitad de la hoja. */
  .doblez {
    height: 0; border-top: 1px dashed #d6cfc1; position: relative;
  }
  .doblez span {
    position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
    background: #fff; padding: 0 10px; font-size: 10px; color: #9a8e76;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  @media print { .doblez span { display: none; } }
</style></head>
<body>
  ${cara(true)}
  <div class="doblez"><span>doblar aquí</span></div>
  ${cara(false)}
</body></html>`;
}

/** Pieza digital: cuadrada 1080×1080, para que el negocio la suba a sus posts. */
function piezaDePost({ nombre, urlLegible, qr }) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Post — ${nombre}</title>
<style>
  ${ESTILO_BASE}
  body { width: 1080px; height: 1080px; }
  .lienzo {
    width: 1080px; height: 1080px; padding: 84px;
    background: linear-gradient(160deg, #e15204 0%, #ff8538 100%);
    color: #fff; display: flex; flex-direction: column; justify-content: space-between;
  }
  .marca { display: flex; align-items: center; gap: 16px; }
  .marca img { width: 62px; height: 62px; object-fit: contain; }
  .marca span { font-size: 42px; font-weight: 800; letter-spacing: -0.02em; }
  h1 { font-size: 96px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.02; }
  h1 em { font-style: normal; display: block; opacity: 0.82; font-size: 58px; font-weight: 700; margin-top: 14px; }
  .fila { display: flex; align-items: flex-end; gap: 48px; }
  .fila p { font-size: 30px; line-height: 1.35; opacity: 0.95; flex: 1; }
  .qr { width: 340px; flex: none; padding: 22px; background: #fff; border-radius: 26px; }
  .url { font-size: 26px; font-weight: 700; opacity: 0.9; margin-top: 22px; word-break: break-all; }
</style></head>
<body>
  <div class="lienzo">
    <div class="marca"><img src="${ISOTIPO_BLANCO}" alt=""><span>Vichente App</span></div>
    <h1>Nuestro menú<em>${nombre}</em></h1>
    <div class="fila">
      <div>
        <p>Escanea el código y míralo completo, con fotos y precios.</p>
        <p class="url">${urlLegible}</p>
      </div>
      <div class="qr">${qr}</div>
    </div>
  </div>
</body></html>`;
}

// -- render opcional a PDF/PNG ------------------------------------------------

const CHROMES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

function chrome() {
  return CHROMES.find((c) => existsSync(c)) ?? null;
}

// Chrome headless escribe el archivo y se queda colgado en vez de salir, así
// que no se espera a que termine: se espera al archivo y se le da matarile.
async function render(bin, htmlPath, salida, args) {
  rmSync(salida, { force: true });
  const hijo = spawn(
    bin,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${join(SALIDA, ".chrome")}`,
      "--virtual-time-budget=4000",
      ...args,
      `file://${htmlPath}`,
    ],
    { stdio: "ignore", detached: false }
  );

  try {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (existsSync(salida) && statSync(salida).size > 0) {
        // Un respiro para que termine de escribirlo.
        await new Promise((r) => setTimeout(r, 700));
        return true;
      }
    }
    return false;
  } finally {
    hijo.kill("SIGKILL");
  }
}

// -- principal ----------------------------------------------------------------

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Uso: node scripts/qr-menu.mjs <slug> [slug...]");
  process.exit(1);
}

const bin = chrome();
if (!bin) console.warn("Chrome no encontrado: se generan los HTML, no el PDF ni el PNG.\n");

for (const slug of slugs) {
  const negocio = await traerNegocio(slug);
  if (!negocio) {
    console.error(`✗ ${slug}: no existe ese slug en la base. Nada que imprimir.`);
    process.exitCode = 1;
    continue;
  }

  const platillos = negocio.business_services?.length ?? 0;
  const url = `${DOMINIO}/${negocio.slug}/menu?src=${SRC}`;
  const urlLegible = `vichente.com/${negocio.slug}/menu`;
  const qr = qrSvg(url);

  const dir = join(SALIDA, negocio.slug);
  mkdirSync(dir, { recursive: true });

  const mesa = join(dir, "mesa.html");
  const post = join(dir, "post.html");
  writeFileSync(mesa, piezaDeMesa({ nombre: negocio.name, url, urlLegible, qr }));
  writeFileSync(post, piezaDePost({ nombre: negocio.name, urlLegible, qr }));

  if (bin) {
    const pdf = join(dir, "mesa.pdf");
    const png = join(dir, "post.png");
    const okPdf = await render(bin, mesa, pdf, [`--print-to-pdf=${pdf}`, "--no-pdf-header-footer"]);
    const okPng = await render(bin, post, png, [`--screenshot=${png}`, "--window-size=1080,1080"]);
    if (!okPdf) console.warn("   ⚠ No salió mesa.pdf — imprime mesa.html desde el navegador.");
    if (!okPng) console.warn("   ⚠ No salió post.png — abre post.html y captura la pantalla.");
  }

  console.log(`✓ ${negocio.name}`);
  console.log(`   QR    → ${url}`);
  console.log(`   Salida→ ${dir}`);
  if (platillos === 0) {
    console.log("   ⚠ Este negocio no tiene platillos cargados: el QR lleva a un menú vacío.");
  } else {
    console.log(`   ${platillos} platillos cargados.`);
  }
  console.log("");
}
