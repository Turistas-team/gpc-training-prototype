/* Entrada al GPC: login, registro, Problema 0 (handle de Codeforces), verificación, sincronización y bienvenida.
   Prototipo sin servidor: la sesión y las cuentas viven en este navegador (localStorage) y los datos de
   Codeforces son de prueba. Donde dice "API" iría la llamada real a Codeforces. */
var EN = { scr: 'login', f: {}, err: '', busy: false, key: null, v: 'idle', test: 0, secs: 300, prob: 0, opened: false, vs: 'idle', sync: 0, t: [], iv: 0 };
var EN_PROBS = [{ code: '4A', name: '4A Watermelon' }, { code: '1A', name: '1A Theatre Square' }, { code: '71A', name: '71A Way Too Long Words' }, { code: '231A', name: '231A Team' }];
var EN_DEMO = { mail: 'u20231234@upc.edu.pe', handle: 'Jean_Pool', name: 'Cristian', last: 'Coaguila' };

/* ---------- sesión y cuentas ---------- */
function enGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
function enSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function enSession() { return enGet('gpc:sesion', null); }
function enLogout() { enSet('gpc:sesion', null); enReset(); location.hash = '#/entrar'; }
function enAccounts() { var a = enGet('gpc:cuentas', []); return Array.isArray(a) ? a : []; }
// la contraseña nunca se guarda tal cual: solo su huella SHA-256
function enHash(s) {
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode('gpc:' + s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
    });
  }
  var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Promise.resolve('d' + (h >>> 0).toString(16));
}
// datos de Codeforces de prueba: los miembros del ranking (API: user.info)
function enCF(handle) {
  var k = (handle || '').trim().toLowerCase(), m = (typeof RK_MEM !== 'undefined' ? RK_MEM : []).filter(function (x) { return x[0].toLowerCase() === k; })[0];
  if (m) return { h: m[0], r: m[1], rank: G.rankOf(m[1]).name };
  if (/^[A-Za-z0-9_.\-]{3,24}$/.test(handle.trim())) return { h: handle.trim(), r: 0, rank: 'Unrated' };
  return null;
}
function enTint(u) {
  var c = u.r ? cfTier(u.r) : '#BDB9CC', t = u.r ? mbTint(u.r) : ['#F2F2F5'];
  var ink = u.r >= 2400 ? '#B4233F' : u.r >= 2100 ? '#A15C0B' : u.r >= 1900 ? '#8E2BAE' : u.r >= 1600 ? '#3E57C9' : u.r >= 1400 ? '#0F766E' : u.r >= 1200 ? '#1F7A3A' : '#45405F';
  return { color: c, soft: t[0], ink: ink };
}

/* ---------- utilidades ---------- */
function enEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function enClear() { EN.t.forEach(clearTimeout); EN.t = []; clearInterval(EN.iv); EN.iv = 0; }
function enLater(fn, ms) { EN.t.push(setTimeout(function () { if (document.getElementById('en-root')) fn(); }, ms)); }
function enReset() { enClear(); EN.scr = 'login'; EN.f = {}; EN.err = ''; EN.busy = false; EN.key = null; EN.v = 'idle'; EN.vs = 'idle'; EN.sync = 0; EN.opened = false; EN.secs = 300; enSaveAlta(); }
// el registro a medio hacer sobrevive a una recarga (sin la contraseña)
function enSaveAlta() {
  try {
    if (['p0', 'verif', 'sync', 'listo'].indexOf(EN.scr) >= 0) sessionStorage.setItem('gpc:alta', JSON.stringify({ scr: EN.scr === 'sync' ? 'verif' : EN.scr, f: { mail: EN.f.mail, name: EN.f.name, last: EN.f.last, handle: EN.f.handle, hash: EN.f.hash }, key: EN.key }));
    else sessionStorage.removeItem('gpc:alta');
  } catch (e) {}
}
function enLoadAlta() {
  try { var a = JSON.parse(sessionStorage.getItem('gpc:alta') || 'null'); if (a && a.f && a.f.hash) { EN.scr = a.scr; EN.f = a.f; EN.key = a.key; if (EN.scr === 'verif') { EN.secs = 300; EN.vs = 'idle'; } } } catch (e) {}
}
function enGo(scr) { EN.scr = scr; EN.err = ''; enSaveAlta(); enRender(); var r = document.getElementById('en-root'); if (r) { window.scrollTo({ top: 0, behavior: 'auto' }); var h = r.querySelector('h1, h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } } }

/* ---------- pantallas ---------- */
var EN_IC = {
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};
function enSteps() {
  var cur = { registro: 0, p0: 1, verif: 2, sync: 3, listo: 3 }[EN.scr];
  if (cur == null) return '';
  return '<ol class="en-steps" aria-label="Pasos para unirte al GPC">' + ['Cuenta', 'Problema', 'Codeforces', 'Listo'].map(function (l, i) {
    var done = i < cur || EN.scr === 'listo';
    return '<li class="' + (done ? 'done' : i === cur ? 'cur' : '') + '"' + (!done && i === cur ? ' aria-current="step"' : '') + '><span class="k">' + (i + 1) + '</span>' + l + '</li>';
  }).join('') + '</ol>';
}
function enMsg(cls) { return EN.err ? '<p class="en-msg ' + (cls || 'bad') + '" role="alert">' + enEsc(EN.err) + '</p>' : ''; }
function enIn(id, label, k, attrs, extra) {
  attrs = attrs || '';
  return '<div class="en-fl"><label for="' + id + '">' + label + '</label><input id="' + id + '"' + (/class=/.test(attrs) ? '' : ' class="en-in"') + ' data-en-f="' + k + '" value="' + enEsc(EN.f[k] || '') + '" ' + attrs + '>' + (extra || '') + '</div>';
}
function enLogin() {
  return '<form class="en-card en-narrow" data-en-form="login" novalidate aria-labelledby="en-t">' +
    '<div style="text-align:center"><h1 class="dsp" id="en-t">Entrar al GPC</h1><p class="en-sub">Con tu correo o tu handle de Codeforces.</p></div>' +
    enIn('en-u', 'Correo o handle', 'user', 'autocomplete="username" spellcheck="false" autocapitalize="off" placeholder="u20231234@upc.edu.pe"') +
    enIn('en-p', 'Contraseña', 'lpass', 'type="password" autocomplete="current-password"', '<a href="#/entrar" class="en-forgot" data-en="forgot">¿Olvidaste tu contraseña?</a>') +
    enMsg() +
    '<button type="submit" class="en-btn dark full"' + (EN.busy ? ' disabled' : '') + '>' + (EN.busy ? '<span class="en-spin lt" aria-hidden="true"></span>' : '') + 'Entrar</button>' +
    '<div class="en-alt">¿Todavía no tienes cuenta? <button type="button" class="en-link" data-en="registro">Regístrate</button></div>' +
  '</form>';
}
function enHola() {
  var s = enSession() || {}, u = enCF(s.handle || '') || { h: s.handle || '', r: 0 }, t = enTint(u);
  return '<div class="en-card en-narrow" style="align-items:center;text-align:center" role="status">' +
    '<span class="en-av big" style="background:' + t.color + ';box-shadow:0 0 0 8px ' + t.soft + '" aria-hidden="true">' + enEsc((u.h || '?').charAt(0).toUpperCase()) + '</span>' +
    '<h1 class="dsp" style="font-size:34px">Hola de nuevo, ' + enEsc(u.h) + '.</h1><p class="en-sub" style="margin:0">Te llevamos a Training.</p>' +
    '<a class="en-btn dark" href="#/training">Continuar</a></div>';
}
function enRegistro() {
  return '<div><h1 class="dsp en-big">Crea tu cuenta</h1><p class="en-sub en-lead">Un momento y empiezas.</p></div>' +
    '<form class="en-card" style="max-width:560px" data-en-form="registro" novalidate aria-label="Datos de la cuenta">' +
    enIn('en-e', 'Correo', 'mail', 'type="email" autocomplete="email" placeholder="u20231234@upc.edu.pe"') +
    '<div class="en-g2">' + enIn('en-n', 'Nombre', 'name', 'autocomplete="given-name"') + enIn('en-a', 'Apellido', 'last', 'autocomplete="family-name"') + '</div>' +
    enIn('en-rp', 'Contraseña', 'pass', 'type="password" autocomplete="new-password"', '<small>Mínimo 8 caracteres.</small>') +
    enMsg() +
    '<button type="submit" class="en-btn dark full">Continuar</button>' +
    '<p class="en-alt" style="border:0;padding:0">¿Ya tienes cuenta? <button type="button" class="en-link" data-en="login">Entrar</button></p>' +
  '</form>';
}
function enP0() {
  var full = ((EN.f.name || '') + ' ' + (EN.f.last || '')).trim(), u = EN.key ? enCF(EN.key) : null, verdict = '';
  if (EN.v === 'run') verdict = '<div class="en-vd run" role="status"><span class="en-spin" aria-hidden="true"></span>' + (EN.test ? 'Running on test ' + EN.test : 'En cola…') + '</div>';
  if (EN.v === 'taken') verdict = '<div class="en-vd wa" role="alert">Wrong answer on test 1: ese handle ya está vinculado a otra cuenta del GPC.</div>';
  if (EN.v === 'wa') verdict = '<div class="en-vd wa" role="alert">Wrong answer on test 1: "' + enEsc(EN.f.handle) + '" no es un handle de Codeforces. Revisa mayúsculas, guiones y puntos.</div>';
  if (EN.v === 'ok' && u) verdict = '<div class="en-vd ok" role="status">' + EN_IC.ok + 'Accepted: ' + enEsc(u.h) + ' existe en Codeforces.</div><div><button type="button" class="en-btn acc" data-en="verif">Ahora demuestra que es tuyo</button></div>';
  return '<main class="en-sheet" aria-labelledby="en-pt">' +
    '<h1 id="en-pt" class="dsp" style="text-align:center;font-size:34px">0. Unirse al GPC</h1>' +
    '<div class="en-st">' +
      '<p>Un estudiante de la UPC se encuentra con un problema que no sabe resolver. Prueba una idea, se equivoca y vuelve a intentarlo. Al compartirlo con otros, descubre un camino que no había considerado. Así comienza su historia en el GPC: con curiosidad, un reto y compañeros con quienes aprender.</p>' +
      '<p>El GPC tiene un training donde encontrarás una guía para avanzar, problemas para poner en práctica lo aprendido y compañeros con quienes compartir el proceso. Tu recorrido comienza en Beginner y avanza a tu ritmo, para que fortalezcas tus bases y te prepares para nuevos desafíos.</p>' +
      '<p>Pero antes de dar el primer paso, el GPC necesita saber quién eres.</p>' +
      '<p>Dado tu nombre y apellido, indica el handle de Codeforces con el que participarás en el grupo.</p>' +
      '<h2 class="en-sec">Entrada</h2><p>Una línea con tu nombre y apellido, proporcionados al crear tu cuenta.</p>' +
      '<h2 class="en-sec">Salida</h2><p>Tu nombre de usuario, también llamado handle, de Codeforces.</p>' +
      '<h2 class="en-sec">Ejemplo</h2>' +
      '<table class="en-ex"><thead><tr><th scope="col">Entrada</th><th scope="col">Salida</th></tr></thead><tbody><tr><td>Cristian Coaguila</td><td>Jean_Pool</td></tr></tbody></table>' +
    '</div>' +
    '<form class="en-subm" data-en-form="p0" novalidate aria-label="Enviar tu salida">' +
      '<div class="en-g2"><div class="en-fl"><label for="en-pin">Tu entrada</label><input id="en-pin" class="en-in mono" value="' + enEsc(full) + '" readonly></div>' +
      enIn('en-pout', 'Tu salida', 'handle', 'class="en-in mono" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="tu handle de Codeforces"') + '</div>' +
      '<div><button type="submit" class="en-btn dark"' + (EN.v === 'run' ? ' disabled' : '') + '>Enviar</button></div>' +
      verdict +
      '<p class="en-note">¿Todavía no tienes Codeforces? <a href="https://codeforces.com/register" target="_blank" rel="noopener">Crea tu cuenta allí</a> y vuelve con tu handle.</p>' +
    '</form></main>';
}
function enVerif() {
  var u = enCF(EN.key) || { h: EN.key, r: 0, rank: 'Unrated' }, t = enTint(u), p = EN_PROBS[EN.prob], mm = Math.floor(EN.secs / 60), ss = EN.secs % 60;
  var url = 'https://codeforces.com/problemset/problem/' + p.code.replace(/[A-Z]+$/, '') + '/' + p.code.replace(/^\d+/, '');
  return '<div><h1 class="dsp en-big">Vincula tu Codeforces</h1><p class="en-sub en-lead">Así tu progreso, rating y problemas resueltos se sincronizan solos. Nunca te pedimos tu contraseña de Codeforces.</p></div>' +
    '<div class="en-row">' +
      '<section class="en-card" style="flex:1 1 300px" aria-label="Tu handle"><b style="font-size:15px">Encontramos este handle</b>' +
        '<div class="en-who" style="background:' + t.soft + '"><span class="en-av" style="background:' + t.color + '" aria-hidden="true">' + enEsc(u.h.charAt(0).toUpperCase()) + '</span>' +
        '<div style="min-width:0"><b class="dsp" style="display:block;font-size:26px;line-height:1.1;color:' + t.ink + ';overflow-wrap:anywhere">' + enEsc(u.h) + '</b><span class="mono" style="font-size:14px;color:#45405F">' + enEsc(u.rank) + (u.r ? ' ' + u.r : '') + '</span></div></div>' +
        '<button type="button" class="en-link" style="align-self:flex-start" data-en="p0back">No es mi handle, cambiarlo</button></section>' +
      '<section class="en-card" style="flex:2 1 440px;gap:20px" aria-labelledby="en-ver">' +
        '<div class="en-vhead"><div><h2 class="dsp" id="en-ver" style="font-size:26px">Demuestra que es tuyo</h2><p class="en-sub" style="margin:4px 0 0">Un envío que no compile, para probar que manejas la cuenta.</p></div>' +
        '<div style="text-align:right"><span style="display:block;font-size:13px;color:#625C80">Tiempo restante</span><b class="mono" id="en-clock" style="font-size:28px;color:' + (EN.secs < 60 ? '#B4235A' : '#C2410C') + '">' + mm + ':' + (ss < 10 ? '0' : '') + ss + '</b></div></div>' +
        '<div class="en-do' + (EN.opened ? ' ok' : '') + '"><span class="n">1</span><p>Abre el problema <b>' + p.name + '</b> en Codeforces.</p></div>' +
        '<div class="en-do"><span class="n">2</span><p>Envía cualquier código que no compile. Debe salir <b>Compilation error</b>.</p></div>' +
        '<div class="en-do"><span class="n">3</span><p>Vuelve aquí y presiona Verificar.</p></div>' +
        (EN.vs === 'expired' ? '<p class="en-msg warn" role="alert">Se acabó el tiempo. Pide otro problema y vuelve a intentarlo.</p>' : '') +
        '<div class="en-acts">' +
          (EN.vs === 'expired' ? '<button type="button" class="en-btn dark" data-en="newprob">Pedir otro problema</button>'
            : '<button type="button" class="en-btn dark" data-en="verify"' + (EN.vs === 'checking' ? ' disabled' : '') + '>' + (EN.vs === 'checking' ? '<span class="en-spin lt" aria-hidden="true"></span>Verificando…' : 'Verificar') + '</button>') +
          '<a class="en-btn" href="' + url + '" target="_blank" rel="noopener" data-en="open">Abrir ' + p.code + ' en Codeforces' + EN_IC.ext + '</a>' +
        '</div>' +
        '<p class="en-note">El envío no cuenta en tu rating ni en tus problemas resueltos.</p>' +
      '</section></div>';
}
function enSync() {
  var u = enCF(EN.key) || { h: EN.key };
  return '<div><h1 class="dsp en-big">Listo, ' + enEsc(u.h) + '</h1><p class="en-sub en-lead">Estamos trayendo tu historial de Codeforces.</p></div>' +
    '<div class="en-card" style="max-width:560px" role="status">' +
    ['Rating y rango', 'Problemas resueltos', 'Historial de contests', 'Preparando los temas'].map(function (l, i) {
      var done = EN.sync > i, busy = EN.sync === i;
      return '<div class="en-sy' + (done ? ' done' : busy ? ' busy' : '') + '"><span class="ic">' + (done ? EN_IC.ok : busy ? '<span class="en-spin" aria-hidden="true"></span>' : '') + '</span>' + l + '</div>';
    }).join('') +
    '<button type="button" class="en-btn dark full" data-en="listo"' + (EN.sync < 4 ? ' disabled' : '') + '>Continuar</button></div>';
}
function enListo() {
  var u = enCF(EN.key) || { h: EN.key, r: 0 }, t = enTint(u);
  return '<div class="en-card en-welcome" role="status">' +
    '<span class="en-av big" style="background:' + t.color + ';box-shadow:0 0 0 8px ' + t.soft + '" aria-hidden="true">' + enEsc(u.h.charAt(0).toUpperCase()) + '</span>' +
    '<h1 class="dsp" style="font-size:40px;line-height:1.05">Bienvenido al GPC, ' + enEsc(EN.f.name || u.h) + '</h1>' +
    '<p class="en-sub" style="margin:0;max-width:460px;font-size:17px">Avanzas a tu ritmo. Tus estadísticas de Codeforces ya se cuentan en el training.</p>' +
    '<button type="button" class="en-btn dark" data-en="finish">Continuar</button></div>';
}
function enBody() {
  return EN.scr === 'hola' ? enHola() : EN.scr === 'registro' ? enRegistro() : EN.scr === 'p0' ? enP0() : EN.scr === 'verif' ? enVerif() :
    EN.scr === 'sync' ? enSync() : EN.scr === 'listo' ? enListo() : enLogin();
}
function enRender() {
  var r = document.getElementById('en-root'); if (!r) return;
  r.querySelector('.en-stepsbox').innerHTML = enSteps();
  r.querySelector('.en-body').innerHTML = enBody();
}
function viewEntrar() {
  if (EN.scr === 'login' && !EN.f.user) enLoadAlta();
  if (enSession() && EN.scr === 'login') EN.scr = 'hola';
  return '<div class="en-page" id="en-root">' +
    '<svg class="en-mtn" viewBox="0 0 1440 460" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="1080" cy="300" r="150" fill="#FFD9A8" opacity=".45"/><circle cx="1080" cy="300" r="70" fill="#F7931E" opacity=".9"/>' +
    '<path d="M0 460 L0 300 L150 250 L280 290 L430 180 L540 240 L640 160 L760 230 L880 180 L1010 250 L1150 200 L1290 260 L1440 220 L1440 460Z" fill="#E2D9FA"/>' +
    '<path d="M0 460 L0 370 L170 330 L320 360 L470 300 L620 350 L780 310 L940 360 L1100 320 L1260 350 L1440 330 L1440 460Z" fill="#D3C6F6"/></svg>' +
    '<div class="en-wrap"><div class="en-top"><div class="en-brand"><img src="assets/img/logo-gpc-upc.png" alt="Logo del GPC UPC"><span class="dsp">GPC Training</span></div><div class="en-stepsbox">' + enSteps() + '</div></div>' +
    '<div class="en-body">' + enBody() + '</div></div></div>';
}
function enEnter() {
  document.body.classList.add('en-on');
  if (EN.scr === 'verif' && !EN.iv) enClock();
  if (EN.scr === 'hola') enLater(function () { if (EN.scr === 'hola' && location.hash === '#/entrar') location.hash = '#/training'; }, 1800);
}
function enClock() {
  clearInterval(EN.iv);
  EN.iv = setInterval(function () {
    var c = document.getElementById('en-clock');
    if (!c) { clearInterval(EN.iv); EN.iv = 0; return; }
    EN.secs--;
    if (EN.secs <= 0) { clearInterval(EN.iv); EN.iv = 0; EN.secs = 0; EN.vs = 'expired'; enRender(); return; }
    var mm = Math.floor(EN.secs / 60), ss = EN.secs % 60;
    c.textContent = mm + ':' + (ss < 10 ? '0' : '') + ss; c.style.color = EN.secs < 60 ? '#B4235A' : '#C2410C';
  }, 1000);
}

/* ---------- acciones ---------- */
function enDoLogin() {
  var k = (EN.f.user || '').trim(), kl = k.toLowerCase();
  if (!k || !EN.f.lpass) { EN.err = 'Escribe tu correo o handle y tu contraseña.'; return enRender(); }
  EN.busy = true; EN.err = ''; enRender();
  enHash(EN.f.lpass).then(function (h) {
    var acc = enAccounts().filter(function (a) { return a.mail.toLowerCase() === kl || a.handle.toLowerCase() === kl; })[0];
    // la cuenta de prueba (Jean_Pool) entra con cualquier contraseña
    var demo = kl === EN_DEMO.mail || kl === EN_DEMO.handle.toLowerCase();
    enLater(function () {
      EN.busy = false;
      if ((acc && acc.hash === h) || (!acc && demo)) {
        enSet('gpc:sesion', { handle: acc ? acc.handle : EN_DEMO.handle, name: acc ? acc.name : EN_DEMO.name, at: Date.now() });
        EN.f = {}; enGo('hola'); enEnter();
      } else { EN.err = 'El correo o handle y la contraseña no coinciden. Si eres nuevo, regístrate.'; enRender(); var p = document.getElementById('en-p'); if (p) p.focus(); }
    }, 700);
  });
}
function enDoRegister() {
  var f = EN.f, mail = (f.mail || '').trim();
  if (!mail || !(f.name || '').trim() || !(f.last || '').trim()) EN.err = 'Completa tu correo, nombre y apellido.';
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) EN.err = 'Ese correo no parece válido.';
  else if ((f.pass || '').length < 8) EN.err = 'La contraseña necesita al menos 8 caracteres.';
  else if (mail.toLowerCase() === EN_DEMO.mail || enAccounts().some(function (a) { return a.mail.toLowerCase() === mail.toLowerCase(); })) EN.err = 'Ya existe una cuenta con ese correo. Entra con ella.';
  else EN.err = '';
  if (EN.err) return enRender();
  enHash(f.pass).then(function (h) { f.hash = h; delete f.pass; f.mail = mail; f.name = f.name.trim(); f.last = f.last.trim(); EN.v = 'idle'; enGo('p0'); });
}
function enDoP0() {
  var raw = (EN.f.handle || '').trim(); if (!raw || EN.v === 'run') return;
  enClear(); EN.v = 'run'; EN.test = 0; enRender();
  var u = enCF(raw), taken = u && enAccounts().some(function (a) { return a.handle.toLowerCase() === u.h.toLowerCase(); });
  enLater(function () { EN.test = 1; enRender(); }, 600);
  if (u && !taken) {
    enLater(function () { EN.test = 2; enRender(); }, 1000);
    enLater(function () { EN.v = 'ok'; EN.key = u.h; enSaveAlta(); enRender(); }, 1450);
  } else enLater(function () {
    EN.v = taken ? 'taken' : 'wa'; enRender();
  }, 1300);
}
function enDoVerify() {
  EN.vs = 'checking'; enRender();
  // API: user.status del handle, buscando un COMPILATION_ERROR en el problema pedido después de abrir esta pantalla
  enLater(function () {
    enClear(); EN.vs = 'idle'; EN.sync = 0; enGo('sync');
    [1, 2, 3, 4].forEach(function (n, i) { enLater(function () { EN.sync = n; enRender(); }, 850 * (i + 1)); });
  }, 1400);
}
function enFinish() {
  var f = EN.f, list = enAccounts();
  list.push({ mail: f.mail, name: f.name, last: f.last, hash: f.hash, handle: EN.key, at: Date.now() });
  enSet('gpc:cuentas', list);
  enSet('gpc:sesion', { handle: EN.key, name: f.name, at: Date.now() });
  enReset(); location.hash = '#/training';
}

document.addEventListener('input', function (e) { var k = e.target.dataset && e.target.dataset.enF; if (k) { EN.f[k] = e.target.value; if (k === 'handle' && EN.v !== 'run') EN.v = 'idle'; } });
document.addEventListener('submit', function (e) {
  var f = e.target.dataset && e.target.dataset.enForm; if (!f) return;
  e.preventDefault();
  if (f === 'login') enDoLogin(); else if (f === 'registro') enDoRegister(); else if (f === 'p0') enDoP0();
});
document.addEventListener('click', function (e) {
  var b = e.target.closest('[data-en]'); if (!b || !document.getElementById('en-root')) return;
  var a = b.dataset.en;
  if (a === 'open') { EN.opened = true; b.closest('.en-card').querySelector('.en-do').classList.add('ok'); return; }
  e.preventDefault();
  if (a === 'registro') { EN.f = {}; enGo('registro'); }
  else if (a === 'login') { EN.f = {}; enGo('login'); }
  else if (a === 'forgot') { EN.err = 'Escríbele a la directiva del GPC para recuperar tu acceso.'; enRender(); }
  else if (a === 'verif') { EN.secs = 300; EN.vs = 'idle'; EN.opened = false; enGo('verif'); enClock(); }
  else if (a === 'p0back') { enClear(); EN.v = 'idle'; EN.key = null; enGo('p0'); }
  else if (a === 'verify') enDoVerify();
  else if (a === 'newprob') { EN.prob = (EN.prob + 1) % EN_PROBS.length; EN.secs = 300; EN.vs = 'idle'; EN.opened = false; enRender(); enClock(); }
  else if (a === 'listo') enGo('listo');
  else if (a === 'finish') enFinish();
});
window.addEventListener('hashchange', function () { if (location.hash.indexOf('#/entrar') !== 0) { enClear(); document.body.classList.remove('en-on'); } });
