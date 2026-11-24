/* Ranking del club (ciclo de 6 meses). Datos de ejemplo; los duelos no suman. */
var RK = { tab: 'General' };
// [handle, rating, nivel, problemas del ciclo, días activos, cambio de puesto en la semana]
var RK_MEM = [
  ['div4_enjoyer', 1953, 'Senior', 224, 121, 0], ['SirNathaN', 1676, 'Senior', 201, 112, 1], ['ghostrider101218', 1541, 'Senior', 188, 98, -1],
  ['Jean_Pool', 1701, 'Senior', 172, 74, 2], ['adws', 1620, 'Senior', 165, 90, -1], ['Chatito17', 1488, 'Junior', 158, 85, 1],
  ['_matjavi_', 1734, 'Senior', 149, 81, 0], ['vannana', 1655, 'Senior', 141, 79, 2], ['AleeAsto', 1402, 'Junior', 133, 70, -1],
  ['zayd.ayasta.dos', 1356, 'Junior', 127, 66, 1], ['lu_mendoza', 1288, 'Beginner', 119, 63, 3], ['valeq', 1432, 'Junior', 104, 58, 0],
  ['brunoUPC', 1395, 'Junior', 96, 51, -2], ['dieguito_ac', 1204, 'Beginner', 88, 55, 1], ['paocpp', 1127, 'Beginner', 79, 47, -1],
  ['renato_v', 1046, 'Beginner', 66, 40, 0], ['nicol_q', 980, 'Beginner', 54, 33, 2]
];
var RK_ME = 'Jean_Pool';
var RK_IMG = {
  div4_enjoyer: 'assets/img/miembros/div4_enjoyer.jpg', SirNathaN: 'assets/img/miembros/SirNathaN.jpg', ghostrider101218: 'assets/img/miembros/ghostrider.jpg',
  Jean_Pool: 'assets/img/floppa.jpg', adws: 'assets/img/miembros/adws.jpg', Chatito17: 'assets/img/chatito17.jpg', _matjavi_: 'assets/img/miembros/_matjavi_.jpg',
  vannana: 'assets/img/miembros/vannana.jpg', AleeAsto: 'assets/img/miembros/AleeAsto.jpg', 'zayd.ayasta.dos': 'assets/img/miembros/zayd.ayasta.dos.jpg'
};
var RK_LV = { Beginner: ['#FFF0DC', '#8A4A00'], Junior: ['#FDE6EE', '#A61E52'], Senior: ['#E3EEFD', '#1F5BA8'] };
function rkRc(r) { return r < 1200 ? '#6B6B6B' : r < 1400 ? '#007A00' : r < 1600 ? '#03857D' : r < 1900 ? '#0000FF' : '#AA00AA'; }
function rkList(tab) { return RK_MEM.filter(function (m) { return tab === 'General' || m[2] === tab; }).sort(function (a, b) { return b[3] - a[3]; }); }
function rkAv(m, cls) {
  if (RK_IMG[m[0]]) return '<img class="' + cls + '" src="' + RK_IMG[m[0]] + '" alt="">';
  var c = RK_LV[m[2]];
  return '<span class="' + cls + ' ini" aria-hidden="true" style="background:' + c[0] + ';color:' + c[1] + '">' + m[0].charAt(0).toUpperCase() + '</span>';
}
// Un solo paisaje que se ve a través de las tres cards: macizo izquierdo, montaña grande al centro, macizo derecho.
var RK_PANO = '<svg class="rk-mt" viewBox="0 0 992 140" preserveAspectRatio="none" aria-hidden="true"><path d="M150 140 L230 112 L300 82 L360 56 L410 34 L450 20 L480 8 L500 14 L520 4 L546 20 L586 34 L636 56 L696 82 L766 112 L846 140Z" fill="#E2D9FA"/><path d="M440 24 L450 20 L480 8 L500 14 L520 4 L546 20 L562 28 L548 28 L536 35 L520 27 L506 33 L492 25 L480 32 L466 26 L454 29Z" fill="#fff" opacity=".95"/><path d="M0 140 L0 92 L40 78 L80 64 L110 56 L130 62 L160 50 L190 66 L230 88 L280 106 L340 118 L420 122 L496 124 L572 122 L652 118 L712 106 L762 88 L802 66 L832 50 L862 62 L882 56 L912 64 L952 78 L992 92 L992 140Z" fill="#CFC2F5"/><path d="M100 58 L110 56 L130 62 L160 50 L176 58 L164 58 L154 64 L140 60 L126 66 L114 60 L106 62Z M892 58 L882 56 L862 62 L832 50 L816 58 L828 58 L838 64 L852 60 L866 66 L878 60 L886 62Z" fill="#fff" opacity=".88"/><path d="M0 140 V132 Q496 120 992 132 V140Z" fill="#fff"/></svg>';
function rkCard(m, place, col) {
  var c = RK_LV[m[2]];
  return '<article class="rk-card p' + place + ' rk-c' + col + '" aria-label="Puesto ' + place + ', ' + m[0] + '">' + RK_PANO +
    '<span class="rk-badge rk-dsp" aria-hidden="true">' + place + '</span>' + rkAv(m, 'rk-av') +
    '<a href="#/miembro/' + encodeURIComponent(m[0]) + '" class="rk-name">' + m[0] + '</a><span class="rk-rate rk-mono" style="color:' + rkRc(m[1]) + '">' + m[1] + '</span>' +
    '<span class="rk-lv" style="color:' + c[1] + '">' + m[2] + '</span>' +
    '<div class="rk-stats"><span><b>' + m[3] + '</b><small>problemas</small></span><span><b>' + m[4] + '</b><small>días activos</small></span></div></article>';
}
function rkWeek(d) {
  if (d > 0) return '<svg viewBox="0 0 24 24" fill="none" stroke="#14905E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Subió"><path d="M6 15l6-6 6 6"/></svg>';
  if (d < 0) return '<svg viewBox="0 0 24 24" fill="none" stroke="#C2264F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Bajó"><path d="M6 9l6 6 6-6"/></svg>';
  return '<span class="eq rk-mono" aria-label="Sin cambios">=</span>';
}
function rkBody(tab) {
  var l = rkList(tab), h = '<div class="rk-pod">';
  [[1, 0], [0, 1], [2, 2]].forEach(function (x) { if (l[x[0]]) h += rkCard(l[x[0]], x[0] + 1, x[1]); });
  h += '</div><section class="rk-table" aria-label="Resto del ranking"><div class="rk-row hd"><span>Puesto</span><span>Miembro</span><span class="lvl">Nivel</span><span class="r">Problemas</span><span class="r d">Días activos</span><span style="text-align:center">Semana</span></div>';
  l.slice(3).forEach(function (m, i) {
    h += '<div class="rk-row' + (m[0] === RK_ME ? ' me' : '') + '"><span class="n rk-dsp">' + (i + 4) + '</span><span class="rk-who">' + rkAv(m, '') +
      '<a href="#/miembro/' + encodeURIComponent(m[0]) + '">' + m[0] + '</a><span class="rk-mono" style="color:' + rkRc(m[1]) + '">' + m[1] + '</span></span>' +
      '<span class="lvl">' + m[2] + '</span><b class="r p rk-mono">' + m[3] + '</b><span class="r d rk-mono">' + m[4] + '</span><span class="w">' + rkWeek(m[5]) + '</span></div>';
  });
  return h + '</section>';
}
function viewRanking() {
  var tabs = ['General', 'Beginner', 'Junior', 'Senior'].map(function (k) { return '<button type="button" role="tab" data-rk-tab="' + k + '" aria-selected="' + (k === RK.tab) + '">' + k + '</button>'; }).join('');
  return '<div class="rk-page"><header class="rk-hero"><h1 class="rk-dsp">Ranking</h1><div class="rk-tabs" role="tablist" aria-label="Nivel">' + tabs + '</div>' +
    '<svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true"><path d="M0 300 L0 210 L160 175 L300 130 L420 95 L520 60 L600 35 L660 20 L700 6 L740 18 L790 12 L840 34 L920 60 L1020 95 L1140 130 L1280 175 L1440 210 L1440 300Z" fill="#E2D9FA"/><path d="M560 48 L600 35 L660 20 L700 6 L740 18 L790 12 L840 34 L880 48 L858 50 L836 62 L812 52 L790 64 L766 50 L740 60 L716 48 L700 58 L680 46 L660 58 L636 48 L612 60 L590 52Z" fill="#fff" opacity=".92"/><path d="M0 300 L0 190 L90 160 L170 125 L220 105 L260 120 L300 100 L350 135 L420 170 L520 200 L620 215 L720 222 L820 215 L920 200 L1020 170 L1090 135 L1140 100 L1180 120 L1220 105 L1270 125 L1350 160 L1440 190 L1440 300Z" fill="#CFC2F5"/><path d="M200 112 L220 105 L260 120 L300 100 L325 118 L308 116 L295 124 L278 116 L260 128 L240 118 L220 124 L206 118Z M1240 112 L1220 105 L1180 120 L1140 100 L1115 118 L1132 116 L1145 124 L1162 116 L1180 128 L1200 118 L1220 124 L1234 118Z" fill="#fff" opacity=".85"/><path d="M0 300 L0 255 L200 242 L420 258 L720 248 L1020 258 L1240 242 L1440 255 L1440 300Z" fill="#BEADEF"/><path d="M0 300 V292 Q360 280 720 292 T1440 288 V300Z" fill="#F7F4FE"/></svg></header>' +
    '<main class="rk-main"><p class="rk-cycle">Ciclo 2026-II, de julio a diciembre. Quedan 40 días.</p><div class="rk-body" id="rk-body">' + rkBody(RK.tab) + '</div></main></div>';
}
// Entrada escalonada: cards del podio y luego las filas de la tabla.
function rkEnter(body) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  body.querySelectorAll('.rk-card').forEach(function (el, i) {
    var d = el.classList.contains('p1') ? 0 : el.classList.contains('p2') ? 90 : 170;
    el.animate([{ opacity: 0, transform: 'translateY(22px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: d, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
  });
  body.querySelectorAll('.rk-mt').forEach(function (el) { el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 120, easing: 'ease-out', fill: 'backwards' }); });
  body.querySelectorAll('.rk-row:not(.hd)').forEach(function (el, i) {
    el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: 220 + Math.min(i, 12) * 35, easing: 'ease-out', fill: 'backwards' });
  });
}
function rkSetTab(k) {
  if (k === RK.tab) return;
  RK.tab = k;
  document.querySelectorAll('[data-rk-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.rkTab === k)); });
  var body = document.getElementById('rk-body');
  if (!body) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { body.innerHTML = rkBody(k); return; }
  body.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
  var out = body.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 170, easing: 'ease-in', fill: 'forwards' });
  out.onfinish = function () { body.innerHTML = rkBody(k); out.cancel(); rkEnter(body); };
}
document.addEventListener('click', function (e) { var b = e.target.closest('[data-rk-tab]'); if (b) rkSetTab(b.dataset.rkTab); });
document.addEventListener('keydown', function (e) {
  var b = e.target.closest && e.target.closest('[data-rk-tab]');
  if (!b || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
  var all = [].slice.call(document.querySelectorAll('[data-rk-tab]')), i = all.indexOf(b) + (e.key === 'ArrowRight' ? 1 : -1), n = all[(i + all.length) % all.length];
  n.focus(); rkSetTab(n.dataset.rkTab); e.preventDefault();
});
