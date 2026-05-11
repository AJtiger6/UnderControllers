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

// --- LOGIN / REGISTRE GLOBAL DEMO ---
const openLoginBtn = document.getElementById('open-login');

const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');

const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');

const openRegisterBtn = document.getElementById('open-register');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

function getUsers() {
  const raw = localStorage.getItem('uc_users');
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem('uc_users', JSON.stringify(users));
}

function getCurrentUser() {
  const raw = localStorage.getItem('uc_user');
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('uc_user', JSON.stringify(user));
}

function renderLoginButton() {
  const user = getCurrentUser();

  if (!openLoginBtn) return;

  if (user) {
    openLoginBtn.textContent = user.name;
    openLoginBtn.classList.add('logged');
  } else {
    openLoginBtn.textContent = 'Login';
    openLoginBtn.classList.remove('logged');
  }
}

if (openLoginBtn && loginModal) {
  openLoginBtn.addEventListener('click', () => {
    const user = getCurrentUser();

    if (user) {
      const logout = confirm('Vols tancar sessió?');
      if (logout) {
        localStorage.removeItem('uc_user');
        renderLoginButton();
        window.location.reload();
      }
      return;
    }

    loginModal.classList.add('open');
  });
}

if (closeLoginBtn) {
  closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('open');
  });
}

if (closeRegisterBtn) {
  closeRegisterBtn.addEventListener('click', () => {
    registerModal.classList.remove('open');
  });
}

if (openRegisterBtn) {
  openRegisterBtn.addEventListener('click', () => {
    loginModal.classList.remove('open');
    registerModal.classList.add('open');
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    const users = getUsers();

    const exists = users.some(user => user.email === email || user.name === name);

    if (exists) {
      alert('Aquest usuari o email ja existeix.');
      return;
    }

    const newUser = { name, email, password };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser({ name, email });

    registerModal.classList.remove('open');
    renderLoginButton();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userOrEmail = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const users = getUsers();

    const foundUser = users.find(user =>
      (user.email === userOrEmail || user.name === userOrEmail) &&
      user.password === password
    );

    if (!foundUser) {
      alert('Usuari o contrasenya incorrectes.');
      return;
    }

    setCurrentUser({
      name: foundUser.name,
      email: foundUser.email
    });

    loginModal.classList.remove('open');
    renderLoginButton();
  });
}

renderLoginButton();

// ========================================= //
// --- END OF SCRIPT.JS / START OF 2SCRIPT.JS --- //
// ========================================= //

/* NAVBAR MOBILE REPETIDO ELIMINADO PARA EVITAR ERRORES */

// --- CONFIGURADOR VISUAL NEON (CORREGIDO) ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Capturamos los inputs de color del HTML
  const colorShell = document.getElementById('color-shell');
  const colorSticks = document.getElementById('color-sticks');
  const colorButtons = document.getElementById('color-buttons');
  const btnReset = document.getElementById('reset-colors');

  // 2. Capturamos las partes del nuevo SVG
  const svgShell = document.getElementById('svg-shell-color');
  const svgSticksNeon = document.querySelectorAll('.svg-stick-neon');
  const svgBtnsNeon = document.querySelectorAll('.svg-btn-neon');

  // Solo ejecutar si estamos en la página del configurador
  if (colorShell && svgShell) {
    
    // Cambiar Carcasa (Relleno base)
    colorShell.addEventListener('input', (e) => {
      svgShell.style.fill = e.target.value;
    });

    // Cambiar Aros de Joysticks (Borde neon)
    colorSticks.addEventListener('input', (e) => {
      svgSticksNeon.forEach(aro => {
        aro.style.stroke = e.target.value;
      });
    });

    // Cambiar Letras de los botones (Relleno neon)
    colorButtons.addEventListener('input', (e) => {
      svgBtnsNeon.forEach(letra => {
        letra.style.fill = e.target.value;
      });
    });

    // Botón de reiniciar
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const defaultShell = '#7f5bff';
        const defaultSticks = '#4cffd7';
        const defaultBtns = '#ff4fbf';

        colorShell.value = defaultShell;
        colorSticks.value = defaultSticks;
        colorButtons.value = defaultBtns;

        svgShell.style.fill = defaultShell;
        svgSticksNeon.forEach(aro => aro.style.stroke = defaultSticks);
        svgBtnsNeon.forEach(letra => letra.style.fill = defaultBtns);
      });
    }
  }
});

// --- FUNCIÓN PARA ENVIAR DATOS A PHP ---
async function enviarABaseDeDatos(datos) {
  try {
    const respuesta = await fetch('guardar_diagnostico.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    
    const resultado = await respuesta.json();
    console.log("Respuesta del servidor:", resultado.message);
    
    const logEl = document.getElementById('diag-log');
    if (logEl) {
      logEl.textContent += `\n[SISTEMA] Registro guardado en BD (ID: ${resultado.id_registro})`;
    }
  } catch (error) {
    console.error("Error al conectar con PHP:", error);
  }
}

// --- DIAGNÒSTIC DEMO (SIMULACIÓN FORMULARIO) ---
function runDiagnostic() {
  const platformSel = document.getElementById('diag-platform');
  const modelSel = document.getElementById('diag-model');
  const serialInp = document.getElementById('diag-serial');
  const statusEl = document.getElementById('diag-status');
  const logEl = document.getElementById('diag-log');
  const btn = document.getElementById('diag-btn');

  if (!platformSel || !modelSel || !statusEl || !logEl || !btn) return;

  const platform = platformSel.value;
  const model = modelSel.value;
  const serial = serialInp.value || "N/A";

  statusEl.textContent = 'Escanejant el mando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  const baseLines = [
    '[INFO] Connectant al mando via USB-C...',
    '[INFO] Plataforma: ' + platform,
    '[INFO] Model: ' + model,
    '[INFO] Número de sèrie: ' + serial,
    '[INFO] Llegint sensors de joysticks...',
    '[INFO] Comprovant resposta de botons...'
  ];

  const scenarios = [
    { title: '[OK] Cap error detectat.', detail: 'Drift normal y firmware actualizado.' },
    { title: '[WARN] Drift detectat.', detail: 'Joystick esquerre con valores fuera de rango.' }
  ];

  const result = scenarios[Math.floor(Math.random() * scenarios.length)];
  logEl.textContent = '';
  let i = 0;

  function appendLine() {
    if (i < baseLines.length) {
      logEl.textContent += baseLines[i] + '\n';
      i++;
      setTimeout(appendLine, 200);
    } else {
      logEl.textContent += '\n' + result.title + '\n' + result.detail;
      statusEl.textContent = 'Diagnòstic finalitzat.';
      btn.disabled = false;
      btn.style.opacity = '1';

      enviarABaseDeDatos({
        plataforma: platform,
        modelo: model,
        serie: serial,
        resultado: result.title + " " + result.detail
      });
    }
  }
  appendLine();
}

window.runDiagnostic = runDiagnostic;

// --- LÓGICA DE GAMEPAD API (LECTURA DEL MANDO REAL EN DIAGNÓSTICO) ---
let activeGamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
  activeGamepadIndex = e.gamepad.index;
  
  const nameEl = document.getElementById('test-info');
  if(nameEl) nameEl.textContent = "MANDO DETECTADO: " + e.gamepad.id.split('(')[0];
  
  logLiveEvent(`[SISTEMA] Mando detectado: ${e.gamepad.id}`);
  
  // Iniciar el bucle visual
  requestAnimationFrame(updateDashboard);
});

window.addEventListener("gamepaddisconnected", () => {
  activeGamepadIndex = null;
  const nameEl = document.getElementById('test-info');
  if(nameEl) nameEl.textContent = "Mando desconectado";
  logLiveEvent(`[SISTEMA] Conexión perdida.`);
});

function logLiveEvent(msg) {
  const log = document.getElementById('realtime-log');
  if(log) {
    log.innerHTML += `<div>> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
  }
}

function updateDashboard() {
  if (activeGamepadIndex === null) return;
  const gp = navigator.getGamepads()[activeGamepadIndex];
  if (!gp) return;

  // 1. Textos numéricos de los ejes (Ejes 0 y 1 para stick izq, 2 y 3 para stick der)
  const lxEl = document.getElementById('val-lx');
  const lyEl = document.getElementById('val-ly');
  const rxEl = document.getElementById('val-rx');
  const ryEl = document.getElementById('val-ry');
  
  if(lxEl) lxEl.textContent = gp.axes[0].toFixed(2);
  if(lyEl) lyEl.textContent = gp.axes[1].toFixed(2);
  if(rxEl) rxEl.textContent = gp.axes[2].toFixed(2);
  if(ryEl) ryEl.textContent = gp.axes[3].toFixed(2);

  // 2. Mover círculos de los joysticks en el SVG
  const stickL = document.getElementById('stick-l');
  const stickR = document.getElementById('stick-r');
  
  if (stickL) {
    // Translación basada en el diseño del diagnóstico (centro 180, 150 approx)
    stickL.style.transform = `translate(${gp.axes[0] * 20}px, ${gp.axes[1] * 20}px)`;
  }
  if (stickR) {
    stickR.style.transform = `translate(${gp.axes[2] * 20}px, ${gp.axes[3] * 20}px)`;
  }

  // 3. Detectar pulsación de botones e iluminarlos en el SVG
  gp.buttons.forEach((btn, i) => {
    const node = document.getElementById(`btn-${i}`);
    if (node) {
      if (btn.pressed) {
        node.style.fill = "var(--accent-pink)";
        node.style.filter = "drop-shadow(0 0 5px var(--accent-pink))";
      } else {
        // Regresa al color base (gris oscuro o negro según el SVG)
        node.style.fill = "#111"; 
        node.style.filter = "none";
      }
    }
  });

  // 4. Triggers (L2 y R2 suelen ser los botones 6 y 7)
  const barL = document.getElementById('bar-l');
  const barR = document.getElementById('bar-r');
  if (barL && gp.buttons[6]) barL.style.width = (gp.buttons[6].value * 100) + "%";
  if (barR && gp.buttons[7]) barR.style.width = (gp.buttons[7].value * 100) + "%";

  requestAnimationFrame(updateDashboard);
}

// ==========================================
// --- SISTEMA DE LOGIN I REGISTRE (DB) ---
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. GESTIÓ DE L'OBERTURA I TANCAMENT DE LES FINESTRES (MODALS)
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  
  const openLoginBtn = document.getElementById('open-login');
  const openRegisterBtn = document.getElementById('open-register');
  
  const closeLoginBtn = document.getElementById('close-login');
  const closeRegisterBtn = document.getElementById('close-register');

  // Obrir finestra de Login des del menú
  if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.add('open');
      if (registerModal) registerModal.classList.remove('open');
    });
  }

  // Obrir finestra de Registre (des de l'enllaç "No tens compte?")
  if (openRegisterBtn && registerModal) {
    openRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.classList.add('open');
      if (loginModal) loginModal.classList.remove('open');
    });
  }

  // Tancar finestres amb la "X"
  if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('open'));
  if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => registerModal.classList.remove('open'));


  // 2. ENVIAR DADES DE REGISTRE A LA BASE DE DADES
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita que la pàgina es recarregui

      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();

      try {
        const resposta = await fetch('registro.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await resposta.json();

        if (data.success) {
          alert("Compte creat correctament! Ara pots iniciar sessió.");
          // Tanquem registre i obrim login perquè entri
          registerForm.reset();
          registerModal.classList.remove('open');
          loginModal.classList.add('open');
        } else {
          alert(data.message); // Ex: "L'usuari ja existeix"
        }
      } catch (error) {
        console.error("Error connectant amb PHP:", error);
        alert("Hi ha hagut un problema de connexió amb el servidor.");
      }
    });
  }


  // 3. COMPROVAR LOGIN A LA BASE DE DADES
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userOrEmail = document.getElementById('login-user').value.trim();
      const password = document.getElementById('login-password').value.trim();

      try {
        const resposta = await fetch('login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: userOrEmail, password })
        });
        
        const data = await resposta.json();

        if (data.success) {
          alert("Benvingut/da, " + data.user.name + "!");
          loginModal.classList.remove('open');
          loginForm.reset();
          
          // Canviar el text del botó de Login del menú pel nom de l'usuari
          if (openLoginBtn) {
            openLoginBtn.textContent = data.user.name;
            openLoginBtn.classList.add('logged'); // Per si vols posar-li un color especial al CSS
          }
        } else {
          alert(data.message); // Ex: "Usuari o contrasenya incorrectes"
        }
      } catch (error) {
        console.error("Error connectant amb PHP:", error);
        alert("Hi ha hagut un problema de connexió amb el servidor.");
      }
    });
  }
});

// --- FUNCIONES DE SESIÓN PERSISTENTE ---
function setCurrentUser(user) {
  if (user) localStorage.setItem('uc_currentUser', JSON.stringify(user));
  else localStorage.removeItem('uc_currentUser');
  applyAuthUI(); // Actualizar la interfaz al momento
}

function getCurrentUser() {
  const userStr = localStorage.getItem('uc_currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Esta función es la que hace la magia de ocultar/mostrar cosas
function applyAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('open-login');
  const forumPrompt = document.getElementById('forum-login-prompt');
  const forumContent = document.getElementById('forum-content');

  if (user) {
    // Si hay usuario: cambiamos el botón del menú por su nombre
    if (loginBtn) {
      loginBtn.textContent = user.name;
      loginBtn.classList.add('logged');
    }
    // En el fórum: mostramos contenido y ocultamos el aviso de login
    if (forumPrompt) forumPrompt.style.display = 'none';
    if (forumContent) forumContent.style.display = 'block';
  } else {
    // Si no hay usuario: botón normal y fórum bloqueado
    if (loginBtn) {
      loginBtn.textContent = 'Login';
      loginBtn.classList.remove('logged');
    }
    if (forumPrompt) forumPrompt.style.display = 'block';
    if (forumContent) forumContent.style.display = 'none';
  }
}

// --- EJECUTAR AL CARGAR CUALQUIER PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
  applyAuthUI();
});

// --- DENTRO DE TU EVENTO DE LOGIN (FETCH) ---
// Busca donde recibes el "data.success" en el login y asegúrate de guardar al usuario:
if (data.success) {
  alert("Benvingut/da, " + data.user.name + "!");
  setCurrentUser(data.user); // <--- ESTO ES LO QUE GUARDA LA SESIÓN
  document.getElementById('login-modal').classList.remove('open');
}

function applyAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('open-login');
  
  // Els nous IDs que has posat al teu HTML "currat"
  const forumLocked = document.getElementById('forum-locked');
  const forumContent = document.getElementById('forum-content');

  if (user) {
    if (loginBtn) loginBtn.textContent = user.name;
    
    // Si hi ha usuari: amaguem el bloqueig i mostrem el fòrum
    if (forumLocked) forumLocked.style.display = 'none';
    if (forumContent) {
        forumContent.style.display = 'block';
        forumContent.removeAttribute('hidden'); // Per si l'HTML té l'atribut 'hidden'
    }
  } else {
    if (loginBtn) loginBtn.textContent = 'Login';
    
    // Si no hi ha usuari: mostrem el bloqueig i amaguem el fòrum
    if (forumLocked) forumLocked.style.display = 'block';
    if (forumContent) forumContent.style.display = 'none';
  }
}

// ==========================================
// --- LÒGICA DEL FÒRUM (NOU CODI AFEGIT) ---
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. OBRIR I TANCAR EL MODAL DE CREAR TEMA
  const createModal = document.getElementById('create-post-modal');
  const btnOpenCreate = document.getElementById('btn-open-create-post');
  const btnCloseCreate = document.getElementById('close-create-post');
  const btnCancelPost = document.getElementById('btn-cancel-post');
  const postForm = document.getElementById('forum-post-form');

  if (btnOpenCreate) {
    btnOpenCreate.addEventListener('click', () => {
      if (createModal) createModal.classList.add('open');
    });
  }

  const closeCreateModal = () => {
    if (createModal) createModal.classList.remove('open');
  };

  if (btnCloseCreate) btnCloseCreate.addEventListener('click', closeCreateModal);
  if (btnCancelPost) btnCancelPost.addEventListener('click', closeCreateModal);

  // 2. ENVIAR NOU TEMA A LA BASE DE DADES
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Llegim l'usuari actual directament de la memòria
      const userStr = localStorage.getItem('uc_currentUser');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        alert("Has d'estar loguejat per publicar.");
        return;
      }

      const titulo = document.getElementById('post-title').value.trim();
      const categoria = document.getElementById('post-category').value.trim();
      const mensaje = document.getElementById('post-body').value.trim();

      try {
        const res = await fetch('publicar_post.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            autor: user.name, 
            titulo: titulo, 
            categoria: categoria, 
            mensaje: mensaje 
          })
        });
        const data = await res.json();
        
        if (data.success) {
          closeCreateModal();
          postForm.reset();
          cargarPosts(); // Recarregar la llista a l'instant
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Error enviant el post:", err);
        alert("Error de connexió al publicar el tema.");
      }
    });
  }

  // 3. CARREGAR ELS TEMES NOMÉS ENTRAR
  if (document.getElementById('forum-list')) {
    cargarPosts();
  }
});

// 4. FUNCIÓ PER OBTENIR I PINTAR ELS TEMES EN NEON
async function cargarPosts() {
  const list = document.getElementById('forum-list');
  if (!list) return;

  try {
    const res = await fetch('obtener_posts.php');
    const data = await res.json();
    
    if (data.success) {
      if (data.posts.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">Encara no hi ha cap tema. Sigues el primer en publicar!</p>';
        return;
      }

      list.innerHTML = data.posts.map(post => {
        // Format de data neta i visual
        const dataNeta = new Date(post.fecha).toLocaleDateString('ca-ES', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
        });
        
        return `
        <div class="card" style="margin-bottom: 20px; padding: 20px; border-left: 4px solid var(--accent-violet);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border-subtle); padding-bottom:10px;">
            <span style="background: rgba(76, 255, 215, 0.1); color: var(--accent-cyan); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">
              ${post.categoria}
            </span>
            <span style="color:var(--text-muted); font-size:0.8rem;">
              👤 <strong style="color:var(--text-main);">${post.autor}</strong> &nbsp;·&nbsp; 🕒 ${dataNeta}
            </span>
          </div>
          <h4 style="font-size:1.2rem; color:var(--text-main); margin-bottom:10px;">${post.titulo}</h4>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.5; white-space:pre-wrap;">${post.mensaje}</p>
        </div>
        `;
      }).join('');
    } else {
      list.innerHTML = `<p style="color:red; text-align:center;">Error carregant temes: ${data.message}</p>`;
    }
  } catch (err) {
    console.error("Error obtenint posts:", err);
  }
}

// --- LÒGICA ESPECÍFICA DEL FÒRUM ---
document.addEventListener('DOMContentLoaded', () => {
  const forumPostForm = document.getElementById('forum-post-form');
  const createModal = document.getElementById('create-post-modal');

  // 1. Enviar nou tema
  if (forumPostForm) {
    forumPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const user = getCurrentUser(); // Agafa l'usuari loguejat de localStorage
      if (!user) {
        alert("Has d'iniciar sessió per publicar.");
        return;
      }

      const datos = {
        autor: user.name,
        titulo: document.getElementById('post-title').value.trim(),
        categoria: document.getElementById('post-category').value,
        mensaje: document.getElementById('post-body').value.trim()
      };

      try {
        const res = await fetch('publicar_post.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const result = await res.json();

        if (result.success) {
          createModal.classList.remove('open');
          forumPostForm.reset();
          cargarPosts(); // Recarrega la llista de temes
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
        alert("Error de connexió al publicar.");
      }
    });
  }

  // 2. Carregar posts automàticament si estem al fòrum
  if (document.getElementById('forum-list')) {
    cargarPosts();
  }
});

// Funció per carregar els posts des de la DB
async function cargarPosts() {
  const list = document.getElementById('forum-list');
  if (!list) return;

  try {
    const res = await fetch('obtener_posts.php');
    const data = await res.json();

    if (data.success) {
      if (data.posts.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">Encara no hi ha cap tema.</p>';
        return;
      }

      list.innerHTML = data.posts.map(post => `
        <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--accent-violet);">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:10px; border-bottom:1px solid var(--border-subtle); padding-bottom:8px;">
            <span style="color:var(--accent-cyan); font-weight:bold;">${post.categoria}</span>
            <span style="color:var(--text-muted)">👤 ${post.autor}</span>
          </div>
          <h4 style="color:white; margin-bottom:8px;">${post.titulo}</h4>
          <p style="color:var(--text-muted); font-size:0.9rem; white-space:pre-wrap;">${post.mensaje}</p>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error("Error al carregar fòrum:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const forumPostForm = document.getElementById('forum-post-form');

  if (forumPostForm) {
    forumPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userStr = localStorage.getItem('uc_currentUser');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        alert("Sessió no trobada. Torna a iniciar sessió.");
        return;
      }

      const datos = {
        autor: user.name,
        titulo: document.getElementById('post-title').value.trim(),
        categoria: document.getElementById('post-category').value,
        mensaje: document.getElementById('post-body').value.trim()
      };

      console.log("Enviant dades:", datos); // Revisa això a la consola (F12)

      try {
        const res = await fetch('publicar_post.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });

        // Llegim la resposta com a text primer per si no és un JSON vàlid
        const rawResponse = await res.text();
        console.log("Resposta bruta del servidor:", rawResponse);

        const result = JSON.parse(rawResponse);

        if (result.success) {
          document.getElementById('create-post-modal').classList.remove('open');
          forumPostForm.reset();
          cargarPosts(); 
        } else {
          alert("Error del servidor: " + result.message);
        }
      } catch (err) {
        console.error("Error crític:", err);
        alert("No s'ha pogut connectar amb publicar_post.php. Revisa la consola.");
      }
    });
  }
});