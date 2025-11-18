// Scroll suau a una secció
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* CONFIGURADOR VISUAL */

// elements de color
const colorShellInput = document.getElementById("color-shell");
const colorSticksInput = document.getElementById("color-sticks");
const colorButtonsInput = document.getElementById("color-buttons");

// elements de preview
const previewShell = document.getElementById("preview-shell");
const previewStickLeft = document.getElementById("preview-stick-left");
const previewStickRight = document.getElementById("preview-stick-right");
const previewButtons = document.getElementById("preview-buttons");
const previewText = document.getElementById("preview-text");

// plataforma
const platformInputs = document.querySelectorAll('input[name="platform"]');

function updatePreview() {
  if (previewShell) {
    previewShell.style.backgroundColor = colorShellInput.value;
  }
  if (previewStickLeft && previewStickRight) {
    previewStickLeft.style.backgroundColor = colorSticksInput.value;
    previewStickRight.style.backgroundColor = colorSticksInput.value;
  }
  if (previewButtons) {
    previewButtons.style.backgroundColor = colorButtonsInput.value;
  }

  // text segons plataforma
  let platform = "Xbox";
  platformInputs.forEach((input) => {
    if (input.checked) platform = input.value;
  });

  let platformText = "Xbox";
  if (platform === "playstation") platformText = "PlayStation";
  if (platform === "pc") platformText = "PC";

  if (previewText) {
    previewText.innerHTML =
      'Model base per a <strong>' + platformText + "</strong> amb colors personalitzats.";
  }
}

// escoltar canvis
if (colorShellInput && colorSticksInput && colorButtonsInput) {
  colorShellInput.addEventListener("input", updatePreview);
  colorSticksInput.addEventListener("input", updatePreview);
  colorButtonsInput.addEventListener("input", updatePreview);
}
platformInputs.forEach((input) => input.addEventListener("change", updatePreview));

// valors per defecte
function resetColors() {
  colorShellInput.value = "#2b2bff";
  colorSticksInput.value = "#00ffb3";
  colorButtonsInput.value = "#ff4081";
  updatePreview();
}

// inicialitzar preview al carregar
document.addEventListener("DOMContentLoaded", updatePreview);

/* DIAGNÒSTIC DEMO */

function runDiagnostic() {
  const platform = document.getElementById("diag-platform").value;
  const model = document.getElementById("diag-model").value;
  const statusEl = document.getElementById("diag-status");
  const logEl = document.getElementById("diag-log");

  statusEl.textContent = "Executant diagnòstic...";

  const baseLines = [
    "[INFO] Connectant al mando via USB-C...",
    "[INFO] Plataforma: " + platform,
    "[INFO] Model: " + model,
    "[INFO] Llegint informació de joysticks...",
    "[INFO] Comprovant resposta de botons...",
    "[INFO] Analitzant triggers i firmware..."
  ];

  const results = [
    {
      title: "[OK] Cap error greu detectat.",
      detail:
        "[OK] Drift dins dels valors normals.\n[OK] Botons i triggers responen correctament.\n[OK] Firmware actualitzat."
    },
    {
      title: "[WARN] Drift lleu detectat al joystick esquerre.",
      detail:
        "[SUGGERIMENT] Recomanem calibració o canvi de mòdul.\n[INFO] Resta de botons i triggers en bon estat."
    },
    {
      title: "[WARN] Temps de resposta alt al botó principal.",
      detail:
        "[SUGGERIMENT] Neteja interna o substitució del botó recomanada.\n[INFO] Joysticks i triggers OK."
    }
  ];

  const result = results[Math.floor(Math.random() * results.length)];

  let text = "";
  baseLines.forEach((line) => {
    text += line + "\n";
  });
  text += "\n" + result.title + "\n" + result.detail;

  // Simulem un petit retard
  setTimeout(() => {
    logEl.textContent = text;
    statusEl.textContent = "Resultat: " + result.title.replace("[OK] ", "").replace("[WARN] ", "");
  }, 500);
}

/* BOTIGA: FILTRES */

function filterProducts(category) {
  const cards = document.querySelectorAll(".product-card");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector('.filter-btn[data-filter="' + category + '"]');
  if (activeBtn) activeBtn.classList.add("active");

  cards.forEach((card) => {
    const cat = card.getAttribute("data-category");
    if (category === "all" || cat === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

