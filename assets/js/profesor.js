/* Modo profesor: Panel del grupo y editor de Contenido.
   Prototipo sin servidor: el contenido publicado y los borradores viven en este navegador (localStorage)
   y la actividad del grupo es de prueba. En la versión real, la actividad sale de la API de Codeforces
   (user.status, user.rating) y el contenido de la base de datos del GPC. */

var PR = { per: 'semana', off: 0, lv: 'General', q: '' };
var CT = { lv: 'beginner', tid: null, k: 0, open: {}, form: null, err: '' };

function prEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function prHash(str) { var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
var PR_SVG = function (d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
var PR_IC = {
  prev: PR_SVG('M15 5l-7 7 7 7', 2.2), next: PR_SVG('M9 5l7 7-7 7', 2.2), up: PR_SVG('M6 15l6-6 6 6', 2.2), down: PR_SVG('M6 9l6 6 6-6', 2.2),
  chev: PR_SVG('M9 6l6 6-6 6', 2.2), grip: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>', del: PR_SVG('M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12'), dl: PR_SVG('M12 4v11M7 10l5 5 5-5M5 20h14')
};
// montañas propias de cada pantalla (mismos colores que el resto de la página)
var PR_MTN = {
  panel: '<path d="M0 300 L0 170 L120 120 L260 50 L380 110 L500 140 L620 115 L720 90 L820 118 L940 140 L1060 95 L1180 30 L1300 100 L1440 150 L1440 300Z" fill="#E2D9FA"/><path d="M260 50 L296 76 L276 72 L260 84 L244 71 L224 76Z M720 90 L748 110 L732 107 L720 116 L707 106 L692 110Z M1180 30 L1220 60 L1198 55 L1180 68 L1162 55 L1140 60Z" fill="#fff" opacity=".9"/><path d="M0 300 L0 210 L150 180 L300 200 L460 165 L600 205 L760 190 L900 210 L1040 170 L1200 200 L1340 180 L1440 200 L1440 300Z" fill="#CFC2F5"/><path d="M0 300 L0 258 L240 246 L480 262 L720 250 L960 262 L1200 246 L1440 258 L1440 300Z" fill="#BEADEF"/>',
  contenido: '<path d="M0 300 L0 200 L140 150 L300 90 L420 140 L560 170 L700 150 L840 120 L960 75 L1060 40 L1160 85 L1300 130 L1440 160 L1440 300Z" fill="#E2D9FA"/><path d="M1060 40 L1098 66 L1078 62 L1060 75 L1042 62 L1022 66Z M300 90 L330 112 L314 108 L300 118 L286 108 L270 112Z" fill="#fff" opacity=".9"/><path d="M1060 40 V8" stroke="#1E1B3A" stroke-width="3" stroke-linecap="round"/><path d="M1061 8 h28 l-7 7 7 7 h-28z" fill="#F7931E"/><path d="M0 300 L0 220 L180 190 L340 215 L520 180 L680 210 L860 185 L1020 205 L1180 175 L1320 200 L1440 190 L1440 300Z" fill="#CFC2F5"/><path d="M0 300 L0 250 L200 262 L460 244 L720 258 L980 244 L1240 260 L1440 248 L1440 300Z" fill="#BEADEF"/>'
};
function prHero(title, mtn, tabs, back) {
  return '<header class="pr-hero">' + (back ? '<a class="pr-back" href="#/panel">' + PR_IC.prev + 'Panel</a>' : '') + '<h1 class="pr-dsp">' + title + '</h1>' + tabs +
    '<svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">' + PR_MTN[mtn] + '<path d="M0 300 V292 Q360 280 720 292 T1440 288 V300Z" fill="#F7F4FE"/></svg></header>';
}
function prTabs(list, cur, attr, label) {
  return '<div class="pr-tabs" role="group" aria-label="' + label + '">' + list.map(function (t) {
    var v = t[0], on = v === cur;
    return '<button type="button" ' + attr + '="' + v + '" aria-pressed="' + on + '">' + (t[2] ? '<i style="background:' + t[2] + '"></i>' : '') + t[1] + '</button>';
  }).join('') + '</div>';
}
// barra del menú: el profesor ve Panel y Contenido y su nombre en lugar del handle de prueba
function prSync() {
  var on = typeof enProf === 'function' && enProf(), me = document.querySelector('.nav .me');
  document.body.classList.toggle('pr-on', on);
  if (!me) return;
  var n = document.getElementById('mename'), r = document.getElementById('merating');
  if (on) { n.textContent = 'Rodo'; r.textContent = 'Profesor'; r.style.color = '#00756D'; me.setAttribute('href', '#/panel'); me.setAttribute('aria-label', 'Panel del grupo'); }
  else if (window.GPC) { var u = GPC.me; n.textContent = u.handle; r.textContent = u.rank.name + ' ' + u.rating; r.style.color = u.rank.color; me.setAttribute('href', '#/miembro/' + encodeURIComponent(u.handle) + '/cf'); me.setAttribute('aria-label', 'Tu perfil de Codeforces'); }
}

/* =====================================================================
   PANEL DEL GRUPO
   ===================================================================== */
var PR_LV = { Beginner: ['#FFF0DC', '#8A4A00', '#F7931E', ['basico']], Junior: ['#FDE6EE', '#A61E52', '#F05A8C', ['intermedio']], Senior: ['#E3EEFD', '#1F5BA8', '#3B8BEB', ['avanzado', 'icpc']] };
var PR_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
// período elegido: etiqueta, clave para los datos de prueba y cuánto "pesa" frente a una semana
function prPeriod(per, off) {
  var now = new Date(); now.setHours(0, 0, 0, 0);
  if (per === 'semana') {
    var a = new Date(now); a.setDate(a.getDate() - ((a.getDay() + 6) % 7) - 7 * off);
    var b = new Date(a); b.setDate(b.getDate() + 6);
    var lab = a.getMonth() === b.getMonth() ? a.getDate() + ' al ' + b.getDate() + ' de ' + PR_MES[b.getMonth()] : a.getDate() + ' de ' + PR_MES[a.getMonth()] + ' al ' + b.getDate() + ' de ' + PR_MES[b.getMonth()];
    return { label: lab, key: 's' + a.toISOString().slice(0, 10), f: 1, prevName: 'la semana anterior', nav: true };
  }
  if (per === 'mes') {
    var m = new Date(now.getFullYear(), now.getMonth() - off, 1);
    return { label: PR_MES[m.getMonth()].charAt(0).toUpperCase() + PR_MES[m.getMonth()].slice(1) + ' de ' + m.getFullYear(), key: 'm' + m.getFullYear() + '-' + m.getMonth(), f: 4, prevName: 'el mes anterior', nav: true };
  }
  if (per === 'ciclo') {
    var idx = now.getFullYear() * 2 + (now.getMonth() >= 6 ? 1 : 0) - off, y = Math.floor(idx / 2), half = idx % 2;
    return { label: 'Ciclo ' + y + '-' + (half ? 'II' : 'I') + (half ? ', de julio a diciembre' : ', de enero a junio'), key: 'c' + idx, f: 22, prevName: 'el ciclo anterior', nav: true };
  }
  return { label: 'Desde que empezó el grupo', key: 'g', f: 70, prevName: '', nav: false };
}
// actividad de prueba de cada miembro en un período
function prStats(m, P) {
  // cada miembro tiene un hábito estable (cuánto compite) y el período solo varía un poco alrededor de él,
  // así un período largo nunca muestra menos actividad que uno corto
  var h = prHash(m[0] + P.key), cfHab = prHash(m[0] + 'cf') % 4, lvb = m[2] === 'Senior' ? 1.3 : m[2] === 'Junior' ? 1 : .8;
  var act = P.f > 1 || (h % 10) < 8 ? 1 : 0, wob = .7 + (h % 7) / 10;
  var solved = act ? Math.max(1, Math.round(((prHash(m[0]) % 12) + 3) * lvb * P.f * wob)) : 0;
  var contests = act && cfHab ? Math.max(P.f > 1 ? 1 : 0, Math.round(cfHab / 3 * P.f * wob * .9)) : 0;
  var delta = contests ? Math.round((((h >>> 11) % 120) - 45) * Math.min(4, Math.sqrt(P.f))) : 0;
  return { solved: solved, contests: contests, delta: delta, streak: act ? ((h >>> 5) % 25) + 1 : 0, logros: act ? Math.round(((h >>> 9) % 3) * Math.sqrt(P.f)) : 0 };
}
function prTopicNow(m) {
  var ts = GPC.topics.filter(function (t) { return PR_LV[m[2]][3].indexOf(t.level) >= 0; });
  return ts.length ? ts[prHash(m[0]) % ts.length].name : '';
}
function prLast(m) { var d = prHash(m[0] + 'last') % 11; return d === 0 ? 'Hoy' : d === 1 ? 'Ayer' : 'Hace ' + d + ' días'; }
function prRows() {
  var P = prPeriod(PR.per, PR.off);
  return (typeof RK_MEM !== 'undefined' ? RK_MEM : []).filter(function (m) { return PR.lv === 'General' || m[2] === PR.lv; }).map(function (m) {
    var s = prStats(m, P);
    return { h: m[0], r: m[1], lv: m[2], solved: s.solved, contests: s.contests, delta: s.delta, streak: s.streak, logros: s.logros, topic: prTopicNow(m), last: prLast(m) };
  }).sort(function (a, b) { return b.solved - a.solved || b.r - a.r; });
}
function prRk(r) { return GPC.rankOf(r); }
function prAv(h, lv) { var c = PR_LV[lv]; return '<span class="pr-av" style="background:' + c[0] + ';color:' + c[1] + '" aria-hidden="true">' + prEsc(h.replace(/^_+/, '').charAt(0).toUpperCase()) + '</span>'; }
function prKpis(rows) {
  var P = prPeriod(PR.per, PR.off), tot = 0, act = 0, cf = 0, lg = 0;
  rows.forEach(function (x) { tot += x.solved; if (x.solved) act++; if (x.contests) cf++; lg += x.logros; });
  var cmp = '';
  if (P.nav) {
    var Q = prPeriod(PR.per, PR.off + 1), prev = 0;
    RK_MEM.filter(function (m) { return PR.lv === 'General' || m[2] === PR.lv; }).forEach(function (m) { prev += prStats(m, Q).solved; });
    var d = tot - prev; cmp = d === 0 ? 'Igual que ' + P.prevName : Math.abs(d) + (d > 0 ? ' más' : ' menos') + ' que ' + P.prevName;
  } else cmp = 'En total';
  var k = [['Resolvieron', act + ' de ' + rows.length, 'Al menos un problema aceptado'], ['Problemas resueltos', tot, cmp], ['Participaron en Codeforces', cf, 'En al menos un contest'], ['Logros desbloqueados', lg, 'Entre todos los miembros']];
  return k.map(function (x) { return '<div class="pr-kpi"><span>' + x[0] + '</span><b>' + x[1] + '</b><small>' + x[2] + '</small></div>'; }).join('');
}
function prStars(rows) {
  if (!rows.length) return '';
  var by = function (f) { return rows.slice().sort(function (a, b) { return f(b) - f(a); })[0]; };
  var a = by(function (x) { return x.solved; }), b = by(function (x) { return x.delta; }), c = by(function (x) { return x.streak; });
  var up = rows.filter(function (x) { return x.delta > 0 && prRk(x.r - x.delta).name !== prRk(x.r).name; })[0];
  var d = up ? ['Nuevo rango', up, 'Llegó a ' + prRk(up.r).name] : ['Mejor rating', by(function (x) { return x.r; }), by(function (x) { return x.r; }).r + ', ' + prRk(by(function (x) { return x.r; }).r).name];
  var list = [['Más problemas', a, a.solved + ' aceptados'], ['Mayor subida', b, b.delta > 0 ? '+' + b.delta + ' de rating' : 'Sin subidas en este período'], ['Racha más larga', c, c.streak + ' días seguidos'], d];
  return list.map(function (s) {
    return '<a class="pr-star" href="#/miembro/' + encodeURIComponent(s[1].h) + '/cf">' + prAv(s[1].h, s[1].lv) + '<span><small>' + s[0] + '</small><b>' + prEsc(s[1].h) + '</b><span>' + s[2] + '</span></span></a>';
  }).join('');
}
function prCf(rows) {
  var p = rows.filter(function (x) { return x.contests; }).sort(function (a, b) { return b.contests - a.contests || b.delta - a.delta; });
  if (!p.length) return '<p class="pr-empty">Nadie participó en contests de Codeforces en este período.</p>';
  return '<div class="pr-cfh" aria-hidden="true"><span>Miembro</span><span>Contests</span><span>Rating</span></div>' + p.slice(0, 7).map(function (x) {
    return '<div class="pr-cf"><a href="#/miembro/' + encodeURIComponent(x.h) + '/cf">' + prEsc(x.h) + '</a><span>' + x.contests + '</span><b class="' + (x.delta >= 0 ? 'up' : 'dn') + '">' + (x.delta > 0 ? '+' : '') + x.delta + '</b></div>';
  }).join('') + (p.length > 7 ? '<p class="pr-more">Y ' + (p.length - 7) + ' más</p>' : '');
}
function prTopics() {
  var lvs = PR.lv === 'General' ? ['Beginner', 'Junior', 'Senior'] : [PR.lv];
  return lvs.map(function (lv) {
    var ts = GPC.topics.filter(function (t) { return PR_LV[lv][3].indexOf(t.level) >= 0; });
    if (PR.lv === 'General') ts = ts.slice(0, 3);
    return ts.map(function (t) {
      var base = lv === 'Beginner' ? 55 : lv === 'Junior' ? 30 : 12, pct = Math.min(98, base + prHash(t.id) % 40);
      return '<div class="pr-tp"><span>' + prEsc(t.name) + '</span><span class="pr-bar"><i style="width:' + pct + '%;background:' + PR_LV[lv][2] + '"></i></span><b>' + pct + '%</b></div>';
    }).join('');
  }).join('');
}
function prTable(rows) {
  var q = PR.q.trim().toLowerCase(), list = rows.filter(function (x) { return !q || x.h.toLowerCase().indexOf(q) >= 0; });
  if (!list.length) return '<p class="pr-empty">Ningún miembro coincide con "' + prEsc(PR.q) + '".</p>';
  return '<div class="pr-scroll"><table class="pr-table"><thead><tr><th scope="col">Miembro</th><th scope="col">Nivel</th><th scope="col">Rating</th><th scope="col">Problemas</th><th scope="col">Contests</th><th scope="col">Tema actual</th><th scope="col">Última actividad</th></tr></thead><tbody>' +
    list.map(function (x) {
      return '<tr><td><a class="pr-who" href="#/miembro/' + encodeURIComponent(x.h) + '/cf">' + prAv(x.h, x.lv) + '<b>' + prEsc(x.h) + '</b></a></td><td><span class="pr-lv" style="color:' + PR_LV[x.lv][1] + '">' + x.lv + '</span></td>' +
        '<td class="pr-mono" style="color:' + prRk(x.r).color + '">' + x.r + '</td><td class="pr-mono">' + x.solved + '</td><td class="pr-mono">' + x.contests + '</td><td>' + prEsc(x.topic) + '</td><td>' + x.last + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
function prBody() {
  var P = prPeriod(PR.per, PR.off), rows = prRows();
  return '<div class="pr-per" role="group" aria-label="Período">' +
      prTabs([['semana', 'Semana'], ['mes', 'Mes'], ['ciclo', 'Ciclo'], ['general', 'General']], PR.per, 'data-pr-per', 'Ver por') +
      '<div class="pr-step"><button type="button" data-pr-off="1" aria-label="Período anterior"' + (P.nav ? '' : ' disabled') + '>' + PR_IC.prev + '</button><span aria-live="polite">' + P.label + '</span><button type="button" data-pr-off="-1" aria-label="Período siguiente"' + (P.nav && PR.off > 0 ? '' : ' disabled') + '>' + PR_IC.next + '</button></div></div>' +
    '<section class="pr-kpis" aria-label="Resumen del período">' + prKpis(rows) + '</section>' +
    '<section class="pr-card"><h2 class="pr-dsp">Destacados</h2><div class="pr-stars">' + prStars(rows) + '</div></section>' +
    '<div class="pr-two"><section class="pr-card"><h2 class="pr-dsp">Codeforces en el período</h2><p class="pr-sub">Participaron ' + rows.filter(function (x) { return x.contests; }).length + ' de ' + rows.length + '.</p>' + prCf(rows) + '</section>' +
      '<section class="pr-card"><h2 class="pr-dsp">Avance del grupo por tema</h2><div class="pr-tps">' + prTopics() + '</div><div class="pr-leg"><span><i style="background:#F7931E"></i>Beginner</span><span><i style="background:#F05A8C"></i>Junior</span><span><i style="background:#3B8BEB"></i>Senior</span></div></section></div>' +
    '<section class="pr-card"><div class="pr-th"><h2 class="pr-dsp">Miembros</h2><div class="pr-tools"><label class="pr-sr" for="pr-q">Buscar miembro</label><input id="pr-q" class="pr-in" type="search" placeholder="Buscar por handle" value="' + prEsc(PR.q) + '" data-pr-q><button type="button" class="pr-btn" data-pr-csv>' + PR_IC.dl + 'Exportar CSV</button></div></div><div id="pr-tbl">' + prTable(rows) + '</div></section>';
}
// la página Panel reúne las herramientas del profesor
var PR_ART = {
  actividad: '<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="72" r="60" fill="#E3EEFD"/><rect x="34" y="92" width="18" height="30" rx="5" fill="#F7931E"/><rect x="60" y="70" width="18" height="52" rx="5" fill="#F05A8C"/><rect x="86" y="52" width="18" height="70" rx="5" fill="#3B8BEB"/><rect x="112" y="34" width="18" height="88" rx="5" fill="#1E1B3A"/><path d="M28 122h108" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/><path d="M38 76l26-20 26 10 34-34" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="124" cy="32" r="6" fill="#16A34A"/></svg>',
  contenido: '<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="72" r="60" fill="#FEF1E2"/><rect x="40" y="30" width="64" height="86" rx="8" fill="#fff" stroke="#1E1B3A" stroke-width="4"/><path d="M52 50h40M52 64h40M52 78h26" stroke="#CFC6EA" stroke-width="5" stroke-linecap="round"/><path d="M96 100l26-46 12 7-26 46-14 6z" fill="#F7931E" stroke="#1E1B3A" stroke-width="4" stroke-linejoin="round"/><path d="M118 61l12 7" stroke="#1E1B3A" stroke-width="4"/></svg>',
  logros: '<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="72" r="60" fill="#EDE7FB"/><path d="M62 22l18 34 18-34" fill="none" stroke="#F05A8C" stroke-width="10" stroke-linejoin="round"/><circle cx="80" cy="84" r="34" fill="#F5C451" stroke="#1E1B3A" stroke-width="4"/><circle cx="80" cy="84" r="22" fill="none" stroke="#E3AF3A" stroke-width="4"/><path d="M80 70l4.5 9 10 1.5-7.2 7 1.7 10L80 92.8 71 97.5l1.7-10-7.2-7 10-1.5z" fill="#fff"/></svg>'
};
function viewPanelHub() {
  var card = function (href, art, title, desc, soon) {
    return soon ? '<div class="blk pr-soon" aria-disabled="true">' + art + '<div><h2 class="pr-dsp">' + title + '</h2><p>' + desc + '</p><span class="pr-tag">Próximamente</span></div></div>'
      : '<a class="blk" href="' + href + '">' + art + '<div><h2 class="pr-dsp">' + title + '</h2><p>' + desc + '</p></div></a>';
  };
  return '<div class="pr-page pr-hubpage"><svg class="pr-hubmtn" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">' + PR_MTN.panel + '<path d="M0 300 V292 Q360 280 720 292 T1440 288 V300Z" fill="#F7F4FE"/></svg>' +
    '<div class="pr-hubin"><h1 class="pr-dsp">Panel</h1>' + '<div class="pr-chips"><a class="pr-pill" href="#/panel/anuncios"><span class="pr-pi"><svg viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10v4a1 1 0 0 0 1 1h3l6 4V5L8 9H5a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg></span><b>Hacer un anuncio</b><svg viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></a></div>' +
    '<div class="pr-hub">' +
      card('#/panel/actividad', PR_ART.actividad, 'Actividad del grupo', 'Quién resuelve, quién compite y cómo avanza el grupo por tema.') +
      card('#/panel/contenido', PR_ART.contenido, 'Contenido', 'Temas, subtemas, recursos y problemas de la guía.') +
      card('#/panel/logros', PR_ART.logros, 'Logros', 'Crea y edita logros, y entrégalos a mano.') +
    '</div></div></div>';
}
function viewPanel() {
  return '<div class="pr-page">' + prHero('Actividad del grupo', 'panel', prTabs([['General', 'General'], ['Beginner', 'Beginner'], ['Junior', 'Junior'], ['Senior', 'Senior']], PR.lv, 'data-pr-lv', 'Nivel'), true) +
    '<main class="pr-main" id="pr-body">' + prBody() + '</main></div>';
}
function prRender(focusSel) {
  var hero = document.querySelector('.pr-hero .pr-tabs'), b = document.getElementById('pr-body');
  if (!b) return;
  if (hero) hero.outerHTML = prTabs([['General', 'General'], ['Beginner', 'Beginner'], ['Junior', 'Junior'], ['Senior', 'Senior']], PR.lv, 'data-pr-lv', 'Nivel');
  b.innerHTML = prBody();
  if (focusSel) { var f = document.querySelector(focusSel); if (f) f.focus(); }
}
function prCsv() {
  var P = prPeriod(PR.per, PR.off), rows = prRows(), q = PR.q.trim().toLowerCase();
  var cell = function (v) { v = String(v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  var lines = [['Miembro', 'Nivel', 'Rating', 'Problemas', 'Contests', 'Cambio de rating', 'Tema actual', 'Última actividad', 'Período']].concat(rows.filter(function (x) { return !q || x.h.toLowerCase().indexOf(q) >= 0; }).map(function (x) {
    return [x.h, x.lv, x.r, x.solved, x.contests, x.delta, x.topic, x.last, P.label];
  }));
  var a = document.createElement('a'), url = URL.createObjectURL(new Blob(['﻿' + lines.map(function (l) { return l.map(cell).join(','); }).join('\n')], { type: 'text/csv;charset=utf-8' }));
  a.href = url; a.download = 'panel-gpc-' + PR.per + '-' + P.key.replace(/[^a-z0-9-]/gi, '') + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* =====================================================================
   CONTENIDO: borradores, publicación y editor
   ===================================================================== */
var CT_TYPES = { 'Artículo': '#3B8BEB', 'Blog': '#F05A8C', 'Video': '#E11D48', 'Libro': '#F7931E' };
var CT_PLATS = ['Codeforces', 'CSES', 'AtCoder', 'vjudge', 'SPOJ'];
var CT_PINK = { Codeforces: '#1F5BA8', CSES: '#0B5D55', AtCoder: '#45405F', vjudge: '#8A4A00', SPOJ: '#A61E52' };
var CT_SECS = [['rec', 'Recursos', '+ Agregar recurso'], ['ese', 'Esenciales', '+ Agregar problema esencial'], ['cf', 'Problemas Codeforces', '+ Agregar problema'], ['ext', 'Extras', '+ Agregar extra']];
var CT_LVS = [['beginner', 'Beginner', '#F7931E', ['basico']], ['junior', 'Junior', '#F05A8C', ['intermedio']], ['senior', 'Senior', '#3B8BEB', ['avanzado', 'icpc']]];

function ctLoad(k) { try { var v = JSON.parse(localStorage.getItem(k) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } }
function ctSave(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function ctPubAll() { return ctLoad('gpc:ct:pub'); }
function ctDraftAll() { return ctLoad('gpc:ct:borrador'); }
function ctTopic(tid) { return GPC.topics.filter(function (t) { return t.id === tid; })[0]; }
// subtemas originales de cada tema, antes de lo publicado por el profesor
function ctBase(t) { if (!t._base) t._base = t.concepts.slice(); return t._base; }
function ctCount(t, withDrafts) {
  var n = ctBase(t).length, add = function (o) { Object.keys(o).forEach(function (key) { var p = key.split('/'); if (p[0] === t.id) n = Math.max(n, +p[1] + 1); }); };
  add(ctPubAll()); if (withDrafts) add(ctDraftAll());
  return n;
}
// lo publicado reemplaza los nombres de los subtemas y suma los nuevos (lo usan Guía y la página del subtema)
function ctApply() {
  var pub = ctPubAll();
  GPC.topics.forEach(function (t) {
    var base = ctBase(t), n = ctCount(t, false), c = [];
    for (var k = 0; k < n; k++) { var d = pub[t.id + '/' + k]; c.push(d && d.name ? d.name : (base[k] || 'Subtema ' + (k + 1))); }
    t.concepts = c;
  });
}
// contenido de prueba de un subtema que nadie editó (el mismo que se mostraba antes)
function ctDefault(t, k) {
  var base = ctBase(t), c = base[k];
  if (c == null) return { name: 'Nuevo subtema', desc: '', rec: [], ese: [], cf: [], ext: [] };
  var seed = t.id + '/' + k, q = encodeURIComponent(t.name + ' ' + c), plat = ['CSES', 'AtCoder', 'vjudge', 'SPOJ'], cfu = 'https://codeforces.com/problemset';
  var rt = function (s) { return 800 + (prHash(s) % 9) * 100; };
  var nm = function (i) { return typeof sbName === 'function' ? sbName(seed, i) : 'Problema ' + (i + 1); };
  return {
    name: c, desc: '',
    rec: [{ tipo: 'Artículo', titulo: t.name + ': ' + c, fuente: 'cp-algorithms', url: 'https://cp-algorithms.com/' },
      { tipo: 'Blog', titulo: 'Tutorial de ' + c, fuente: 'Codeforces', url: 'https://codeforces.com/search?query=' + q },
      { tipo: 'Video', titulo: c + ' explicado paso a paso', fuente: 'YouTube', url: 'https://www.youtube.com/results?search_query=' + q },
      { tipo: 'Libro', titulo: 'Competitive Programmer’s Handbook', fuente: 'Antti Laaksonen, PDF', url: 'https://cses.fi/book/book.pdf' }],
    ese: [0, 1, 2].map(function (i) { return { plat: i === 1 ? 'Codeforces' : plat[(typeof sbHash === 'function' ? sbHash(seed + i) : prHash(seed + i)) % 2], nombre: nm(i), url: cfu, rating: rt(seed + 'e' + i) }; }),
    cf: [0, 1, 2, 3, 4].map(function (i) { return { plat: 'Codeforces', nombre: nm(10 + i), url: cfu, rating: rt(seed + 'c' + i) }; }),
    ext: [0, 1, 2, 3].map(function (i) { return { plat: plat[i], nombre: nm(20 + i), url: cfu, rating: rt(seed + 'x' + i) }; })
  };
}
function ctPublished(tid, k) { var t = ctTopic(tid); if (!t) return null; return ctPubAll()[tid + '/' + k] || ctDefault(t, k); }
function ctCurrent(tid, k) { return ctDraftAll()[tid + '/' + k] || ctPublished(tid, k); }
function ctSame(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function ctIsDraft(tid, k) { var d = ctDraftAll()[tid + '/' + k]; return !!d && !ctSame(d, ctPublished(tid, k)); }
function ctIsNew(tid, k) { var t = ctTopic(tid); return !!t && k >= ctCount(t, false); }
function ctPut(tid, k, data) {
  var all = ctDraftAll(), key = tid + '/' + k;
  if (!data.nuevo && ctSame(data, ctPublished(tid, k))) delete all[key]; else all[key] = data;
  ctSave('gpc:ct:borrador', all);
}
function ctPublish() {
  var key = CT.tid + '/' + CT.k, d = ctDraftAll()[key]; if (!d) return;
  d = JSON.parse(JSON.stringify(d)); delete d.nuevo;
  if (!d.name.trim()) { CT.err = 'El subtema necesita un nombre antes de publicarse.'; return ctRender(); }
  var pub = ctPubAll(); pub[key] = d; ctSave('gpc:ct:pub', pub);
  var dr = ctDraftAll(); delete dr[key]; ctSave('gpc:ct:borrador', dr);
  ctApply(); CT.form = null; CT.err = ''; ctRender(); ctToast('Publicaste "' + d.name + '". Los miembros ya lo ven.');
}
function ctDiscard() {
  var key = CT.tid + '/' + CT.k, dr = ctDraftAll(), wasNew = ctIsNew(CT.tid, CT.k);
  delete dr[key]; ctSave('gpc:ct:borrador', dr);
  if (wasNew) CT.k = Math.max(0, CT.k - 1);
  CT.form = null; CT.err = ''; ctRender(); ctToast('Descartaste el borrador.');
}
function ctToast(msg) {
  var t = document.getElementById('ct-toast');
  if (!t) { t = document.createElement('div'); t.id = 'ct-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 3200);
}

// --- vista del editor ---
function ctLvName() { return CT_LVS.filter(function (l) { return l[0] === CT.lv; })[0][1]; }
function ctLvTopics(slug) { var L = CT_LVS.filter(function (l) { return l[0] === slug; })[0]; return GPC.topics.filter(function (t) { return L[3].indexOf(t.level) >= 0; }); }
function ctEnsure() {
  var ts = ctLvTopics(CT.lv), t = CT.tid && ctTopic(CT.tid);
  if (!t || ts.indexOf(t) < 0) { t = ts[0]; CT.tid = t ? t.id : null; CT.k = 0; }
  if (t && CT.k >= ctCount(t, true)) CT.k = 0;
  if (t) CT.open[t.id] = true;
}
function ctTree() {
  var dr = ctDraftAll();
  return ctLvTopics(CT.lv).map(function (t) {
    var open = !!CT.open[t.id], n = ctCount(t, true), subs = '';
    if (open) {
      for (var k = 0; k < n; k++) {
        var cur = t.id === CT.tid && k === CT.k, d = dr[t.id + '/' + k], name = (d && d.name) || ctPublished(t.id, k).name, draft = ctIsDraft(t.id, k);
        subs += '<button type="button" class="ct-sub' + (cur ? ' on' : '') + '" data-ct-sel="' + t.id + '/' + k + '"' + (cur ? ' aria-current="true"' : '') + '><span>' + prEsc(name || 'Sin nombre') + '</span>' + (draft ? '<small>Borrador</small>' : '') + '</button>';
      }
      subs = '<div class="ct-subs">' + subs + '<button type="button" class="ct-addsub" data-ct-addsub="' + t.id + '">+ Agregar subtema</button></div>';
    }
    return '<div class="ct-top"><button type="button" class="ct-th' + (open ? ' open' : '') + '" data-ct-tog="' + t.id + '" aria-expanded="' + open + '"><span class="ct-gl" aria-hidden="true">' + prEsc(t.glyph || '') + '</span><b>' + prEsc(t.name) + '</b><small>' + n + '</small>' + PR_IC.chev + '</button>' + subs + '</div>';
  }).join('');
}
function ctRowMeta(sec, r) { return sec === 'rec' ? prEsc(r.fuente || '') : (r.rating ? r.rating : ''); }
function ctForm(sec, r, isNew) {
  r = r || {};
  var sel = function (id, opts, v) { return '<select id="' + id + '" class="pr-in" data-ctf="' + id.slice(3) + '">' + opts.map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>'; };
  var inp = function (id, label, v, type, ph) { return '<div class="ct-fl"><label for="' + id + '">' + label + '</label><input id="' + id + '" class="pr-in" data-ctf="' + id.slice(3) + '" type="' + (type || 'text') + '" value="' + prEsc(v == null ? '' : v) + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '></div>'; };
  var f = sec === 'rec'
    ? inp('ctfurl', 'Enlace', r.url, 'url', 'https://') + '<div class="ct-fl"><label for="ctftipo">Tipo</label>' + sel('ctftipo', Object.keys(CT_TYPES), r.tipo || 'Artículo') + '</div>' + inp('ctftitulo', 'Título', r.titulo) + inp('ctffuente', 'Fuente', r.fuente, 'text', 'Ej. Codeforces')
    : inp('ctfurl', 'Enlace del problema', r.url, 'url', 'https://') + '<div class="ct-fl"><label for="ctfplat">Plataforma</label>' + sel('ctfplat', CT_PLATS, r.plat || (sec === 'cf' ? 'Codeforces' : 'CSES')) + '</div>' + inp('ctfnombre', 'Nombre', r.nombre) + inp('ctfrating', 'Rating', r.rating, 'number', 'Ej. 1200');
  return '<div class="ct-form" role="group" aria-label="' + (isNew ? 'Agregar' : 'Editar') + '"><div class="ct-fgrid">' + f + '</div>' + (CT.err ? '<p class="ct-err" role="alert">' + prEsc(CT.err) + '</p>' : '') +
    '<div class="ct-facts"><button type="button" class="pr-btn ghost" data-ct-cancel>Cancelar</button><button type="button" class="pr-btn dark" data-ct-save>' + (isNew ? 'Agregar' : 'Guardar') + '</button></div></div>';
}
function ctSection(sec, d) {
  var S = CT_SECS.filter(function (s) { return s[0] === sec; })[0], list = d[sec] || [];
  var rows = list.map(function (r, i) {
    if (CT.form && CT.form.sec === sec && CT.form.i === i) return ctForm(sec, CT.form.vals || r, false);
    var tag = sec === 'rec' ? r.tipo : r.plat, col = sec === 'rec' ? (CT_TYPES[r.tipo] || '#45405F') : (CT_PINK[r.plat] || '#45405F');
    var name = sec === 'rec' ? r.titulo : r.nombre;
    return '<div class="ct-row" draggable="true" data-ct-row="' + sec + ':' + i + '"><button type="button" class="ct-grip" data-ct-grip="' + sec + ':' + i + '" aria-label="Mover ' + prEsc(name) + '. Arrastra o usa las flechas arriba y abajo">' + PR_IC.grip + '</button>' +
      '<span class="ct-tag" style="color:' + col + '"><i style="background:' + col + '"></i>' + prEsc(tag) + '</span>' +
      '<span class="ct-name"><b>' + prEsc(name) + '</b><a href="' + prEsc(r.url) + '" target="_blank" rel="noopener">' + prEsc(String(r.url || '').replace(/^https?:\/\/(www\.)?/, '')) + '</a></span>' +
      '<span class="ct-meta">' + ctRowMeta(sec, r) + '</span>' +
      '<button type="button" class="pr-btn sm" data-ct-edit="' + sec + ':' + i + '">Editar</button><button type="button" class="ct-del" data-ct-del="' + sec + ':' + i + '" aria-label="Quitar ' + prEsc(name) + '">' + PR_IC.del + '</button></div>';
  }).join('');
  var adding = CT.form && CT.form.sec === sec && CT.form.i === -1;
  return '<section class="pr-card ct-sec"><h2 class="pr-dsp">' + S[1] + '</h2>' + (rows || (adding ? '' : '<p class="pr-empty">Todavía no hay nada en esta sección.</p>')) +
    (adding ? ctForm(sec, CT.form.vals || null, true) : '<button type="button" class="ct-add" data-ct-add="' + sec + '">' + S[2] + '</button>') + '</section>';
}
function ctMain() {
  if (!CT.tid) return '<section class="pr-card"><p class="pr-empty">Este nivel todavía no tiene temas.</p></section>';
  var d = ctCurrent(CT.tid, CT.k), draft = ctIsDraft(CT.tid, CT.k) || ctIsNew(CT.tid, CT.k), isNew = ctIsNew(CT.tid, CT.k);
  return '<section class="pr-card ct-head"><div class="ct-hrow"><div><h2 class="pr-dsp" id="ct-title">' + prEsc(d.name || 'Sin nombre') + '</h2>' +
      '<span class="ct-st' + (draft ? ' dr' : '') + '"><i></i>' + (draft ? 'Borrador' : 'Publicado') + '</span></div>' +
      '<div class="ct-acts">' + (draft ? '<button type="button" class="pr-btn ghost" data-ct-discard>Descartar borrador</button>' : '') +
      (isNew ? '' : '<a class="pr-btn" href="#/sub/' + CT.tid + '/' + CT.k + '">Ver como alumno</a>') +
      '<button type="button" class="pr-btn dark" data-ct-pub' + (draft ? '' : ' disabled') + '>Publicar cambios</button></div></div>' +
      (CT.err && !CT.form ? '<p class="ct-err" role="alert">' + prEsc(CT.err) + '</p>' : '') +
      '<div class="ct-fields"><div class="ct-fl"><label for="ct-name">Nombre del subtema</label><input id="ct-name" class="pr-in" value="' + prEsc(d.name) + '" data-ct-name></div>' +
      '<div class="ct-fl wide"><label for="ct-desc">Descripción para el alumno</label><textarea id="ct-desc" class="pr-in" rows="2" data-ct-desc placeholder="Una o dos líneas sobre qué se aprende aquí">' + prEsc(d.desc || '') + '</textarea></div></div></section>' +
    CT_SECS.map(function (s) { return ctSection(s[0], d); }).join('');
}
function viewContenido() {
  ctEnsure();
  return '<div class="pr-page">' + prHero('Contenido', 'contenido', prTabs(CT_LVS.map(function (l) { return [l[0], l[1], l[2]]; }), CT.lv, 'data-ct-lv', 'Nivel'), true) +
    '<div class="ct-cols"><aside class="pr-card ct-tree" aria-label="Temas y subtemas"><div id="ct-tree">' + ctTree() + '</div><button type="button" class="ct-addtema" data-ct-addtema>+ Agregar tema a <span id="ct-lvname">' + ctLvName() + '</span></button></aside><main class="ct-main" id="ct-main">' + ctMain() + '</main></div></div>';
}
function ctRender(focusSel) {
  ctEnsure();
  var tabs = document.querySelector('.pr-hero .pr-tabs'), tr = document.getElementById('ct-tree'), m = document.getElementById('ct-main');
  if (!m) return;
  if (tabs) tabs.outerHTML = prTabs(CT_LVS.map(function (l) { return [l[0], l[1], l[2]]; }), CT.lv, 'data-ct-lv', 'Nivel');
  tr.innerHTML = ctTree(); m.innerHTML = ctMain();
  var ln = document.getElementById('ct-lvname'); if (ln) ln.textContent = ctLvName();
  if (focusSel) { var f = document.querySelector(focusSel); if (f) f.focus(); }
}
// lee el enlace pegado y completa plataforma, tipo, fuente o nombre (en la versión real, la API de Codeforces trae nombre y rating)
function ctSniff(url) {
  var u = String(url || '').toLowerCase(), o = {};
  if (/codeforces\.com\/blog/.test(u)) { o.tipo = 'Blog'; o.fuente = 'Codeforces'; }
  else if (/youtube\.com|youtu\.be/.test(u)) { o.tipo = 'Video'; o.fuente = 'YouTube'; }
  else if (/\.pdf($|\?)/.test(u)) o.tipo = 'Libro';
  else if (/cp-algorithms/.test(u)) { o.tipo = 'Artículo'; o.fuente = 'cp-algorithms'; }
  if (/codeforces\.com/.test(u)) { o.plat = 'Codeforces'; var m = u.match(/(?:problemset\/problem|contest)\/(\d+)\/(?:problem\/)?([a-z]\d?)/); if (m) o.nombre = 'Codeforces ' + m[1] + m[2].toUpperCase(); }
  else if (/cses\.fi/.test(u)) { o.plat = 'CSES'; var c = u.match(/task\/(\d+)/); if (c) o.nombre = 'CSES ' + c[1]; }
  else if (/atcoder\.jp/.test(u)) { o.plat = 'AtCoder'; var a = u.match(/tasks\/([a-z0-9_]+)/); if (a) o.nombre = a[1].toUpperCase().replace(/_/g, ' '); }
  else if (/vjudge/.test(u)) o.plat = 'vjudge';
  else if (/spoj/.test(u)) o.plat = 'SPOJ';
  if (!o.fuente) { var h = u.match(/^https?:\/\/(?:www\.)?([^\/]+)/); if (h) o.fuente = h[1]; }
  return o;
}
function ctFormRead() {
  var o = {}; document.querySelectorAll('#ct-main [data-ctf]').forEach(function (el) { o[el.dataset.ctf] = el.value.trim(); }); return o;
}
function ctSaveForm() {
  var f = ctFormRead(), sec = CT.form.sec, d = JSON.parse(JSON.stringify(ctCurrent(CT.tid, CT.k)));
  CT.form.vals = f; // si falta algo, el formulario vuelve con lo que ya se escribió
  if (!/^https?:\/\/\S+\.\S+/.test(f.url || '')) { CT.err = 'Pega un enlace completo que empiece con https://'; return ctRender('#ctfurl'); }
  var row;
  if (sec === 'rec') { if (!f.titulo) { CT.err = 'El recurso necesita un título.'; return ctRender('#ctftitulo'); } row = { tipo: f.tipo, titulo: f.titulo, fuente: f.fuente, url: f.url }; }
  else {
    if (!f.nombre) { CT.err = 'El problema necesita un nombre.'; return ctRender('#ctfnombre'); }
    var r = f.rating ? Math.round(+f.rating) : '';
    if (f.rating && (!(r >= 0) || r > 4000)) { CT.err = 'El rating debe ser un número entre 0 y 4000.'; return ctRender('#ctfrating'); }
    row = { plat: f.plat, nombre: f.nombre, url: f.url, rating: r };
  }
  d[sec] = d[sec] || [];
  if (CT.form.i < 0) d[sec].push(row); else d[sec][CT.form.i] = row;
  ctPut(CT.tid, CT.k, d); CT.form = null; CT.err = ''; ctRender();
}
function ctEnter() { prSync(); }
function prEnter() { prSync(); }
function pnEnter() { prSync(); }

/* ---------- eventos ---------- */
document.addEventListener('click', function (e) {
  if (!document.querySelector('.pr-page')) return;
  var b;
  // panel
  if ((b = e.target.closest('[data-pr-per]'))) { PR.per = b.dataset.prPer; PR.off = 0; return prRender(); }
  if ((b = e.target.closest('[data-pr-off]'))) { if (b.disabled) return; PR.off = Math.max(0, PR.off + (+b.dataset.prOff)); return prRender('[data-pr-off="' + b.dataset.prOff + '"]:not([disabled])'); }
  if ((b = e.target.closest('[data-pr-lv]'))) { PR.lv = b.dataset.prLv; return prRender(); }
  if (e.target.closest('[data-pr-csv]')) return prCsv();
  // contenido
  if ((b = e.target.closest('[data-ct-lv]'))) { CT.lv = b.dataset.ctLv; CT.tid = null; CT.form = null; CT.err = ''; return ctRender(); }
  if ((b = e.target.closest('[data-ct-tog]'))) { var id = b.dataset.ctTog; CT.open[id] = !CT.open[id]; return ctRender('[data-ct-tog="' + id + '"]'); }
  if ((b = e.target.closest('[data-ct-sel]'))) { var p = b.dataset.ctSel.split('/'); CT.tid = p[0]; CT.k = +p[1]; CT.form = null; CT.err = ''; return ctRender('[data-ct-sel="' + b.dataset.ctSel + '"]'); }
  if ((b = e.target.closest('[data-ct-addsub]'))) {
    var t = ctTopic(b.dataset.ctAddsub), k = ctCount(t, true);
    ctPut(t.id, k, { name: 'Nuevo subtema', desc: '', rec: [], ese: [], cf: [], ext: [], nuevo: true });
    CT.tid = t.id; CT.k = k; CT.form = null; CT.err = ''; ctRender('#ct-name');
    var n = document.getElementById('ct-name'); if (n) n.select();
    return;
  }
  if ((b = e.target.closest('[data-ct-add]'))) { CT.form = { sec: b.dataset.ctAdd, i: -1 }; CT.err = ''; return ctRender('#ctfurl'); }
  if ((b = e.target.closest('[data-ct-edit]'))) { var q = b.dataset.ctEdit.split(':'); CT.form = { sec: q[0], i: +q[1] }; CT.err = ''; return ctRender('#ctfurl'); }
  if (e.target.closest('[data-ct-cancel]')) { var s0 = CT.form && CT.form.sec; CT.form = null; CT.err = ''; return ctRender(s0 ? '[data-ct-add="' + s0 + '"]' : null); }
  if (e.target.closest('[data-ct-save]')) return ctSaveForm();
  if ((b = e.target.closest('[data-ct-del]'))) {
    var x = b.dataset.ctDel.split(':'), d = JSON.parse(JSON.stringify(ctCurrent(CT.tid, CT.k))), gone = d[x[0]].splice(+x[1], 1)[0];
    ctPut(CT.tid, CT.k, d); CT.form = null; ctRender('[data-ct-add="' + x[0] + '"]');
    ctToast('Quitaste "' + (gone.titulo || gone.nombre) + '". Si fue un error, descarta el borrador.');
    return;
  }
  if (e.target.closest('[data-ct-addtema]')) return ctToast('Agregar temas estará disponible pronto. Por ahora puedes agregar subtemas.');
  if (e.target.closest('[data-ct-pub]')) return ctPublish();
  if (e.target.closest('[data-ct-discard]')) return ctDiscard();
});
document.addEventListener('input', function (e) {
  if (!document.querySelector('.pr-page')) return;
  var el = e.target;
  if (el.matches('[data-pr-q]')) { PR.q = el.value; var tb = document.getElementById('pr-tbl'); if (tb) tb.innerHTML = prTable(prRows()); return; }
  if (el.matches('[data-ct-name]') || el.matches('[data-ct-desc]')) {
    var d = JSON.parse(JSON.stringify(ctCurrent(CT.tid, CT.k)));
    if (el.matches('[data-ct-name]')) d.name = el.value; else d.desc = el.value;
    ctPut(CT.tid, CT.k, d);
    var h = document.getElementById('ct-title'); if (h) h.textContent = d.name || 'Sin nombre';
    var tr = document.getElementById('ct-tree'); if (tr) tr.innerHTML = ctTree();
    var draft = ctIsDraft(CT.tid, CT.k) || ctIsNew(CT.tid, CT.k), st = document.querySelector('#ct-main .ct-st'), pb = document.querySelector('[data-ct-pub]');
    if (st) { st.classList.toggle('dr', draft); st.lastChild.textContent = draft ? 'Borrador' : 'Publicado'; }
    if (pb) pb.disabled = !draft;
  }
});
// mueve una fila dentro de su sección y deja el foco en su asa
function ctMove(sec, i, j) {
  var d = JSON.parse(JSON.stringify(ctCurrent(CT.tid, CT.k))), L = d[sec];
  if (!L || i === j || j < 0 || j >= L.length) return;
  L.splice(j, 0, L.splice(i, 1)[0]); ctPut(CT.tid, CT.k, d); CT.form = null;
  ctRender('[data-ct-grip="' + sec + ':' + j + '"]');
}
var CT_DRAG = null;
document.addEventListener('dragstart', function (e) {
  var r = e.target.closest && e.target.closest('[data-ct-row]'); if (!r) return;
  var p = r.dataset.ctRow.split(':'); CT_DRAG = { sec: p[0], i: +p[1] };
  e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', r.dataset.ctRow); } catch (x) {}
  setTimeout(function () { r.classList.add('drag'); }, 0);
});
document.addEventListener('dragover', function (e) {
  if (!CT_DRAG) return;
  var r = e.target.closest && e.target.closest('[data-ct-row]'); if (!r || r.dataset.ctRow.split(':')[0] !== CT_DRAG.sec) return;
  e.preventDefault(); e.dataTransfer.dropEffect = 'move';
  var box = r.getBoundingClientRect(), below = e.clientY > box.top + box.height / 2;
  document.querySelectorAll('.ct-row.over-t,.ct-row.over-b').forEach(function (x) { x.classList.remove('over-t', 'over-b'); });
  r.classList.add(below ? 'over-b' : 'over-t');
});
document.addEventListener('drop', function (e) {
  if (!CT_DRAG) return;
  var r = e.target.closest && e.target.closest('[data-ct-row]'), drag = CT_DRAG; CT_DRAG = null;
  if (!r) return; e.preventDefault();
  var p = r.dataset.ctRow.split(':'); if (p[0] !== drag.sec) return;
  var box = r.getBoundingClientRect(), to = +p[1] + (e.clientY > box.top + box.height / 2 ? 1 : 0);
  if (to > drag.i) to--;
  if (to === drag.i) return ctRender();
  ctMove(drag.sec, drag.i, to);
});
document.addEventListener('dragend', function () {
  CT_DRAG = null;
  document.querySelectorAll('.ct-row.drag,.ct-row.over-t,.ct-row.over-b').forEach(function (x) { x.classList.remove('drag', 'over-t', 'over-b'); });
});
document.addEventListener('keydown', function (e) {
  var g = e.target.closest && e.target.closest('[data-ct-grip]'); if (!g || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
  e.preventDefault(); var p = g.dataset.ctGrip.split(':'); ctMove(p[0], +p[1], +p[1] + (e.key === 'ArrowUp' ? -1 : 1));
});
document.addEventListener('change', function (e) {
  if (!e.target.matches || !e.target.matches('#ctfurl')) return;
  var o = ctSniff(e.target.value);
  ['tipo', 'plat', 'fuente', 'nombre'].forEach(function (k) {
    var f = document.getElementById('ctf' + k); if (!f || o[k] == null) return;
    if (f.tagName === 'SELECT' || !f.value.trim()) f.value = o[k];
  });
});
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' || !e.target.matches || !e.target.matches('#ct-main [data-ctf]')) return;
  e.preventDefault(); ctSaveForm();
});

ctApply();

/* =====================================================================
   LOGROS: editar (origen, condición para programar) y entregar a mano
   Provisional: los cambios viven en este navegador. Los logros automáticos no se calculan aquí;
   la "condición para programar" es la nota para quien los implemente en la versión real.
   ===================================================================== */
var LG = { f: 'todos', sel: null, form: null, pick: false, gsel: null, give: {}, q: '' };
var LG_SRC = { cf: ['Codeforces', '#1F5BA8', 'Se calcula con envíos, rating y contests de Codeforces.'], web: ['La página', '#0B5D55', 'Duelos, simulaciones, problema del día, niveles y ranking del GPC.'], prof: ['El profesor', '#8A4A00', 'No se calcula: se entrega desde Entregar a mano.'] };
var LG_DEF = {
  web: ['pan', 'simulacro', 'fin-tutorial', 'grandes-ligas', 'david', 'expert-dia', 'elegidos', 'primero'],
  prof: ['empieza', 'icpc', 'monas']
};
var LG_SEED = {
  icpc: [['vannana', '2026-11-03'], ['adws', '2026-11-03'], ['div4_enjoyer', '2026-11-03']],
  empieza: ['div4_enjoyer', 'SirNathaN', 'ghostrider101218', 'Jean_Pool', 'adws', 'Chatito17', '_matjavi_', 'vannana', 'AleeAsto', 'zayd.ayasta.dos', 'lu_mendoza', 'valeq', 'brunoUPC', 'dieguito_ac'].map(function (h, i) { return [h, i < 8 ? '2026-03-12' : '2026-08-20']; })
};
var LG_MTN = '<path d="M0 300 L0 190 L160 150 L280 170 L420 110 L520 150 L660 125 L760 160 L880 100 L960 60 L1040 95 L1180 140 L1320 120 L1440 160 L1440 300Z" fill="#E2D9FA"/><path d="M960 60 L996 86 L978 82 L960 96 L942 82 L922 86Z M420 110 L446 128 L432 125 L420 134 L408 125 L394 128Z" fill="#fff" opacity=".9"/><path d="M0 300 L0 225 L200 200 L380 225 L560 195 L760 222 L940 198 L1120 224 L1300 200 L1440 215 L1440 300Z" fill="#CFC2F5"/><path d="M0 300 L0 256 L260 246 L520 260 L780 248 L1040 260 L1300 246 L1440 256 L1440 300Z" fill="#BEADEF"/>';
PR_MTN.logros = LG_MTN;

function lgArr(k) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return Array.isArray(v) ? v : null; } catch (e) { return null; } }
function lgBase() { if (!GPC._achBase) GPC._achBase = GPC.achievements.slice(); return GPC._achBase; }
function lgEdits() { return ctLoad('gpc:lg:edit'); }
function lgNews() { return lgArr('gpc:lg:nuevos') || []; }
function lgDefSrc(id) { return LG_DEF.prof.indexOf(id) >= 0 ? 'prof' : LG_DEF.web.indexOf(id) >= 0 ? 'web' : 'cf'; }
function lgAll() {
  var ed = lgEdits();
  return lgBase().map(function (a) {
    var e = ed[a.id] || {}, src = e.src || lgDefSrc(a.id);
    return { id: a.id, name: e.name != null ? e.name : a.name, desc: e.desc != null ? e.desc : a.desc, src: src, cond: e.cond != null ? e.cond : (src === 'prof' ? '' : a.desc), prog: !!e.prog, activo: e.activo !== false, art: e.art || a.id, tier: a.tier };
  }).concat(lgNews().map(function (n) {
    return { id: n.id, name: n.name, desc: n.desc, src: n.src, cond: n.cond || '', prog: !!n.prog, activo: n.activo !== false, art: n.art || 'hola', tier: '', isNew: true };
  }));
}
function lgItem(id) { return lgAll().filter(function (x) { return x.id === id; })[0]; }
function lgSave(it) {
  var row = { name: it.name, desc: it.desc, src: it.src, cond: it.cond, prog: !!it.prog, activo: it.activo !== false, art: it.art };
  if (it.isNew) { var L = lgNews().map(function (n) { if (n.id !== it.id) return n; row.id = it.id; return row; }); ctSave('gpc:lg:nuevos', L); }
  else { var ed = lgEdits(); ed[it.id] = row; ctSave('gpc:lg:edit', ed); }
  lgApply();
}
function lgGiven() {
  var v = ctLoad('gpc:lg:entregas');
  if (!localStorage.getItem('gpc:lg:entregas')) { Object.keys(LG_SEED).forEach(function (k) { v[k] = LG_SEED[k].map(function (x) { return { h: x[0], at: x[1], msg: '' }; }); }); }
  return v;
}
function lgHolders(it) {
  if (it.src === 'prof') return (lgGiven()[it.id] || []).length;
  if (it.isNew) return 0;
  var pct = { comun: 85, raro: 45, epico: 18, leyenda: 6 }[it.tier] || 0;
  return RK_MEM.filter(function (m) { return prHash(it.id + m[0]) % 100 < pct; }).length;
}
function lgDate(iso) { var p = String(iso).split('-'); return +p[2] + ' de ' + PR_MES[+p[1] - 1]; }
function lgToday() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
// lo editado llega a la página Logros: nombres, descripciones, ilustraciones, logros nuevos y entregas a mano
function lgApply() {
  // el usuario de prueba es Jean_Pool (data.js lo crea como tu_handle y index.html lo renombra después)
  var given = lgGiven(), me = typeof RK_ME !== 'undefined' ? RK_ME : GPC.me.handle, base = {}, prev = {};
  lgBase().forEach(function (a) { base[a.id] = a; });
  (GPC.achievements || []).forEach(function (a) { prev[a.id] = a; });
  GPC.achievements = lgAll().filter(function (it) { return it.activo; }).map(function (it) {
    var b = base[it.id] || {}, p = prev[it.id] || b, g = (given[it.id] || []).filter(function (x) { return x.h === me; })[0];
    var mine = it.src === 'prof' ? !!g : !!p.mine;
    return { id: it.id, name: it.name, desc: it.desc, tier: b.tier || 'raro', icon: b.icon || '', color: b.color || '#8B5CF6', artId: it.art, mine: mine, date: mine ? (g ? lgDate(g.at) : p.date) : null };
  });
}

// --- vistas ---
function lgHero(tab) {
  var t = function (href, label, on) { return '<a href="' + href + '"' + (on ? ' aria-current="page"' : '') + '>' + label + '</a>'; };
  return prHero('Logros', 'logros', '<nav class="pr-tabs" aria-label="Vista de logros">' + t('#/panel/logros', 'Editar logros', tab === 'editar') + t('#/panel/logros/entregar', 'Entregar a mano', tab === 'entregar') + '</nav>', true);
}
function lgCard(it) {
  var s = LG_SRC[it.src], on = it.id === LG.sel;
  return '<button type="button" class="lg-card' + (on ? ' on' : '') + (it.activo ? '' : ' off') + '" data-lg-sel="' + it.id + '" aria-pressed="' + on + '"><span class="lg-art">' + (LOGRO_ART[it.art] || '') + '</span>' +
    '<span class="lg-bd"><span class="lg-meta"><span class="lg-src" style="color:' + s[1] + '">' + s[0] + '</span>' + (it.src !== 'prof' && !it.prog ? '<span class="lg-pend">Falta programar</span>' : '') + (it.activo ? '' : '<span class="lg-offt">Desactivado</span>') + '</span>' +
    '<b>' + prEsc(it.name || 'Sin nombre') + '</b><span class="lg-de">' + prEsc(it.desc) + '</span><span class="lg-has">Lo tienen ' + lgHolders(it) + ' de ' + RK_MEM.length + '</span></span></button>';
}
function lgGrid() {
  var all = lgAll(), n = function (k) { return all.filter(function (x) { return k === 'todos' || x.src === k; }).length; };
  var f = [['todos', 'Todos'], ['cf', 'Codeforces'], ['web', 'La página'], ['prof', 'El profesor']].map(function (x) {
    return '<button type="button" class="lg-fb" data-lg-f="' + x[0] + '" aria-pressed="' + (LG.f === x[0]) + '">' + x[1] + '<span>' + n(x[0]) + '</span></button>';
  }).join('');
  return '<div class="lg-filt" role="group" aria-label="Cómo se obtiene">' + f + '</div>' +
    '<button type="button" class="lg-new" data-lg-new><span aria-hidden="true">+</span><b>Nuevo logro</b></button>' +
    all.filter(function (x) { return LG.f === 'todos' || x.src === LG.f; }).map(lgCard).join('');
}
function lgEditor() {
  var it = LG.form; if (!it) return '<p class="pr-empty">Elige un logro para editarlo.</p>';
  var modes = Object.keys(LG_SRC).map(function (k) {
    var on = it.src === k;
    return '<label class="lg-mode' + (on ? ' on' : '') + '"><input type="radio" name="lg-src" value="' + k + '"' + (on ? ' checked' : '') + ' data-lg-src><span><b>' + (k === 'cf' ? 'Automático con Codeforces' : k === 'web' ? 'Automático con la página' : 'Lo entrega el profesor') + '</b><small>' + LG_SRC[k][2] + '</small></span></label>';
  }).join('');
  var arts = LG.pick ? '<div class="lg-picker" role="group" aria-label="Elige una ilustración">' + Object.keys(LOGRO_ART).map(function (k) {
    return '<button type="button" class="lg-pk' + (k === it.art ? ' on' : '') + '" data-lg-art="' + k + '" aria-label="Ilustración ' + k + '" aria-pressed="' + (k === it.art) + '">' + LOGRO_ART[k] + '</button>';
  }).join('') + '</div>' : '';
  var cond = it.src === 'prof'
    ? '<p class="lg-note">Este logro se entrega desde <a href="#/panel/logros/entregar" data-lg-who="' + it.id + '">Entregar a mano</a>.</p>'
    : '<div class="lg-cond"><label for="lg-cond">Condición para programar</label><textarea id="lg-cond" class="pr-in" rows="2" data-lg-in="cond" placeholder="Ej. Ganar más de 100 de rating en un solo contest">' + prEsc(it.cond) + '</textarea>' +
      '<span id="lg-codel">Estado en el código</span><div class="lg-seg" role="radiogroup" aria-labelledby="lg-codel"><button type="button" role="radio" aria-checked="' + !it.prog + '" data-lg-prog="0">Falta programar</button><button type="button" role="radio" aria-checked="' + !!it.prog + '" data-lg-prog="1">Programado</button></div>' +
      '<small>La página no calcula esto sola: esta nota es el recordatorio para quien lo programe.</small></div>';
  var h = lgHolders(it);
  return '<div class="lg-edh"><h2 class="pr-dsp">' + (it.isNew && !lgItem(it.id).desc && it.name === 'Nuevo logro' ? 'Nuevo logro' : 'Editar logro') + '</h2><span class="lg-chip' + (it.activo ? '' : ' off') + '">' + (it.activo ? 'Activo' : 'Desactivado') + '</span></div>' +
    '<div class="lg-artbox"><span class="lg-art">' + (LOGRO_ART[it.art] || '') + '</span><button type="button" class="pr-btn sm" data-lg-pick aria-expanded="' + LG.pick + '">' + (LG.pick ? 'Cerrar ilustraciones' : 'Cambiar ilustración') + '</button></div>' + arts +
    '<div class="ct-fl"><label for="lg-name">Nombre</label><input id="lg-name" class="pr-in" value="' + prEsc(it.name) + '" data-lg-in="name"></div>' +
    '<div class="ct-fl"><label for="lg-desc">Descripción</label><textarea id="lg-desc" class="pr-in" rows="2" data-lg-in="desc">' + prEsc(it.desc) + '</textarea></div>' +
    '<fieldset class="lg-modes"><legend>Cómo se obtiene</legend>' + modes + '</fieldset>' + cond +
    '<p class="lg-holders">Lo tienen <b>' + h + ' de ' + RK_MEM.length + '</b> miembros.' + (it.src === 'prof' ? ' <a href="#/panel/logros/entregar" data-lg-who="' + it.id + '">Ver quiénes</a>' : '') + '</p>' +
    (LG.err ? '<p class="ct-err" role="alert">' + prEsc(LG.err) + '</p>' : '') +
    '<div class="lg-acts"><button type="button" class="pr-btn ghost lg-danger" data-lg-act>' + (it.activo ? 'Desactivar' : 'Activar') + '</button><button type="button" class="pr-btn dark" data-lg-save>Guardar cambios</button></div>';
}
function lgEnsure() {
  var all = lgAll();
  if (!LG.sel || !lgItem(LG.sel)) LG.sel = all[0] && all[0].id;
  if (!LG.form || LG.form.id !== LG.sel) { LG.form = JSON.parse(JSON.stringify(lgItem(LG.sel))); LG.pick = false; LG.err = ''; }
}
function viewLogrosEd(tab) {
  if (tab === 'entregar') return viewLogrosGive();
  lgEnsure();
  return '<div class="pr-page">' + lgHero('editar') + '<div class="ct-cols lg-cols"><main class="lg-grid" id="lg-grid">' + lgGrid() + '</main><aside class="pr-card lg-ed" id="lg-ed" aria-label="Editar logro">' + lgEditor() + '</aside></div></div>';
}
function lgRender(what, focusSel) {
  var g = document.getElementById('lg-grid'), e = document.getElementById('lg-ed');
  if (g && what !== 'ed') g.innerHTML = lgGrid();
  if (e && what !== 'grid') e.innerHTML = lgEditor();
  if (focusSel) { var f = document.querySelector(focusSel); if (f) f.focus(); }
}

// --- entregar a mano ---
function lgManual() { return lgAll().filter(function (x) { return x.src === 'prof' && x.activo; }); }
function lgGiveBody() {
  var man = lgManual();
  if (!LG.gsel || !man.some(function (x) { return x.id === LG.gsel; })) LG.gsel = man[0] && man[0].id;
  var it = LG.gsel && lgItem(LG.gsel), given = lgGiven(), has = {};
  (it ? given[it.id] || [] : []).forEach(function (x) { has[x.h] = x; });
  var list = '<h2 class="pr-dsp">Se entregan a mano</h2>' + man.map(function (m) {
    var on = m.id === LG.gsel;
    return '<button type="button" class="lg-mi' + (on ? ' on' : '') + '" data-lg-g="' + m.id + '"' + (on ? ' aria-current="true"' : '') + '><span class="lg-art">' + (LOGRO_ART[m.art] || '') + '</span><span><b>' + prEsc(m.name) + '</b><small>Lo tienen ' + lgHolders(m) + '</small></span></button>';
  }).join('') + '<button type="button" class="ct-addsub" data-lg-newman>+ Nuevo logro a mano</button><p class="lg-note">Aquí están solo los logros que entrega el profesor. Los de Codeforces y los de la página se entregan solos.</p>';
  if (!it) return '<aside class="pr-card lg-man">' + list + '</aside><main class="ct-main"><section class="pr-card"><p class="pr-empty">Todavía no hay logros que se entreguen a mano.</p></section></main>';
  var q = LG.q.trim().toLowerCase(), sel = Object.keys(LG.give).filter(function (h) { return LG.give[h] && !has[h]; });
  var people = RK_MEM.filter(function (m) { return !q || m[0].toLowerCase().indexOf(q) >= 0; }).map(function (m) {
    var h = m[0], g = has[h], on = !!LG.give[h] && !g, c = PR_LV[m[2]];
    return '<label class="lg-p' + (g ? ' has' : '') + (on ? ' sel' : '') + '"><input type="checkbox" data-lg-give="' + prEsc(h) + '"' + (g || on ? ' checked' : '') + (g ? ' disabled' : '') + '><span class="pr-av" style="background:' + c[0] + ';color:' + c[1] + '" aria-hidden="true">' + prEsc(h.replace(/^_+/, '').charAt(0).toUpperCase()) + '</span><span><b>' + prEsc(h) + '</b><small>' + (g ? 'Lo tiene desde el ' + lgDate(g.at) : m[2]) + '</small></span></label>';
  }).join('') || '<p class="pr-empty">Ningún miembro coincide con "' + prEsc(LG.q) + '".</p>';
  var log = [];
  man.forEach(function (m) { (given[m.id] || []).forEach(function (x, i) { log.push({ id: m.id, name: m.name, h: x.h, at: x.at, i: i }); }); });
  log.sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : 0; });
  var names = sel.length > 3 ? sel.slice(0, 3).join(', ') + ' y ' + (sel.length - 3) + ' más' : sel.length > 1 ? sel.slice(0, -1).join(', ') + ' y ' + sel[sel.length - 1] : sel[0] || '';
  return '<aside class="pr-card lg-man">' + list + '</aside><main class="ct-main">' +
    '<section class="pr-card lg-prev"><span class="lg-art">' + (LOGRO_ART[it.art] || '') + '</span><div><span class="lg-src" style="color:#8A4A00">Lo entrega el profesor</span><h2 class="pr-dsp">' + prEsc(it.name) + '</h2><p>' + prEsc(it.desc) + '</p><a href="#/panel/logros" data-lg-edit="' + it.id + '">Editar este logro</a></div></section>' +
    '<section class="pr-card"><div class="pr-th"><h2 class="pr-dsp">¿A quién se lo entregas?</h2><div class="pr-tools"><label class="pr-sr" for="lg-q">Buscar miembro</label><input id="lg-q" class="pr-in" type="search" placeholder="Buscar por handle" value="' + prEsc(LG.q) + '" data-lg-q></div></div>' +
      '<div class="lg-people" id="lg-people">' + people + '</div>' +
      '<div class="ct-fl"><label for="lg-msg">Mensaje para quien lo recibe (opcional)</label><textarea id="lg-msg" class="pr-in" rows="2" data-lg-msg>' + prEsc(LG.msg || '') + '</textarea></div>' +
      '<div class="lg-bar"><span>' + (sel.length ? sel.length + (sel.length === 1 ? ' miembro seleccionado: ' : ' miembros seleccionados: ') + prEsc(names) : 'Marca a quién se lo entregas.') + '</span><button type="button" data-lg-give-go' + (sel.length ? '' : ' disabled') + '>Entregar' + (sel.length ? ' a ' + sel.length + (sel.length === 1 ? ' miembro' : ' miembros') : '') + '</button></div></section>' +
    '<section class="pr-card"><h2 class="pr-dsp">Últimas entregas</h2>' + (log.length ? log.slice(0, 8).map(function (l) {
      return '<div class="lg-log"><b>' + prEsc(l.h) + '</b><span>' + prEsc(l.name) + '</span><small>' + lgDate(l.at) + '</small><button type="button" class="pr-btn ghost sm lg-danger" data-lg-undo="' + l.id + ':' + l.i + '">Quitar</button></div>';
    }).join('') : '<p class="pr-empty">Todavía no entregaste ningún logro.</p>') + '</section></main>';
}
function viewLogrosGive() {
  return '<div class="pr-page">' + lgHero('entregar') + '<div class="ct-cols lg-cols" id="lg-give">' + lgGiveBody() + '</div></div>';
}
function lgGiveRender(focusSel) { var b = document.getElementById('lg-give'); if (b) b.innerHTML = lgGiveBody(); if (focusSel) { var f = document.querySelector(focusSel); if (f) f.focus(); } }

// --- eventos de logros ---
document.addEventListener('click', function (e) {
  if (!document.querySelector('.pr-page')) return;
  var b;
  if ((b = e.target.closest('[data-lg-f]'))) { LG.f = b.dataset.lgF; return lgRender('grid', '[data-lg-f="' + LG.f + '"]'); }
  if ((b = e.target.closest('[data-lg-sel]'))) { LG.sel = b.dataset.lgSel; LG.form = null; lgEnsure(); lgRender(null, '#lg-name'); return; }
  if (e.target.closest('[data-lg-new]') || e.target.closest('[data-lg-newman]')) {
    var man = !!e.target.closest('[data-lg-newman]'), id = 'nuevo-' + Date.now().toString(36), L = lgNews();
    L.push({ id: id, name: 'Nuevo logro', desc: '', src: man ? 'prof' : 'web', cond: '', prog: false, activo: true, art: 'hola' }); ctSave('gpc:lg:nuevos', L);
    LG.sel = id; LG.form = null; lgApply();
    if (man) { location.hash = '#/panel/logros'; return; }
    lgEnsure(); lgRender(null, '#lg-name'); var n = document.getElementById('lg-name'); if (n) n.select(); return;
  }
  if (e.target.closest('[data-lg-pick]')) { LG.pick = !LG.pick; return lgRender('ed', '[data-lg-pick]'); }
  if ((b = e.target.closest('[data-lg-art]'))) { LG.form.art = b.dataset.lgArt; LG.pick = false; return lgRender('ed', '[data-lg-pick]'); }
  if ((b = e.target.closest('[data-lg-prog]'))) { LG.form.prog = b.dataset.lgProg === '1'; return lgRender('ed', '[data-lg-prog="' + b.dataset.lgProg + '"]'); }
  if (e.target.closest('[data-lg-save]')) {
    if (!LG.form.name.trim()) { LG.err = 'El logro necesita un nombre.'; return lgRender('ed', '#lg-name'); }
    LG.err = ''; LG.form.name = LG.form.name.trim(); lgSave(LG.form); LG.form = null; lgEnsure(); lgRender(null);
    return ctToast('Guardaste "' + LG.form.name + '".');
  }
  if (e.target.closest('[data-lg-act]')) {
    var it = lgItem(LG.sel); it.activo = !it.activo; lgSave(it); LG.form.activo = it.activo; lgRender(null, '[data-lg-act]');
    return ctToast(it.activo ? 'Activaste "' + it.name + '".' : 'Desactivaste "' + it.name + '". Ya no aparece en la página Logros.');
  }
  if ((b = e.target.closest('[data-lg-who]'))) { LG.gsel = b.dataset.lgWho; return; }
  if ((b = e.target.closest('[data-lg-edit]'))) { LG.sel = b.dataset.lgEdit; LG.form = null; return; }
  if ((b = e.target.closest('[data-lg-g]'))) { LG.gsel = b.dataset.lgG; LG.give = {}; return lgGiveRender('[data-lg-g="' + LG.gsel + '"]'); }
  if (e.target.closest('[data-lg-give-go]')) {
    var gv = lgGiven(), list = gv[LG.gsel] || [], who = Object.keys(LG.give).filter(function (h) { return LG.give[h] && !list.some(function (x) { return x.h === h; }); });
    if (!who.length) return;
    who.forEach(function (h) { list.push({ h: h, at: lgToday(), msg: (LG.msg || '').trim() }); });
    gv[LG.gsel] = list; ctSave('gpc:lg:entregas', gv); LG.give = {}; LG.msg = ''; lgApply(); lgGiveRender();
    return ctToast('Entregaste "' + lgItem(LG.gsel).name + '" a ' + who.length + (who.length === 1 ? ' miembro.' : ' miembros.'));
  }
  if ((b = e.target.closest('[data-lg-undo]'))) {
    var u = b.dataset.lgUndo.split(':'), gv2 = lgGiven(), gone = (gv2[u[0]] || []).splice(+u[1], 1)[0];
    ctSave('gpc:lg:entregas', gv2); lgApply(); lgGiveRender();
    return ctToast('Quitaste el logro a ' + (gone ? gone.h : 'ese miembro') + '.');
  }
});
document.addEventListener('input', function (e) {
  if (!document.querySelector('.pr-page')) return;
  var el = e.target;
  if (el.dataset && el.dataset.lgIn && LG.form) { LG.form[el.dataset.lgIn] = el.value; return; }
  if (el.matches && el.matches('[data-lg-q]')) { LG.q = el.value; var p = document.getElementById('lg-people'); if (p) { var tmp = document.createElement('div'); tmp.innerHTML = lgGiveBody(); var np = tmp.querySelector('#lg-people'); if (np) p.innerHTML = np.innerHTML; } return; }
  if (el.matches && el.matches('[data-lg-msg]')) { LG.msg = el.value; }
});
document.addEventListener('change', function (e) {
  var el = e.target; if (!el.dataset) return;
  if (el.dataset.lgSrc !== undefined && LG.form) { LG.form.src = el.value; return lgRender('ed', 'input[name="lg-src"][value="' + el.value + '"]'); }
  if (el.dataset.lgGive !== undefined) { LG.give[el.dataset.lgGive] = el.checked; var keep = el.dataset.lgGive; lgGiveRender('[data-lg-give="' + keep + '"]'); }
});

lgApply();

/* =====================================================================
   ANUNCIOS: el profesor los publica para todos o por nivel; los alumnos los ven en Training
   Provisional: viven en este navegador.
   ===================================================================== */
var AN = { aud: { Todos: true }, msg: '', when: 'ahora', at: '', until: 'semana', untilDate: '', prev: 'Junior', tab: 'activos', edit: null, err: '' };
var AN_LV = ['Beginner', 'Junior', 'Senior'];
var AN_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10v4a1 1 0 0 0 1 1h3l6 4V5L8 9H5a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg>';
function anPad(n) { return ('0' + n).slice(-2); }
function anIsoDate(d) { return d.getFullYear() + '-' + anPad(d.getMonth() + 1) + '-' + anPad(d.getDate()); }
function anIsoLocal(d) { return anIsoDate(d) + 'T' + anPad(d.getHours()) + ':' + anPad(d.getMinutes()); }
function anAdd(days) { var d = new Date(); d.setDate(d.getDate() + days); return d; }
function anAll() {
  var v = lgArr('gpc:anuncios');
  if (!v) { // ejemplos la primera vez, con fechas cerca de hoy
    v = [{ id: 'a1', msg: 'Este sábado hay contest interno a las 10:00 en vjudge. Traigan su laptop cargada.', aud: ['Todos'], at: anIsoLocal(anAdd(-1)), until: anIsoDate(anAdd(4)) },
      { id: 'a2', msg: 'Senior: simulacro ICPC el miércoles a las 6 p. m. en el aula 404.', aud: ['Senior'], at: anIsoLocal(anAdd(-2)), until: anIsoDate(anAdd(1)) },
      { id: 'a3', msg: 'Beginner: repasen Sumas prefijas antes de la clase del viernes.', aud: ['Beginner'], at: anIsoLocal(anAdd(-12)), until: anIsoDate(anAdd(-5)) }];
    ctSave('gpc:anuncios', v);
  }
  return v;
}
function anState(a) { var now = anIsoLocal(new Date()), today = anIsoDate(new Date()); return a.at > now ? 'programados' : (!a.until || a.until >= today) ? 'activos' : 'pasados'; }
function anFor(lv, a) { return a.aud.indexOf('Todos') >= 0 || a.aud.indexOf(lv) >= 0; }
function anCount(aud) { if (aud.Todos) return RK_MEM.length; return RK_MEM.filter(function (m) { return aud[m[2]]; }).length; }
function anAudLabel(aud) { return aud.indexOf('Todos') >= 0 ? 'Todos' : aud.join(' y '); }
function anAudDot(aud) { return aud.indexOf('Todos') >= 0 ? '#1E1B3A' : PR_LV[aud[0]] ? PR_LV[aud[0]][2] : '#1E1B3A'; }
function anWhen(iso) { var p = iso.split('T'), d = p[0].split('-'); return +d[2] + ' de ' + PR_MES[+d[1] - 1] + (p[1] ? ', ' + p[1] : ''); }
function anUntilTxt(a) { return a.until ? 'Hasta el ' + lgDate(a.until) : 'Hasta que lo quites'; }

// --- página del profesor ---
function anComposer() {
  var aud = ['Todos'].concat(AN_LV).map(function (k) {
    var on = !!AN.aud[k], n = k === 'Todos' ? RK_MEM.length : RK_MEM.filter(function (m) { return m[2] === k; }).length, c = k === 'Todos' ? ['#EDE7FB', '#1E1B3A'] : [PR_LV[k][0], PR_LV[k][2]];
    return '<label class="an-aud' + (on ? ' on' : '') + '"><input type="checkbox" data-an-aud="' + k + '"' + (on ? ' checked' : '') + '><span class="an-ai" style="background:' + c[0] + '"><i style="background:' + c[1] + '"></i></span><span><b>' + k + '</b><small>' + n + ' miembros</small></span></label>';
  }).join('');
  var n = anCount(AN.aud), opt = function (v, t, cur) { return '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + t + '</option>'; };
  return '<h2 class="pr-dsp" id="an-new">' + (AN.edit ? 'Editar anuncio' : 'Nuevo anuncio') + '</h2>' +
    '<fieldset class="an-auds"><legend>¿Para quién?</legend><div>' + aud + '</div></fieldset>' +
    '<div class="ct-fl"><label for="an-msg">Mensaje</label><textarea id="an-msg" class="pr-in" rows="3" maxlength="280" data-an-msg placeholder="Ej. Este sábado hay contest interno a las 10:00">' + prEsc(AN.msg) + '</textarea><small class="an-cnt" id="an-cnt">' + AN.msg.length + ' de 280</small></div>' +
    '<div class="an-two"><div class="ct-fl"><label for="an-when">Publicar</label><select id="an-when" class="pr-in" data-an-when>' + opt('ahora', 'Ahora', AN.when) + opt('manana', 'Mañana a las 8:00', AN.when) + opt('fecha', 'Elegir fecha y hora', AN.when) + '</select>' +
      (AN.when === 'fecha' ? '<label class="pr-sr" for="an-at">Fecha y hora de publicación</label><input id="an-at" class="pr-in" type="datetime-local" data-an-at value="' + AN.at + '">' : '') + '</div>' +
    '<div class="ct-fl"><label for="an-until">Se muestra hasta</label><select id="an-until" class="pr-in" data-an-until>' + opt('semana', 'En una semana', AN.until) + opt('fecha', 'Elegir fecha', AN.until) + opt('siempre', 'Hasta que lo quite', AN.until) + '</select>' +
      (AN.until === 'fecha' ? '<label class="pr-sr" for="an-ud">Último día</label><input id="an-ud" class="pr-in" type="date" data-an-ud value="' + AN.untilDate + '">' : '') + '</div></div>' +
    (AN.err ? '<p class="ct-err" role="alert">' + prEsc(AN.err) + '</p>' : '') +
    '<div class="an-acts">' + (AN.edit ? '<button type="button" class="pr-btn ghost" data-an-cancel>Cancelar edición</button>' : '') +
      '<button type="button" class="pr-btn dark" data-an-pub' + (n ? '' : ' disabled') + '>' + (AN.edit ? 'Guardar cambios' : 'Publicar a ' + n + (n === 1 ? ' miembro' : ' miembros')) + '</button></div>';
}
function anPreview() {
  var lv = AN.prev, who = (RK_MEM.filter(function (m) { return m[2] === lv; })[0] || ['tu_handle'])[0];
  var draft = AN.msg.trim() ? { id: 'draft', msg: AN.msg.trim(), aud: Object.keys(AN.aud).filter(function (k) { return AN.aud[k]; }), at: '', until: '' } : null;
  var reaches = draft && anFor(lv, draft);
  var others = anAll().filter(function (a) { return a.id !== AN.edit && anState(a) === 'activos' && anFor(lv, a); });
  var list = (reaches ? [draft] : []).concat(others);
  var tabs = AN_LV.map(function (k) { return '<button type="button" data-an-prev="' + k + '" aria-pressed="' + (k === lv) + '">' + k + '</button>'; }).join('');
  return '<div class="an-ph"><h2 class="pr-dsp">Así lo verá un miembro</h2><div class="pr-tabs an-vs" role="group" aria-label="Ver como">' + tabs + '</div></div>' +
    '<div class="an-tr"><p class="an-hi">Hola de nuevo, ' + prEsc(who) + '.</p><div class="an-chips"><span class="an-chip">Problema del día</span><span class="an-chip">Cuaderno</span>' +
      (list.length ? '<span class="an-chip an-on"><span class="an-pi">' + AN_IC + '</span>Anuncios<em>' + list.length + '</em></span>' : '') + '</div>' +
      (list.length ? '<div class="an-pv">' + list.map(function (a) { return '<div class="an-item' + (a.id === 'draft' ? ' draft' : '') + '"><b>Rodo</b><span>' + prEsc(a.msg) + '</span></div>'; }).join('') + '</div>'
        : '<p class="an-none">' + (draft ? 'Este anuncio no le llega a un miembro ' + lv + '.' : 'Escribe un mensaje para verlo aquí.') + '</p>') +
      '<svg viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true"><path d="M0 250 L0 190 L160 120 L260 160 L420 60 L520 110 L610 40 L700 20 L760 70 L880 30 L1000 120 L1120 80 L1260 150 L1440 100 L1440 250Z" fill="#D3C6F5"/><path d="M0 250 L0 220 L200 170 L380 210 L560 150 L740 200 L920 160 L1100 210 L1300 170 L1440 200 L1440 250Z" fill="#B8A6EE"/><path d="M0 260 L0 240 L240 220 L520 245 L800 225 L1100 248 L1440 232 L1440 260Z" fill="#F7F4FE"/></svg></div>' +
    '<p class="lg-note">Los miembros lo ven en la píldora Anuncios de Training, junto a Problema del día y Cuaderno.</p>';
}
function anList() {
  var all = anAll(), by = function (t) { return all.filter(function (a) { return anState(a) === t; }); };
  var tabs = [['activos', 'Activos'], ['programados', 'Programados'], ['pasados', 'Pasados']].map(function (t) { return '<button type="button" data-an-tab="' + t[0] + '" aria-pressed="' + (AN.tab === t[0]) + '">' + t[1] + ' <span>' + by(t[0]).length + '</span></button>'; }).join('');
  var rows = by(AN.tab).sort(function (a, b) { return a.at < b.at ? 1 : -1; }).map(function (a) {
    return '<div class="an-row"><span class="an-msg">' + prEsc(a.msg) + '</span><span class="an-tag"><i style="background:' + anAudDot(a.aud) + '"></i>' + anAudLabel(a.aud) + '</span><small>' + (AN.tab === 'programados' ? 'Se publica el ' + anWhen(a.at) : anUntilTxt(a)) + '</small>' +
      '<button type="button" class="pr-btn ghost sm" data-an-edit="' + a.id + '">Editar</button><button type="button" class="pr-btn ghost sm lg-danger" data-an-del="' + a.id + '">Quitar</button></div>';
  }).join('');
  return '<div class="pr-th"><h2 class="pr-dsp">Tus anuncios</h2><div class="pr-tabs an-st" role="group" aria-label="Estado">' + tabs + '</div></div>' + (rows || '<p class="pr-empty">No hay anuncios ' + (AN.tab === 'activos' ? 'activos' : AN.tab) + '.</p>');
}
function viewAnuncios() {
  return '<div class="pr-page">' + prHero('Anuncios', 'panel', '', true) +
    '<div class="ct-cols an-cols"><section class="pr-card an-comp" id="an-comp" aria-labelledby="an-new">' + anComposer() + '</section>' +
    '<section class="an-prev" id="an-prev">' + anPreview() + '</section>' +
    '<section class="pr-card an-list" id="an-list">' + anList() + '</section></div></div>';
}
function anRender(what, focusSel) {
  var map = { comp: ['an-comp', anComposer], prev: ['an-prev', anPreview], list: ['an-list', anList] };
  (what ? what.split(' ') : ['comp', 'prev', 'list']).forEach(function (k) { var el = document.getElementById(map[k][0]); if (el) el.innerHTML = map[k][1](); });
  if (focusSel) { var f = document.querySelector(focusSel); if (f) f.focus(); }
}
function anReset() { AN.aud = { Todos: true }; AN.msg = ''; AN.when = 'ahora'; AN.at = ''; AN.until = 'semana'; AN.untilDate = ''; AN.edit = null; AN.err = ''; }
function anPublish() {
  var aud = Object.keys(AN.aud).filter(function (k) { return AN.aud[k]; }), msg = AN.msg.trim();
  if (!msg) { AN.err = 'Escribe el mensaje del anuncio.'; return anRender('comp', '#an-msg'); }
  if (!aud.length) { AN.err = 'Elige al menos un nivel.'; return anRender('comp'); }
  var at = AN.when === 'ahora' ? anIsoLocal(new Date()) : AN.when === 'manana' ? anIsoDate(anAdd(1)) + 'T08:00' : AN.at;
  if (!at) { AN.err = 'Elige la fecha y hora de publicación.'; return anRender('comp', '#an-at'); }
  var until = AN.until === 'siempre' ? '' : AN.until === 'semana' ? anIsoDate(new Date(new Date(at.slice(0, 10) + 'T12:00').getTime() + 7 * 864e5)) : AN.untilDate;
  if (AN.until === 'fecha' && !until) { AN.err = 'Elige hasta qué día se muestra.'; return anRender('comp', '#an-ud'); }
  if (until && until < at.slice(0, 10)) { AN.err = 'El último día no puede ser antes de la publicación.'; return anRender('comp', '#an-ud'); }
  var all = anAll(), row = { id: AN.edit || 'a' + Date.now().toString(36), msg: msg, aud: aud.indexOf('Todos') >= 0 ? ['Todos'] : aud, at: at, until: until };
  if (AN.edit) all = all.map(function (a) { return a.id === AN.edit ? row : a; }); else all.push(row);
  ctSave('gpc:anuncios', all);
  var n = anCount(AN.aud), wasEdit = !!AN.edit;
  AN.tab = anState(row); anReset(); anRender();
  ctToast(wasEdit ? 'Guardaste el anuncio.' : row.at > anIsoLocal(new Date()) ? 'Programaste el anuncio para el ' + anWhen(row.at) + '.' : 'Publicaste el anuncio para ' + n + (n === 1 ? ' miembro.' : ' miembros.'));
}

// --- píldora y lista para los alumnos en Training ---
function anMyLevel() {
  var s = typeof enSession === 'function' && enSession(), h = (s && s.handle) || (typeof RK_ME !== 'undefined' ? RK_ME : '');
  var m = RK_MEM.filter(function (x) { return x[0].toLowerCase() === String(h).toLowerCase(); })[0];
  return m ? m[2] : 'Beginner';
}
function anMine() {
  var prof = typeof enProf === 'function' && enProf(), lv = anMyLevel();
  return anAll().filter(function (a) { return anState(a) === 'activos' && (prof || anFor(lv, a)); }).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
}
// lo visto se guarda por usuario
function anSeenKey() { var s = typeof enSession === 'function' && enSession(); return 'gpc:anuncios:vistos:' + ((s && s.handle) || 'anon'); }
function anSeen() { return ctLoad(anSeenKey()); }
function anPill() {
  var list = anMine(); if (!list.length) return '';
  var seen = anSeen(), nw = list.filter(function (a) { return !seen[a.id]; }).length;
  return '<button type="button" class="pdb anb" data-an-open><span class="pdi">' + AN_IC + '</span><b>Anuncios</b>' + (nw ? '<span class="pdl">' + nw + (nw === 1 ? ' nuevo' : ' nuevos') + '</span>' : '') +
    '<svg viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>';
}
function anOpen() {
  var list = anMine(), seen = anSeen(), box = document.getElementById('popbox');
  box.classList.add('an');
  box.innerHTML = '<div class="an-pop"><div class="an-poph"><span class="an-pi">' + AN_IC + '</span><h3 class="dsp">Anuncios</h3></div>' +
    list.map(function (a) { return '<article class="an-art' + (seen[a.id] ? '' : ' nw') + '"><div><b>Rodo' + (seen[a.id] ? '' : ' <span class="an-new">Nuevo</span>') + '</b><small>' + anWhen(a.at.slice(0, 10)) + '</small></div><p>' + prEsc(a.msg) + '</p></article>'; }).join('') +
    '<button class="btn" id="pclose">Cerrar</button></div>';
  document.getElementById('pop').classList.add('open');
  list.forEach(function (a) { seen[a.id] = 1; }); ctSave(anSeenKey(), seen);
  var pill = document.querySelector('.anb .pdl'); if (pill) pill.remove();
  var c = document.getElementById('pclose'); if (c) c.focus();
}

// --- eventos de anuncios ---
document.addEventListener('click', function (e) {
  if (e.target.closest('[data-an-open]')) return anOpen();
  if (e.target.id === 'pclose' || e.target.id === 'pop') { var bx = document.getElementById('popbox'); if (bx) bx.classList.remove('an'); }
  if (!document.querySelector('.pr-page')) return;
  var b;
  if ((b = e.target.closest('[data-an-prev]'))) { AN.prev = b.dataset.anPrev; return anRender('prev', '[data-an-prev="' + AN.prev + '"]'); }
  if ((b = e.target.closest('[data-an-tab]'))) { AN.tab = b.dataset.anTab; return anRender('list', '[data-an-tab="' + AN.tab + '"]'); }
  if (e.target.closest('[data-an-pub]')) return anPublish();
  if (e.target.closest('[data-an-cancel]')) { anReset(); return anRender(); }
  if ((b = e.target.closest('[data-an-edit]'))) {
    var a = anAll().filter(function (x) { return x.id === b.dataset.anEdit; })[0]; if (!a) return;
    AN.edit = a.id; AN.msg = a.msg; AN.aud = {}; a.aud.forEach(function (k) { AN.aud[k] = true; });
    AN.when = 'fecha'; AN.at = a.at; AN.until = a.until ? 'fecha' : 'siempre'; AN.untilDate = a.until || ''; AN.err = '';
    anRender(null, '#an-msg'); document.getElementById('an-comp').scrollIntoView({ behavior: 'smooth', block: 'start' }); return;
  }
  if ((b = e.target.closest('[data-an-del]'))) {
    var all = anAll(), gone = all.filter(function (x) { return x.id === b.dataset.anDel; })[0];
    ctSave('gpc:anuncios', all.filter(function (x) { return x.id !== b.dataset.anDel; }));
    if (AN.edit === b.dataset.anDel) anReset();
    anRender(); return ctToast('Quitaste el anuncio' + (gone ? ': "' + gone.msg.slice(0, 40) + (gone.msg.length > 40 ? '…' : '') + '"' : '') + '.');
  }
});
document.addEventListener('input', function (e) {
  var el = e.target; if (!el.matches || !document.querySelector('.pr-page')) return;
  if (el.matches('[data-an-msg]')) { AN.msg = el.value; var c = document.getElementById('an-cnt'); if (c) c.textContent = AN.msg.length + ' de 280'; anRender('prev'); }
  else if (el.matches('[data-an-at]')) AN.at = el.value;
  else if (el.matches('[data-an-ud]')) AN.untilDate = el.value;
});
document.addEventListener('change', function (e) {
  var el = e.target; if (!el.matches || !document.querySelector('.pr-page')) return;
  if (el.matches('[data-an-aud]')) {
    var k = el.dataset.anAud;
    if (k === 'Todos') AN.aud = el.checked ? { Todos: true } : {};
    else { AN.aud.Todos = false; AN.aud[k] = el.checked; if (AN_LV.every(function (x) { return AN.aud[x]; })) AN.aud = { Todos: true }; }
    AN.err = ''; anRender('comp prev', '[data-an-aud="' + k + '"]');
  } else if (el.matches('[data-an-when]')) { AN.when = el.value; if (AN.when === 'fecha' && !AN.at) AN.at = anIsoDate(anAdd(1)) + 'T08:00'; anRender('comp', '#an-when'); }
  else if (el.matches('[data-an-until]')) { AN.until = el.value; if (AN.until === 'fecha' && !AN.untilDate) AN.untilDate = anIsoDate(anAdd(7)); anRender('comp', '#an-until'); }
});
