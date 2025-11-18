// --- NAVBAR MOBILE ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// --- CONFIGURADOR VISUAL (pàgina configurador) ---
const shellInput = document.getElementById('color-shell');
const sticksInput = document.getElementById('color-sticks');
const buttonsInput = document.getElementById('color-buttons');

const shellPreview = document.getElementById('preview-shell');
const leftStickPreview = document.getElementById('preview-stick-left');
const rightStickPreview = document.getElementById('preview-stick-right');
const buttonsPreview = document.getElementById('preview-buttons');
const platformRadios = document.querySelectorAll('input[name="platform"]');
const previewText = document.getElementById('preview-text');

function updateConfiguratorPreview() {
  if (shellPreview && shellInput) {
    shellPreview.style.backgroundColor = shellInput.value;
  }
  if (leftStickPreview && rightStickPreview && sticksInput) {
    leftStickPreview.style.backgroundColor = sticksInput.value;
    rightStickPreview.style.backgroundColor = sticksInput.value;
  }
  if (buttonsPreview && buttonsInput) {
    buttonsPreview.style.backgroundColor = buttonsInput.value;
  }

  if (previewText && platformRadios.length) {
    let platform = 'Xbox';
    platformRadios.forEach((r) => {
      if (r.checked) platform = r.value;
    });
    let label = 'Xbox';
    if (platform === 'playstation') label = 'PlayStation';
    if (platform === 'pc') label = 'PC';
    previewText.innerHTML =
      'Model base per a <strong>' + label + '</strong> amb configuració neon personalitzada.';
  }
}

if (shellInput && sticksInput && buttonsInput) {
  shellInput.addEventListener('input', updateConfiguratorPreview);
  sticksInput.addEventListener('input', updateConfiguratorPreview);
  buttonsInput.addEventListener('input', updateConfiguratorPreview);
}
if (platformRadios.length) {
  platformRadios.forEach((r) => r.addEventListener('change', updateConfiguratorPreview));
}

window.addEventListener('DOMContentLoaded', () => {
  updateConfiguratorPreview();
});

// Botó reiniciar colors
const resetBtn = document.getElementById('reset-colors');
if (resetBtn && shellInput && sticksInput && buttonsInput) {
  resetBtn.addEventListener('click', () => {
    shellInput.value = '#7f5bff';
    sticksInput.value = '#4cffd7';
    buttonsInput.value = '#ff4fbf';
    updateConfiguratorPreview();
  });
}

// --- DIAGNÒSTIC DEMO (pàgina diagnostic) ---
function runDiagnostic() {
  const platformSel = document.getElementById('diag-platform');
  const modelSel = document.getElementById('diag-model');
  const statusEl = document.getElementById('diag-status');
  const logEl = document.getElementById('diag-log');
  const btn = document.getElementById('diag-btn');

  if (!platformSel || !modelSel || !statusEl || !logEl || !btn) return;

  const platform = platformSel.value;
  const model = modelSel.value;

  statusEl.textContent = 'Escanejant el mando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  const baseLines = [
    '[INFO] Connectant al mando via USB-C...',
    '[INFO] Plataforma: ' + platform,
    '[INFO] Model: ' + model,
    '[INFO] Llegint sensors de joysticks...',
    '[INFO] Comprovant resposta de botons...',
    '[INFO] Verificant triggers i vibració...',
    '[INFO] Analitzant firmware i latència...'
  ];

  const scenarios = [
    {
      title: '[OK] Cap error greu detectat.',
      detail:
        '[OK] Drift dins dels valors normals.\n[OK] Tots els botons responen correctament.\n[OK] Firmware actualitzat.'
    },
    {
      title: '[WARN] Drift lleu al joystick esquerre.',
      detail:
        '[SUGGERIMENT] Recomanem calibració o canvi de mòdul.\n[INFO] Resta de components en bon estat.'
    },
    {
      title: '[WARN] Retard detectat al botó principal.',
      detail:
        '[SUGGERIMENT] Possible brutícia o desgast.\n[INFO] Considera substituir el botó per un recanvi oficial.'
    },
    {
      title: '[OK] Rendiment òptim per a joc competitiu.',
      detail:
        '[OK] Latència baixa i senyal estable.\n[OK] Preparat per sessions d’eSports.'
    }
  ];

  const result = scenarios[Math.floor(Math.random() * scenarios.length)];

  logEl.textContent = '';
  let i = 0;

  function appendLine() {
    if (i < baseLines.length) {
      logEl.textContent += baseLines[i] + '\n';
      i++;
      setTimeout(appendLine, 230);
    } else {
      logEl.textContent += '\n' + result.title + '\n' + result.detail;
      statusEl.textContent = result.title.replace('[OK] ', '').replace('[WARN] ', '');
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }

  appendLine();
}

// --- BOTIGA: FILTRAT DE PRODUCTES ---
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  const chips = document.querySelectorAll('.chip');

  chips.forEach((chip) => chip.classList.remove('active'));
  const active = document.querySelector('.chip[data-filter="' + category + '"]');
  if (active) active.classList.add('active');

  cards.forEach((card) => {
    const cat = card.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- CARRUSEL GENERIC (home / botiga) ---
document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const items = carousel.querySelectorAll('.carousel-item');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');

  if (!track || items.length === 0) return;

  let index = 0;

  function update() {
    track.style.transform = 'translateX(' + -index * 100 + '%)';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + items.length) % items.length;
      update();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % items.length;
      update();
    });
  }
});

// Expose diagnostic to HTML on diagnostic page
window.runDiagnostic = runDiagnostic;
window.filterProducts = filterProducts;
