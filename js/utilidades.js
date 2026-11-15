'use strict';

const plantillas = new Map();

const imagenesLocales = {
  1: { carpeta: 'cafe-premium-loja', prefijo: 'CafeMercadilloLojano', extension: 'webp' },
  2: { carpeta: 'cafe-altura-alamor', prefijo: 'CafeMercadilloAlturaAlamor', extension: 'webp' },
  3: { carpeta: 'cafe-origen-mercadillo', prefijo: 'CafeMercadillo', extension: 'webp' },
  5: { carpeta: 'cafe-especial-mercadillo', prefijo: 'CafeMercadilloEspecial', extension: 'webp' },
  6: { carpeta: 'cafe-intenso-alamor', prefijo: 'CafeMercadilloIntensoAlamor', extension: 'webp' },
  7: { carpeta: 'cafe-suave-mercadillo', prefijo: 'CafeMercadilloSuaveMercadillo', extension: 'webp' },
  8: { carpeta: 'cafe-organico-loja', prefijo: 'CafeMercadilloOrganico', extension: 'webp' },
  9: { carpeta: 'cafe-reserva-altura', prefijo: 'CafeMercadilloReservaAltura', extension: 'webp' },
  10: { carpeta: 'pack-origen', prefijo: 'CafeMercadilloPackOrigen', extension: 'webp' },
  11: { carpeta: 'cafe-descafeinado', prefijo: 'CafeMercadilloDescaeinado', extension: 'webp' },
  12: { carpeta: 'cafe-tostado-artesanal', prefijo: 'CafeMercadilloTostadoArtesanal', extension: 'webp' },
  13: { archivo: 'imagenes/productos-lojanos/BocadillosLojanos.webp' },
  14: { archivo: 'imagenes/productos-lojanos/DulceDeGuayaba.webp' },
  15: { archivo: 'imagenes/productos-lojanos/roscones.webp' },
  16: { archivo: 'imagenes/productos-lojanos/ConservaDulceDeLeche.webp' },
  17: { archivo: 'imagenes/productos-lojanos/Horchata.webp' },
  18: { archivo: 'imagenes/productos-lojanos/MielDeAbeja.webp' },
  19: { archivo: 'imagenes/productos-lojanos/PanelaArtesanal.webp' },
  20: { archivo: 'imagenes/productos-lojanos/InfusionDeHierbas.webp' },
  21: { archivo: 'imagenes/productos-lojanos/CajaSaboresDeLoja.webp' },
  22: { archivo: 'imagenes/productos-lojanos/AmantesDelCafe.webp' },
  23: { archivo: 'imagenes/productos-lojanos/PackTradicionLojana.webp' },
  24: { archivo: 'imagenes/productos-lojanos/KitDeCafeYTaza.webp' },
  25: { archivo: 'imagenes/productos-lojanos/Bizcochuelo.webp' },
  26: { archivo: 'imagenes/productos-lojanos/Quesadilla.webp' },
  27: { archivo: 'imagenes/productos-lojanos/FaldiqueraDeMani.webp' },
  28: { archivo: 'imagenes/productos-lojanos/Suspiros.webp' },
  29: { archivo: 'imagenes/productos-lojanos/Cocada.webp' },
  30: { archivo: 'imagenes/productos-lojanos/GalletasDePanela.webp' },
  31: { archivo: 'imagenes/productos-lojanos/ManiTostado.webp' },
  32: { archivo: 'imagenes/productos-lojanos/maizTostado.webp' },
  33: { archivo: 'imagenes/productos-lojanos/HarinaDeMaiz.webp' },
  34: { archivo: 'imagenes/productos-lojanos/PastaDeMani.webp' },
  35: { archivo: 'imagenes/productos-lojanos/FrejolSeco.webp' },
  36: { archivo: 'imagenes/productos-lojanos/ChocolateDeMesa.webp' },
  37: { archivo: 'imagenes/productos-lojanos/CajaCafeYBocadillos.webp' },
  38: { archivo: 'imagenes/productos-lojanos/DulcesParaCompartir.webp' },
  39: { archivo: 'imagenes/productos-lojanos/KitHorchataMiel.webp' },
  40: { archivo: 'imagenes/productos-lojanos/DuoDeCafes.webp' },
  41: { archivo: 'imagenes/productos-lojanos/CajaDeMerienda.webp' },
  42: { archivo: 'imagenes/productos-lojanos/CocinaTradicional.webp' },
};

function imagenProducto(producto, presentacion = 'Molido', peso = '250 g') {
  const archivos = imagenesLocales[producto?.id];
  if (!archivos) return producto?.image || 'favicon.svg';
  if (archivos.archivo) return archivos.archivo;
  const gramos = { '250 g': '250', '450 g': '450', '900 g': '900' }[peso];
  if (!gramos || !['Molido', 'En grano'].includes(presentacion)) return producto.image;
  const formato = presentacion === 'En grano' ? 'EnGrano' : '';
  const extension = archivos.extensiones?.[`${formato}${gramos}`] || archivos.extension;
  return `imagenes/${archivos.carpeta}/${archivos.prefijo}${formato}${gramos}.${extension}`;
}

function urlPagina(ruta) {
  const [nombre, consulta] = ruta.split('?');
  const paginas = ['inicio', 'tienda', 'categoria', 'busqueda', 'producto', 'carrito', 'checkout', 'confirmacion', 'login', 'recuperar', 'cuenta', 'direcciones', 'pedidos', 'seguimiento', 'favoritos', 'nosotros', 'ayuda'];
  const archivo = paginas.includes(nombre) ? (nombre === 'inicio' ? 'index' : nombre) : 'index';
  return archivo + '.html' + (consulta ? '?' + consulta : '');
}

function irA(ruta) {
  location.assign(urlPagina(ruta));
}

function enlacesPaginas(contenido) {
  return contenido.replace(/href="#(?!app")([^"]+)"/g, (_, ruta) => `href="${urlPagina(ruta)}"`);
}

function html(fragmentos, ...valores) {
  return enlacesPaginas(fragmentos.reduce((resultado, texto, indice) => {
    return resultado + texto + (valores[indice] ?? '');
  }, ''));
}

function plantilla(nombre, valores = {}) {
  const contenido = plantillas.get(nombre);
  if (contenido === undefined) throw new Error('No se ha cargado la plantilla ' + nombre);

  return enlacesPaginas(contenido.replace(/{{(\w+)}}/g, (coincidencia, clave) => {
    return String(valores[clave] ?? '');
  }));
}

const $ = (s) => document.querySelector(s),
  formatearPrecio = (n) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n),
  escaparTexto = (s) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );

function mostrarMensaje(s) {
  $('#toast').textContent = s;
  $('#toast').classList.add('visible');
  clearTimeout(mostrarMensaje.timer);
  mostrarMensaje.timer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
}

function crearBoton(texto, destino, secundario = false, nombreAccesible = '') {
  return html`
    <a class="btn ${secundario ? 'secondary' : ''}" href="#${destino}"
      ${nombreAccesible ? `aria-label="${escaparTexto(nombreAccesible)}"` : ''}>${texto}</a>
  `;
}

function crearRuta(texto) {
  const niveles = texto.split(/\s+\/\s+/).map((nivel) => nivel.trim());
  return html`
    <nav class="crumb" aria-label="Migas de pan">
      <ol>
        <li><a href="#inicio">Inicio</a></li>
        ${niveles.map((nivel, indice) => html`
          <li>${indice === niveles.length - 1
            ? `<span aria-current="page">${nivel.replace(/<[^>]*>/g, '')}</span>`
            : nivel}</li>
        `).join('')}
      </ol>
    </nav>
  `;
}

function crearCampo(label, name, type = 'text', value = '', required = true) {
  const autocompletar = {
    name: 'given-name', surname: 'family-name', email: 'email', phone: 'tel',
    address: 'street-address', city: 'address-level2', province: 'address-level1',
  };
  const proposito = type === 'password'
    ? (authTab === 'register' ? 'new-password' : 'current-password')
    : (autocompletar[name] || 'off');
  const ayuda = type === 'password' ? 'Mínimo 6 caracteres.' : type === 'tel' ? '10 dígitos, sin letras ni espacios.' : '';
  let restricciones = '';
  if (type === 'email') restricciones = 'pattern="[^\\s@]+@[^\\s@]+[.][^\\s@]+"';
  if (type === 'tel') restricciones = 'pattern="[0-9]{10}" inputmode="numeric" minlength="10"';
  if (type === 'password') restricciones = 'minlength="6"';
  return html`
    <label>
      ${label}
      <input
        id="campo-${name}"
        name="${name}"
        type="${type}"
        value="${escaparTexto(value)}"
        ${required ? 'required' : ''}
        autocomplete="${proposito}"
        ${restricciones}
        ${ayuda ? `aria-describedby="campo-${name}-hint"` : ''}
        maxlength="${type === 'tel' ? 10 : type === 'password' ? 100 : 150}"
      />
      ${ayuda ? `<span id="campo-${name}-hint" class="field-hint">${ayuda}</span>` : ''}
    </label>
  `;
}
