const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow) cursorGlow.hidden = true;

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('portfolio-theme');
} catch (error) {
  savedTheme = null;
}

if (savedTheme === 'light') {
  body.classList.add('light-theme');
  if (themeIcon) themeIcon.textContent = '☾';
}

let scrollTicking = false;
let headerIsScrolled = false;

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;

  window.requestAnimationFrame(() => {
    const nextState = window.scrollY > 24;
    if (nextState !== headerIsScrolled) {
      header?.classList.toggle('scrolled', nextState);
      headerIsScrolled = nextState;
    }
    scrollTicking = false;
  });
}, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  const isLight = body.classList.contains('light-theme');
  if (themeIcon) themeIcon.textContent = isLight ? '☾' : '☼';
  try {
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  } catch (error) {
    // El almacenamiento local puede estar deshabilitado.
  }
});

const revealElements = [...document.querySelectorAll('.reveal')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pequeño escalonado únicamente entre elementos hermanos. El límite evita que
// una sección tarde demasiado en aparecer y mantiene el desplazamiento ligero.
revealElements.forEach((element) => {
  const siblings = [...(element.parentElement?.children || [])]
    .filter((child) => child.classList.contains('reveal'));
  const index = siblings.indexOf(element);
  if (index > 0) {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 135)}ms`);
  }
});

function showRevealElement(element) {
  window.requestAnimationFrame(() => {
    element.classList.add('visible');

    const finishReveal = () => {
      element.classList.add('reveal-done');
      element.removeEventListener('transitionend', finishReveal);
    };

    element.addEventListener('transitionend', finishReveal, { once: true });
    window.setTimeout(finishReveal, 750);
  });
}

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showRevealElement(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px'
  });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => {
    element.classList.add('visible', 'reveal-done');
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const visible = filter === 'all' || categories.includes(filter);
      card.classList.toggle('hidden', !visible);
    });
  });
});

const projects = {
  badgercore: {
    category: 'Plataforma empresarial y automatización',
    title: 'BadgerCore',
    description: 'Ecosistema interno para gestionar el ciclo comercial, operativo, documental y financiero de la empresa.',
    challenge: 'La información y los procesos estaban distribuidos entre personas, documentos y herramientas, dificultando el seguimiento y la toma de decisiones.',
    solution: 'Se construyó una plataforma modular con roles, CRM, RFQ, cotizaciones, proyectos, compras, CFDI, Carta Porte, finanzas, dashboards, PDF, correos, bots y procesos programados.',
    highlights: ['CRM y RFQ', 'Cotizaciones y proyectos', 'Compras y finanzas', 'CFDI y Carta Porte', 'Dashboards por área', 'Telegram y Bitrix24'],
    tags: ['PHP', 'MySQL', 'JavaScript', 'jQuery', 'Chart.js', 'FPDF']
  },
  cargohub: {
    category: 'Logística web y móvil',
    title: 'CargoHub',
    description: 'Aplicación publicada en Google Play para desplegar programas de carga a una comunidad cerrada de transportistas.',
    challenge: 'Las empresas necesitaban publicar cargas, coordinar transportistas y reducir llamadas, correos y confusiones durante la selección del flete.',
    solution: 'Se conectó el portal administrativo con una app donde transportistas autorizados consultan cargas, proponen precio cuando aplica y asignan conductor y vehículo.',
    highlights: ['Publicación en Google Play', 'Programas de carga', 'Comunidad autorizada', 'Asignación de unidad', 'Propuesta de precio', 'Integración con portal web'],
    tags: ['React Native', 'PHP', 'MySQL', 'REST API', 'Firebase']
  },
  conductores: {
    category: 'Aplicación móvil de operación',
    title: 'Conductores',
    description: 'Aplicación publicada en Google Play que centraliza el trabajo diario del conductor y la información de cada operación logística.',
    challenge: 'Documentación, evidencias, ubicación y comunicación se encontraban repartidas entre llamadas, mensajes y procesos administrativos.',
    solution: 'Se desarrolló una app Android con operaciones, GPS, evidencias, cámara, documentos, chat, gastos, odómetro y visualización de Carta Porte.',
    highlights: ['Publicación en Google Play', 'GPS y mapas', 'Evidencias y archivos', 'Carta Porte', 'Gastos y odómetro', 'Cámara y chat'],
    tags: ['React Native', 'Android', 'RNFS', 'File Viewer', 'PHP API']
  },
  mro: {
    category: 'Marketplace industrial',
    title: 'MRO',
    description: 'Catálogo para dar salida a herramientas, accesorios, refacciones y materiales disponibles o adquiridos por error.',
    challenge: 'El inventario disponible no tenía un canal claro para mostrarse, consultarse y reutilizarse comercialmente.',
    solution: 'Se diseñó una experiencia tipo marketplace que organiza productos, imágenes, información, solicitudes y disponibilidad.',
    highlights: ['Catálogo de productos', 'Inventario visible', 'Gestión de imágenes', 'Solicitudes', 'Diseño responsivo'],
    tags: ['React', 'Node.js', 'MySQL', 'JavaScript', 'UI/UX']
  },
  viajes: {
    category: 'Administración, pagos y contenido',
    title: 'Viajes',
    description: 'Sistema administrativo para controlar viajes, pasajeros, pagos, documentos y contenido visual.',
    challenge: 'Reservaciones, abonos y saldos requerían mayor claridad y una vista consolidada para administración y clientes.',
    solution: 'Se integraron registros, filtros, totales, comprobantes, PDF, viajes individuales y galería global.',
    highlights: ['Control de abonos', 'Saldos y totales', 'Viajes individuales', 'PDF', 'Galería', 'Clientes'],
    tags: ['PHP', 'MySQL', 'JavaScript', 'FPDF', 'Uploads']
  },
  badgertrack: {
    category: 'Mantenimiento web y móvil',
    title: 'BadgerTrack',
    description: 'Herramienta para conectar máquinas, órdenes de trabajo, servicios, pendientes y evidencias técnicas.',
    challenge: 'El seguimiento de equipos y servicios necesitaba una experiencia rápida para personal técnico y administrativo.',
    solution: 'Se desarrolló una solución móvil y backend con QR, máquinas, órdenes de trabajo, evidencias, documentos, PDF y filtros por cliente u objeto.',
    highlights: ['Órdenes de trabajo', 'Códigos QR', 'Máquinas y objetos', 'Evidencias', 'Servicios', 'Pendientes'],
    tags: ['React Native', 'PHP', 'MySQL', 'QR Code', 'PDF']
  },
  iot: {
    category: 'IoT industrial y monitoreo móvil',
    title: 'Monitoreo IoT industrial',
    description: 'Ecosistema para conectar sensores de maquinaria con una app nativa, servicios backend y Telegram.',
    challenge: 'Las variables de máquina debían consultarse sin estar físicamente frente al equipo y las desviaciones críticas requerían avisos inmediatos.',
    solution: 'Se integraron gateways, sensores, autenticación por API key, histórico, heartbeat, monitoreo en tiempo real, app Android y alertas por Telegram.',
    highlights: ['Sensores y gateways', 'Valores en tiempo real', 'Alertas por Telegram', 'App Android nativa', 'Histórico de mediciones', 'Monitoreo de conexión'],
    tags: ['IoT', 'Android', 'Python', 'PHP', 'REST API', 'Telegram Bot']
  },
  faurecia: {
    category: 'Calidad industrial · FORVIA / Faurecia',
    title: 'Respaldo digital de piezas OK / NOK',
    description: 'Sistema industrial para registrar la clasificación de piezas, conservar evidencia y mostrar resultados al proveedor mediante una interfaz web.',
    challenge: 'La comunicación de resultados de calidad necesitaba un respaldo centralizado y consultable para evitar pérdida de información y ambigüedad con proveedores.',
    solution: 'Se implementó un flujo que registra la pieza, su resultado OK o NOK, el respaldo asociado y una vista de consulta para el proveedor.',
    highlights: ['Clasificación OK / NOK', 'Respaldo por pieza', 'Interfaz para proveedor', 'Historial consultable', 'Trazabilidad de calidad'],
    tags: ['PHP', 'MySQL', 'Web', 'Calidad', 'Trazabilidad']
  },
  draxlmaier: {
    category: 'Trazabilidad industrial · DRÄXLMAIER',
    title: 'Código único y etiquetas de trazabilidad',
    description: 'Sistema donde cada pieza recibe un identificador único y una etiqueta para rastrear su origen y datos de fabricación.',
    challenge: 'Cada pieza debía identificarse de forma consistente y conservar información sobre dónde y cómo fue fabricada.',
    solution: 'Un servicio en Python genera códigos QR y etiquetas ZPL para impresoras Zebra, registra la información de la pieza y conserva una cola de reintentos ante fallos de impresión.',
    highlights: ['Código único por pieza', 'Generación QR', 'Etiquetas ZPL', 'Impresión Zebra', 'Datos de fabricación', 'Cola de reintentos'],
    tags: ['Python', 'QR', 'ZPL', 'Zebra', 'Trazabilidad']
  }
};

const modal = document.getElementById('project-modal');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalChallenge = document.getElementById('modal-challenge');
const modalSolution = document.getElementById('modal-solution');
const modalHighlights = document.getElementById('modal-highlights');
const modalTags = document.getElementById('modal-tags');

function openModal(projectId) {
  const project = projects[projectId];
  if (!project) return;
  modalCategory.textContent = project.category;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalChallenge.textContent = project.challenge;
  modalSolution.textContent = project.solution;
  modalHighlights.innerHTML = project.highlights.map((item) => `<span>✓ ${item}</span>`).join('');
  modalTags.innerHTML = project.tags.map((item) => `<span>${item}</span>`).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('modal-open');
}

document.querySelectorAll('[data-modal]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.modal)));
document.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));
window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

