// ==========================================
// 1. GESTIÓ DE SESSIÓ I NAVBAR
// ==========================================

// Funció per guardar l'usuari al navegador
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('uc_currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('uc_currentUser');
  }
  applyAuthUI(); // Actualitza la interfície al moment
}

// Funció per recuperar l'usuari actual
function getCurrentUser() {
  const userStr = localStorage.getItem('uc_currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Funció per aplicar canvis visuals segons si hi ha sessió o no
function applyAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('open-login');
  const forumLocked = document.getElementById('forum-locked');
  const forumContent = document.getElementById('forum-content');

  if (user) {
    // Si està loguejat
    if (loginBtn) {
      loginBtn.textContent = user.name;
      loginBtn.classList.add('logged');
    }
    // Si som al fòrum, desbloquegem contingut
    if (forumLocked) forumLocked.style.display = 'none';
    if (forumContent) {
      forumContent.style.display = 'block';
      forumContent.removeAttribute('hidden');
      if (typeof cargarPosts === 'function') cargarPosts();
    }
  } else {
    // Si NO està loguejat
    if (loginBtn) {
      loginBtn.textContent = 'Login';
      loginBtn.classList.remove('logged');
    }
    if (forumLocked) forumLocked.style.display = 'block';
    if (forumContent) forumContent.style.display = 'none';
  }
}

// Menú mòbil
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ==========================================
// 2. CONFIGURADOR VISUAL NEON (SVG)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const colorShell = document.getElementById('color-shell');
  const colorSticks = document.getElementById('color-sticks');
  const colorButtons = document.getElementById('color-buttons');
  const btnReset = document.getElementById('reset-colors');

  const svgShell = document.getElementById('svg-shell-color');
  const svgSticksNeon = document.querySelectorAll('.svg-stick-neon');
  const svgBtnsNeon = document.querySelectorAll('.svg-btn-neon');

  if (colorShell && svgShell) {
    colorShell.addEventListener('input', (e) => {
      svgShell.style.fill = e.target.value;
    });

    colorSticks.addEventListener('input', (e) => {
      svgSticksNeon.forEach(aro => aro.style.stroke = e.target.value);
    });

    colorButtons.addEventListener('input', (e) => {
      svgBtnsNeon.forEach(letra => letra.style.fill = e.target.value);
    });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const dShell = '#7f5bff', dSticks = '#4cffd7', dBtns = '#ff4fbf';
        svgShell.style.fill = dShell;
        svgSticksNeon.forEach(aro => aro.style.stroke = dSticks);
        svgBtnsNeon.forEach(letra => letra.style.fill = dBtns);
      });
    }
  }
});

// ==========================================
// 3. LOGIN I REGISTRE (PHP + DB)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  applyAuthUI(); // Comprovar sessió en carregar la pàgina

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const openLoginBtn = document.getElementById('open-login');

  // Gestió del botó Login del menú (Obrir o fer Logout)
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (getCurrentUser()) {
        if (confirm("Vols tancar la sessió?")) {
          setCurrentUser(null);
          location.reload();
        }
      } else {
        document.getElementById('login-modal')?.classList.add('open');
      }
    });
  }

  // Tancar modals (Login i Registre)
  document.getElementById('close-login')?.addEventListener('click', () => {
    document.getElementById('login-modal').classList.remove('open');
  });
  document.getElementById('close-register')?.addEventListener('click', () => {
    document.getElementById('register-modal').classList.remove('open');
  });

  // Enviar formulari de registre
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const datos = {
        name: document.getElementById('register-name').value.trim(),
        email: document.getElementById('register-email').value.trim(),
        password: document.getElementById('register-password').value.trim()
      };

      try {
        const res = await fetch('registro.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const data = await res.json();
        if (data.success) {
          alert("Compte creat! Inicia sessió.");
          document.getElementById('register-modal').classList.remove('open');
          document.getElementById('login-modal').classList.add('open');
        } else {
          alert(data.message);
        }
      } catch (err) { alert("Error de connexió al servidor."); }
    });
  }

  // Enviar formulari de Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const datos = {
        user: document.getElementById('login-user').value.trim(),
        password: document.getElementById('login-password').value.trim()
      };

      try {
        const res = await fetch('login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const data = await res.json();
        if (data.success) {
          alert("Benvingut/da, " + data.user.name);
          setCurrentUser(data.user);
          document.getElementById('login-modal').classList.remove('open');
        } else {
          alert(data.message);
        }
      } catch (err) { alert("Error de connexió."); }
    });
  }
});

// ==========================================
// 4. LÒGICA DEL FÒRUM (POSTS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('forum-post-form');
  
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = getCurrentUser();
      if (!user) return alert("Inicia sessió.");

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
        const data = await res.json();
        if (data.success) {
          document.getElementById('create-post-modal').classList.remove('open');
          postForm.reset();
          cargarPosts();
        } else { alert(data.message); }
      } catch (err) { alert("Error al publicar."); }
    });
  }

  if (document.getElementById('forum-list')) {
    cargarPosts();
  }
});

async function cargarPosts() {
  const list = document.getElementById('forum-list');
  if (!list) return;

  try {
    const res = await fetch('obtener_posts.php');
    const data = await res.json();
    if (data.success) {
      list.innerHTML = data.posts.map(post => `
        <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--accent-violet);">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:10px; border-bottom:1px solid var(--border-subtle); padding-bottom:8px;">
            <span style="color:var(--accent-cyan); font-weight:bold;">${post.categoria}</span>
            <span style="color:var(--text-muted)">👤 ${post.autor}</span>
          </div>
          <h4 style="color:white; margin-bottom:8px;">${post.titulo}</h4>
          <p style="color:var(--text-muted); font-size:0.9rem;">${post.mensaje}</p>
        </div>
      `).join('') || '<p>Encara no hi ha temes.</p>';
    }
  } catch (err) { console.error("Error carregant posts:", err); }
}

// ==========================================
// 5. LÒGICA DEL DIAGNÒSTIC (GAMEPAD API)
// ==========================================

let activeGamepadIndex = null;
let buttonStates = []; 

// Escriu a la consola de Hardware Event Log
function addLog(msg) {
  // AHORA SÍ USA EL ID CORRECTO DE TU HTML
  const logBox = document.getElementById('realtime-log');
  if (logBox) {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.innerHTML = `<span style="color: var(--accent-pink);">[${time}]</span> ${msg}`;
    logBox.prepend(entry);
  }
}

// Canvia el text superior d'estat
function updateStatusText(gp) {
  // AHORA SÍ USA EL ID CORRECTO DE TU HTML
  const infoEl = document.getElementById('diag-status');
  if (infoEl) {
    if (gp) {
      infoEl.textContent = "Mando connectat: " + gp.id;
      infoEl.style.color = "var(--accent-cyan)";
    } else {
      infoEl.textContent = "Estat: pendent de connexió del mando per USB-C.";
      infoEl.style.color = "var(--text-main)";
    }
  }
}

window.addEventListener("gamepadconnected", (e) => {
  activeGamepadIndex = e.gamepad.index;
  updateStatusText(e.gamepad);
  addLog(`Connexió establerta: ${e.gamepad.id}`);
});

window.addEventListener("gamepaddisconnected", (e) => {
  activeGamepadIndex = null;
  updateStatusText(null);
  addLog("Mando desconnectat.");
});

function updateDashboard() {
  const gamepads = navigator.getGamepads();
  let gp = null;

  if (activeGamepadIndex !== null) {
    gp = gamepads[activeGamepadIndex];
  } else {
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        activeGamepadIndex = i;
        gp = gamepads[i];
        updateStatusText(gp);
        addLog(`Mando detectat per USB: ${gp.id}`);
        break;
      }
    }
  }

  if (gp) {
    // 1. Assegura't que el text canvia si es queda bloquejat en "pendent"
    const infoEl = document.getElementById('diag-status');
    if (infoEl && infoEl.textContent.includes("pendent")) {
        updateStatusText(gp);
    }

    // 2. DIAGNOSTICADOR (Eixos Analògics)
    const lxEl = document.getElementById('val-lx');
    const lyEl = document.getElementById('val-ly');
    const rxEl = document.getElementById('val-rx');
    const ryEl = document.getElementById('val-ry');

    if (lxEl) lxEl.textContent = gp.axes[0].toFixed(2);
    if (lyEl) lyEl.textContent = gp.axes[1].toFixed(2);
    if (rxEl) rxEl.textContent = gp.axes[2].toFixed(2);
    if (ryEl) ryEl.textContent = gp.axes[3].toFixed(2);

    // 3. MOURE STICKS VISUALS (L'SVG)
    const stickL = document.getElementById('stick-l');
    const stickR = document.getElementById('stick-r');
    if (stickL) stickL.style.transform = `translate(${gp.axes[0] * 20}px, ${gp.axes[1] * 20}px)`;
    if (stickR) stickR.style.transform = `translate(${gp.axes[2] * 20}px, ${gp.axes[3] * 20}px)`;

    // 4. TRIGGERS (barres visuals)
    const barL = document.getElementById('bar-l');
    const barR = document.getElementById('bar-r');
    // Els botons 6 i 7 solen ser L2 i R2
    if (gp.buttons[6] && barL) barL.style.width = (gp.buttons[6].value * 100) + '%';
    if (gp.buttons[7] && barR) barR.style.width = (gp.buttons[7].value * 100) + '%';

    // 5. BOTONS I HARDWARE LOG
    gp.buttons.forEach((btn, i) => {
      const btnEl = document.getElementById(`btn-${i}`);
      if (btnEl) {
        if (btn.pressed) {
            btnEl.style.fill = 'var(--accent-cyan)'; // Ara il·lumina correctament el teu SVG
        } else {
            btnEl.style.fill = '';
        }
      }

      // Registre de clics a la consola de la dreta
      if (btn.pressed && !buttonStates[i]) {
        addLog(`Botó ${i} premut`);
        buttonStates[i] = true;
      } else if (!btn.pressed && buttonStates[i]) {
        buttonStates[i] = false;
      }
    });
  }

  requestAnimationFrame(updateDashboard);
}

requestAnimationFrame(updateDashboard);

// --- LÒGICA PER RESPONDRE TEMES ---

async function enviarRespuesta(id_post) {
  const user = getCurrentUser();
  if (!user) return alert("Inicia sessió per respondre.");

  const mensajeInput = document.getElementById(`reply-input-${id_post}`);
  const mensaje = mensajeInput.value.trim();

  if (!mensaje) return;

  try {
    const res = await fetch('publicar_respuesta.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_post: id_post,
        autor: user.name,
        mensaje: mensaje
      })
    });
    const data = await res.json();

    if (data.success) {
      mensajeInput.value = '';
      cargarPosts(); // Recarreguem tot per veure la resposta
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

// Modificarem la funció cargarPosts perquè pinti també les respostes
// i el botó de respondre. 
// ATENCIÓ: He actualitzat el "map" per incloure el botó i la caixa de text.

async function cargarPosts() {
  const list = document.getElementById('forum-list');
  if (!list) return;

  try {
    const res = await fetch('obtener_posts.php'); // Aquest PHP hauria de retornar ara els posts amb les seves respostes si vols fer-ho pro
    const data = await res.json();
    
    if (data.success) {
      list.innerHTML = data.posts.map(post => `
        <div class="card" style="margin-bottom: 30px; border-left: 4px solid var(--accent-violet);">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:10px; border-bottom:1px solid var(--border-subtle); padding-bottom:8px;">
            <span style="color:var(--accent-cyan); font-weight:bold;">${post.categoria}</span>
            <span style="color:var(--text-muted)">👤 ${post.autor}</span>
          </div>
          <h4 style="color:white; margin-bottom:12px; font-size:1.3rem;">${post.titulo}</h4>
          <p style="color:var(--text-main); font-size:1rem; margin-bottom:20px; white-space:pre-wrap;">${post.mensaje}</p>
          
          <div id="respuestas-${post.id}" style="margin-left: 20px; padding-left: 15px; border-left: 2px solid var(--border-subtle); margin-top: 15px;">
            </div>

          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <input type="text" id="reply-input-${post.id}" placeholder="Escriu una resposta..." 
                   style="flex: 1; background: var(--bg-alt); border: 1px solid var(--border-subtle); color: white; padding: 8px 12px; border-radius: 6px;">
            <button class="btn btn-primary" style="padding: 8px 15px; font-size: 0.8rem;" onclick="enviarRespuesta(${post.id})">RESPONDRE</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error("Error al carregar fòrum:", err);
  }
}

async function cargarPosts() {
  const list = document.getElementById('forum-list');
  if (!list) return;

  try {
    const res = await fetch('obtener_posts.php');
    const data = await res.json();
    
    if (data.success) {
      list.innerHTML = data.posts.map(post => {
        // Generamos el HTML de las respuestas existentes
        const respuestasHTML = post.respuestas.map(r => `
          <div class="reply-card">
            <span class="reply-meta">👤 ${r.autor} · ${new Date(r.fecha).toLocaleDateString()}</span>
            <p class="reply-text">${r.mensaje}</p>
          </div>
        `).join('');

        return `
        <div class="card" style="margin-bottom: 30px; border-left: 4px solid var(--accent-violet);">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:10px;">
            <span style="color:var(--accent-cyan); font-weight:bold;">${post.categoria}</span>
            <span style="color:var(--text-muted)">👤 ${post.autor}</span>
          </div>
          <h4 style="color:white; margin-bottom:10px;">${post.titulo}</h4>
          <p style="color:var(--text-main); margin-bottom:15px;">${post.mensaje}</p>
          
          <div class="forum-replies-container">
            ${respuestasHTML}
          </div>

          <div class="reply-input-group">
            <input type="text" id="reply-input-${post.id}" placeholder="Escriu una resposta...">
            <button class="btn btn-primary" onclick="enviarRespuesta(${post.id})">RESPONDRE</button>
          </div>
        </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error("Error al carregar fòrum:", err);
  }
}

// --- LÒGICA DEL FORMULARI DE CONTACTE ---
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Recogemos los datos
      const datos = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim()
      };

      try {
        const res = await fetch('enviar_contacto.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });

        const result = await res.json();

        if (result.success) {
          alert("Gràcies! Hem rebut el teu missatge i et respondrem aviat.");
          contactForm.reset();
        } else {
          alert("Vaja, sembla que hi ha hagut un problema: " + result.message);
        }
      } catch (error) {
        console.error("Error al enviar contacte:", error);
        alert("No s'ha pogut connectar amb el servidor d'email.");
      }
    });
  }
});

// ==========================================
// --- LÒGICA DE LA BOTIGA (FILTRES I POPUP) ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card');
  const filterLinks = document.querySelectorAll('.filter-link');
  const productModal = document.getElementById('product-modal');
  const closeProductBtn = document.getElementById('close-product-modal');

  // 1. FILTRAT DE CATEGORIES
  filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.getAttribute('data-category');

      // Actualitzar enllaç actiu
      filterLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Filtrar cards
      productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. LÒGICA DEL POPUP (DETALL PRODUCTE)
  const openDetailBtns = document.querySelectorAll('.open-detail');
  
  openDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const title = card.querySelector('.product-title').textContent;
      const price = card.querySelector('.product-price').textContent;
      const tag = card.querySelector('.product-tag').textContent;
      const img = card.querySelector('.product-img').style.backgroundImage;

      // Omplir el modal amb les dades de la card
      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-price').textContent = price;
      document.getElementById('modal-tag').textContent = tag;
      document.getElementById('modal-img').style.backgroundImage = img;

      productModal.classList.add('open');
    });
  });

  if (closeProductBtn) {
    closeProductBtn.addEventListener('click', () => {
      productModal.classList.remove('open');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    const filterLinks = document.querySelectorAll('.filter-link');
    const productModal = document.getElementById('product-modal');
    const closeProductBtn = document.getElementById('close-product-modal');

    // 1. FILTRAT DE CATEGORIES
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. LÒGICA DEL POPUP
    const openDetailBtns = document.querySelectorAll('.open-detail');
    openDetailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const title = card.querySelector('.product-title').textContent;
            const price = card.querySelector('.product-price').textContent;
            const tag = card.querySelector('.product-tag').textContent;
            const imgEl = card.querySelector('.product-img');
            
            // Agafem la imatge de fons o el gradient
            const bgStyle = window.getComputedStyle(imgEl).backgroundImage;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-price').textContent = price;
            document.getElementById('modal-tag').textContent = tag;
            document.getElementById('modal-tag').className = card.querySelector('.product-tag').className;
            document.getElementById('modal-img').style.backgroundImage = bgStyle;

            productModal.classList.add('open');
        });
    });

    if (closeProductBtn) {
        closeProductBtn.addEventListener('click', () => productModal.classList.remove('open'));
    }
});
// --- LÓGICA DE PERSISTENCIA DEL CONFIGURADOR ---

// Objeto para guardar la selección actual
let configuracionActual = {
    color: 'Original',
    parts: {},
    precio: 124.99
};

// Función para guardar la selección (llámala cada vez que cambies un color)
function guardarSeleccion(tipo, valor) {
    configuracionActual[tipo] = valor;
    // Guardamos en la memoria del navegador
    localStorage.setItem('uc_config_temp', JSON.stringify(configuracionActual));
    console.log("Guardado:", configuracionActual);
}

// Ejemplo: Si tienes botones de colores en configurador.html
// deberías añadirles un evento que llame a guardarSeleccion('color', 'Negro')
// --- LÓGICA PARA CARGAR LA COMPRA ---
function cargarResumenCompra() {
    const resumenContainer = document.getElementById('resumen-configuracion');
    if (!resumenContainer) return; // Solo ejecutar si estamos en la página de compra

    const configGuardada = localStorage.getItem('uc_config_temp');
    
    if (configGuardada) {
        const data = JSON.parse(configGuardada);
        
        // 1. Actualizar texto del color
        const colorText = document.getElementById('compra-color-nombre');
        if (colorText) colorText.textContent = data.color;

        // 2. Actualizar la imagen del mando en la compra
        const mandoImg = document.getElementById('compra-mando-preview');
        if (mandoImg) {
            // Aquí pones la lógica de nombres de tus imágenes
            // Por ejemplo, si el color es "Negro", la imagen es "mandonegro.png"
            const nombreImagen = "mando" + data.color.toLowerCase().replace(" ", "") + ".png";
            mandoImg.src = "img/" + nombreImagen;
        }

        // 3. Actualizar precio total
        const precioTotal = document.getElementById('compra-precio-total');
        if (precioTotal) precioTotal.textContent = data.precio.toFixed(2) + "€";
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarResumenCompra);

// ==========================================
// 6. SIMULACIÓ DE DIAGNÒSTIC I BASE DE DADES
// ==========================================

async function runDiagnostic() {
  const btn = document.getElementById('diag-btn');
  const logBox = document.getElementById('diag-log');
  
  const plataforma = document.getElementById('diag-platform').value;
  const modelo = document.getElementById('diag-model').value;
  const serie = document.getElementById('diag-serial').value || 'Sense N/S';

  // 1. Bloquegem el botó perquè no es facin clics repetits
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Diagnosticant...";
    btn.style.opacity = "0.5";
  }

  // 2. Comencem el show visual al log
  if (logBox) {
    logBox.innerHTML = `[INIT] Iniciant diagnòstic per a ${plataforma} - ${modelo} (${serie})<br>`;
  }

  // Funció per fer pauses i simular que pensa
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Seqüència de proves falses
  await sleep(800);
  if (logBox) logBox.innerHTML += `[TEST] Comprovant firmware... OK<br>`;
  await sleep(1000);
  if (logBox) logBox.innerHTML += `[TEST] Analitzant possible drift... OK<br>`;
  await sleep(1200);
  if (logBox) logBox.innerHTML += `[TEST] Verificant resposta de polsadors... OK<br>`;
  await sleep(900);
  if (logBox) logBox.innerHTML += `[TEST] Test d'estrès de triggers... DONE<br>`;
  await sleep(600);

  // 3. Generem un resultat (majoritàriament positiu)
  const resultatsPossibles = [
    "Passat - Cap problema detectat",
    "Passat - Cap problema detectat",
    "Passat - Rendiment òptim al 100%",
    "Avís - Lleuger drift (0.02) al joystick esquerre",
    "Avís - Retard de 2ms al trigger dret"
  ];
  const resultatFinal = resultatsPossibles[Math.floor(Math.random() * resultatsPossibles.length)];

  if (logBox) {
    logBox.innerHTML += `<br><span style="color: var(--accent-cyan);">[DONE] Resultat obtingut: ${resultatFinal}</span><br>`;
    logBox.innerHTML += `[DB] Connectant amb la base de dades...<br>`;
  }

  // 4. Enviem les dades al teu PHP
  try {
    const res = await fetch('guardar_diagnostico.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plataforma: plataforma,
        modelo: modelo,
        serie: serie,
        resultado: resultatFinal
      })
    });

    const data = await res.json();

    if (data.status === 'success') {
      if (logBox) logBox.innerHTML += `<span style="color: #4cd137; font-weight: bold;">[DB SUCCESS] Registre guardat correctament (ID: ${data.id_registro})</span><br>`;
    } else {
      if (logBox) logBox.innerHTML += `<span style="color: var(--accent-pink); font-weight: bold;">[DB ERROR] Error del servidor: ${data.message}</span><br>`;
    }
  } catch (error) {
    console.error("Error al guardar el diagnòstic:", error);
    if (logBox) logBox.innerHTML += `<span style="color: var(--accent-pink); font-weight: bold;">[DB ERROR] No s'ha pogut connectar amb el servidor.</span><br>`;
  }

  // 5. Restaurem el botó
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Iniciar diagnòstic (demo)";
    btn.style.opacity = "1";
  }
}

// Fem que la funció sigui global perquè el teu HTML la pugui cridar amb el 'onsubmit'
window.runDiagnostic = runDiagnostic;