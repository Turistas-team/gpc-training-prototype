/* Perfil público de un miembro y comparación contigo. Datos de ejemplo derivados del ranking. */
var MB = { per: 'ciclo', tab: 'club' };
var MB_LVC = { Beginner: ['#F7931E', '#FCE0BD'], Junior: ['#F05A8C', '#F6D3DF'], Senior: ['#3B8BEB', '#CFE1F8'] };
var MB_TOT = [['Beginner', 68], ['Junior', 76], ['Senior', 36]];
var MB_MES = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov'];
var MB_DESDE = ['marzo de 2024', 'agosto de 2024', 'marzo de 2025', 'abril de 2025', 'agosto de 2025', 'septiembre de 2025', 'marzo de 2026'];

function mbFind(h) { h = String(h || '').toLowerCase(); return RK_MEM.filter(function (m) { return m[0].toLowerCase() === h; })[0]; }
function mbSeed(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 100003; return x; }
function mbPos(m, tab) { return rkList(tab).indexOf(m) + 1; }
function mbEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

// estadísticas de ejemplo, estables por miembro
function mbStats(m) {
  var s = mbSeed(m[0]), r = function (k, n) { return (s * (k * 7 + 3) + k * 13) % n; };
  var streak = 2 + r(1, 9), best = streak + 6 + r(2, 14);
  var w = [18, 21, 22, 19, 20].map(function (x, i) { return x + r(i + 3, 6); }), tw = w.reduce(function (a, b) { return a + b; }, 0);
  var bars = w.map(function (x) { return Math.round(m[3] * x / tw); });
  var dates = ['19 nov', '12 nov', '05 nov', '28 oct', '21 oct', '14 oct'], fmt = ['Rápida', 'Normal', 'Div. 2', 'Normal', 'Rápida', 'Div. 2'];
  var sims = dates.map(function (d, i) {
    var p = m[1] + ((r(i + 8, 9) - 4) * 28) - (i * 14);
    return { d: d, f: fmt[i], r: (1 + r(i + 11, 3)) + ' / ' + (fmt[i] === 'Div. 2' ? 6 : fmt[i] === 'Rápida' ? 3 : 4), p: p };
  });
  var bestSim = sims.reduce(function (a, b) { return b.p > a.p ? b : a; });
  var lv = { Beginner: [.62, .2, 0], Junior: [.88, .52, .08], Senior: [.97, .8, .32] }[m[2]];
  var levels = MB_TOT.map(function (t, i) { return [t[0], Math.min(t[1], Math.round(t[1] * lv[i]) + r(i + 20, 5)), t[1]]; });
  var heat = [], dens = m[4] / 125;
  for (var i = 0; i < 140; i++) { var v = ((i * 29 + s) % 17) / 17, k = v > dens ? 0 : 1 + Math.floor(v / dens * 5); heat.push(Math.min(k, 5)); }
  var monthDays = Math.min(21, Math.round(m[4] / 5) + r(30, 4));
  return {
    streak: streak, best: best, bars: bars, sims: sims, bestSim: bestSim, levels: levels, heat: heat, monthDays: monthDays,
    desde: MB_DESDE[r(31, MB_DESDE.length)],
    ciclo: [['Problemas', m[3]], ['Días activos', m[4]], ['Racha actual', streak], ['Mejor racha', best], ['Mejor performance', bestSim.p], ['Simulaciones', 6 + r(32, 6)]],
    mes: [['Problemas', bars[4]], ['Días activos', monthDays], ['Racha actual', streak], ['Mejor racha', Math.min(best, monthDays)], ['Mejor performance', sims.slice(0, 3).reduce(function (a, b) { return Math.max(a, b.p); }, 0)], ['Simulaciones', 2 + r(33, 4)]]
  };
}

function mbAv(m, cls, extra) {
  if (RK_IMG[m[0]]) return '<img class="' + cls + '" src="' + RK_IMG[m[0]] + '" alt="Foto de perfil de ' + m[0] + '"' + (extra || '') + '>';
  var c = RK_LV[m[2]];
  return '<span class="' + cls + ' ini" aria-hidden="true" style="background:' + c[0] + ';color:' + c[1] + (extra ? ';' + extra.replace(/^ style="|"$/g, '') : '') + '">' + m[0].charAt(0).toUpperCase() + '</span>';
}
function mbChip(txt, bg, fg) { return '<span class="mb-chip" style="background:' + bg + ';color:' + fg + '">' + txt + '</span>'; }
function mbRate(m) { return '<span class="rk-mono mb-rt" style="color:' + rkRc(m[1]) + '">' + G.rankOf(m[1]).name + ' ' + m[1] + '</span>'; }

var MB_HERO = '<svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true"><path d="M0 300 L0 120 L110 70 L200 110 L300 40 L380 100 L470 150 L560 120 L650 165 L720 140 L790 165 L880 120 L970 150 L1060 100 L1140 40 L1240 110 L1330 70 L1440 120 L1440 300Z" fill="#E2D9FA"/><path d="M300 40 L338 69 L318 64 L300 76 L282 63 L264 67Z M1140 40 L1176 67 L1158 63 L1140 75 L1122 62 L1104 66Z M110 70 L140 89 L122 86 L106 94Z M1330 70 L1360 87 L1343 84 L1326 92Z" fill="#fff" opacity=".9"/><path d="M0 300 L0 190 L130 140 L240 175 L360 120 L470 190 L600 215 L720 200 L840 215 L970 190 L1080 120 L1200 175 L1310 140 L1440 190 L1440 300Z" fill="#CFC2F5"/><path d="M0 300 L0 250 L180 220 L360 255 L540 235 L720 260 L900 235 L1080 255 L1260 220 L1440 250 L1440 300Z" fill="#BEADEF"/><path d="M0 300 V292 Q360 280 720 292 T1440 288 V300Z" fill="#F7F4FE"/></svg>';
var MB_BACK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
var MB_ICO_CMP = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4v16M16 4v16M4 8h4M16 16h4"/></svg>';
var MB_ICO_FLAG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 21V3m0 1h12l-3 4 3 4H6"/></svg>';
// montañas teñidas con el color del rango de Codeforces: [fondo, capa lejana, capa cercana]
function mbTint(r) {
  return r >= 2400 ? ['#FDEDEF', '#F9D9DE', '#F3BCC5'] : r >= 2100 ? ['#FDF3E6', '#FAE4C8', '#F5D0A3'] :
    r >= 1900 ? ['#F7EEFB', '#EDDDF6', '#DDC3EF'] : r >= 1600 ? ['#EEF1FD', '#E2E7FB', '#CBD3F6'] :
    r >= 1400 ? ['#EAF7F5', '#D6EFEB', '#B9E3DD'] : r >= 1200 ? ['#EDF7EF', '#DAEFDE', '#C0E3C7'] : ['#F2F2F5', '#E5E5EC', '#D3D3DD'];
}
function mbHeroRank(r) {
  var c = mbTint(r);
  return '<svg viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0 110 L120 60 L220 100 L330 30 L420 90 L520 130 L640 95 L760 140 L880 100 L990 135 L1100 70 L1200 40 L1300 95 L1440 60 L1440 260 L0 260Z" fill="' + c[1] + '"/>' +
    '<path d="M0 170 L150 130 L280 160 L400 120 L540 175 L700 190 L860 170 L1000 190 L1140 140 L1280 165 L1440 140 L1440 260 L0 260Z" fill="' + c[2] + '"/>' +
    '<path d="M0 260 V250 Q720 234 1440 248 V260Z" fill="#F7F4FE"/></svg>';
}
function mbHero(href, label, r) { return '<header class="mb-hero"' + (r != null ? ' style="background:' + mbTint(r)[0] + '"' : '') + '>' + (r != null ? mbHeroRank(r) : MB_HERO) + '<div class="mb-wrap"><a class="mb-back" href="' + href + '">' + MB_BACK + label + '</a></div></header>'; }
function mbPc(n) { return rkRc(n); }

/* ---------- perfil ---------- */
function viewMiembro(h) {
  var m = mbFind(h);
  if (!m) return mbNotFound();
  var st = mbStats(m), c = RK_LV[m[2]], me = m[0] === RK_ME, lc = MB_LVC[m[2]];
  var acts = me ? '<span class="mb-self">Así ven tu perfil los demás miembros</span>' :
    '<a class="mb-btn dark" href="#/comparar/' + encodeURIComponent(m[0]) + '">' + MB_ICO_CMP + 'Comparar conmigo</a><a class="mb-btn" href="#/duelo">' + MB_ICO_FLAG + 'Retar a duelo</a>';
  var HC = ['#F0ECF9', '#E1D5FB', '#CBB7F4', '#B79BEE', '#9873DF', '#7750C1'];
  var heat = st.heat.map(function (k) { return '<span style="background:' + HC[k] + '"></span>'; }).join('');
  var mx = Math.max.apply(null, st.bars);
  var bars = st.bars.map(function (v, i) { return '<div class="mb-bar"><b class="rk-mono">' + v + '</b><i style="height:' + Math.round(v / mx * 112) + 'px;background:' + (i === 4 ? lc[0] : lc[1]) + '"></i><span>' + MB_MES[i] + '</span></div>'; }).join('');
  var lvls = st.levels.map(function (l) { return '<div><div class="mb-lvh"><b>' + l[0] + '</b><span class="rk-mono">' + l[1] + ' / ' + l[2] + '</span></div><div class="mb-track"><i style="width:' + Math.round(l[1] / l[2] * 100) + '%;background:' + MB_LVC[l[0]][0] + '"></i></div></div>'; }).join('');
  var sims = st.sims.slice(0, 4).map(function (s) { return '<div class="mb-sim"><span class="rk-mono mut">' + s.d + '</span><span>' + s.f + '</span><span class="rk-mono r">' + s.r + '</span><b class="rk-mono r" style="color:' + mbPc(s.p) + '">' + s.p + '</b></div>'; }).join('');
  return '<div class="mb-page">' + mbHero('#/carrera', 'Volver al ranking', m[1]) + '<main class="mb-main">' +
    '<section class="mb-card mb-id">' + mbAv(m, 'mb-av') +
      '<div class="mb-idt"><h1 class="rk-dsp">' + mbEsc(m[0]) + '</h1>' + mbRate(m) + '<div class="mb-chips">' +
        mbChip(m[2], c[0], c[1]) + (m[2] !== 'General' ? mbChip('Puesto ' + mbPos(m, m[2]) + ' en ' + m[2], '#F0EBFC', '#4C1D95') : '') +
        mbChip('Puesto ' + mbPos(m, 'General') + ' en General', '#F0EBFC', '#4C1D95') + mbChip('En el club desde ' + st.desde, '#F4F2F8', '#45405F') +
      '</div></div><div class="mb-acts">' + acts + '</div></section>' +
    '<div class="mb-tabs" role="tablist" aria-label="Perfil de ' + mbEsc(m[0]) + '">' +
      [['club', 'En el club'], ['cf', 'En Codeforces']].map(function (x) { return '<button type="button" role="tab" id="mb-tab-' + x[0] + '" aria-controls="mb-tabc" data-mb-tab="' + x[0] + '" aria-selected="' + (MB.tab === x[0]) + '">' + x[1] + '</button>'; }).join('') +
    '</div><div id="mb-tabc" role="tabpanel" aria-labelledby="mb-tab-' + MB.tab + '">' + (MB.tab === 'cf' ? cfView(m) :
    '<div class="mb-metrics">' +
      '<div class="mb-metric"><span>Problemas en el ciclo</span><b class="rk-dsp">' + m[3] + '</b></div>' +
      '<div class="mb-metric"><span>Días activos</span><b class="rk-dsp">' + m[4] + '</b></div>' +
      '<div class="mb-metric"><span>Racha actual</span><b class="rk-dsp">' + st.streak + ' <small>días</small></b><em>Mejor racha: ' + st.best + '</em></div>' +
      '<div class="mb-metric"><span>Mejor performance</span><b class="rk-dsp" style="color:' + mbPc(st.bestSim.p) + '">' + st.bestSim.p + '</b><em>Simulación ' + st.bestSim.f + ', ' + st.bestSim.d + '</em></div>' +
    '</div>' +
    '<div class="mb-g2 a">' +
      '<section class="mb-card"><div class="mb-h2r"><h2 class="rk-dsp">Actividad</h2>' + mbChip(st.monthDays + ' días este mes', '#F0EBFC', '#4C1D95') + '</div><div class="mb-heat" role="img" aria-label="Actividad de las últimas 20 semanas">' + heat + '</div><p class="mb-note">Últimas 20 semanas, solo resoluciones verificadas</p></section>' +
      '<section class="mb-card"><h2 class="rk-dsp">El ciclo mes a mes</h2><div class="mb-bars">' + bars + '</div></section>' +
    '</div><div class="mb-g2">' +
      '<section class="mb-card"><h2 class="rk-dsp">Aprendizaje</h2><p class="mb-sub">Avance en el catálogo de Guía</p><div class="mb-lvls">' + lvls + '</div></section>' +
      '<section class="mb-card"><h2 class="rk-dsp">Simulaciones recientes</h2><div class="mb-sim hd"><span>Fecha</span><span>Formato</span><span class="r">Resueltos</span><span class="r">Perf.</span></div>' + sims + '</section>' +
    '</div>') + '</div></main></div>';
}
function mbNotFound() {
  return '<div class="mb-page">' + mbHero('#/carrera', 'Volver al ranking') + '<main class="mb-main"><section class="mb-card mb-empty"><h1 class="rk-dsp">No encontramos a ese miembro</h1><p>Puede que haya cambiado su handle o que ya no sea parte del club.</p></section></main></div>';
}

/* ---------- comparar ---------- */
function mbDuels(h) { h = h.toLowerCase(); return DU_HIST.filter(function (d) { return d.h.toLowerCase() === h; }); }
function mbCmpRows(a, b, per) {
  var A = mbStats(a)[per], B = mbStats(b)[per];
  return A.map(function (r, i) {
    var x = r[1], y = B[i][1], mx = Math.max(x, y, 1), aw = x >= y, bw = y >= x;
    return '<div class="mb-cmp"><b class="rk-mono r" style="color:' + (aw ? '#1E1B3A' : '#8A85A3') + '">' + x + '</b>' +
      '<span class="mb-cb l"><i style="width:' + Math.round(x / mx * 100) + '%;background:' + (aw ? '#8B5CF6' : '#CDBDF7') + '"></i></span>' +
      '<span class="k">' + r[0] + '</span>' +
      '<span class="mb-cb"><i style="width:' + Math.round(y / mx * 100) + '%;background:' + (bw ? '#E0457B' : '#F4BCCF') + '"></i></span>' +
      '<b class="rk-mono" style="color:' + (bw ? '#1E1B3A' : '#8A85A3') + '">' + y + '</b></div>';
  }).join('');
}
function mbDuelCard(b) {
  var D = mbDuels(b[0]), head = '<div class="mb-h2r"><h2 class="rk-dsp">Duelos entre ustedes</h2>';
  if (!D.length) {
    return '<section class="mb-card">' + head + '</div><div class="mb-noduel"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#F0EBFC"/><path d="M22 20l20 24M42 20L22 44" stroke="#B9A6EC" stroke-width="5" stroke-linecap="round"/></svg>' +
      '<b>Aún no tuvieron duelos</b><p>Cuando se enfrenten, aquí verás cada marcador y quién lleva la ventaja.</p></div>' +
      '<a class="mb-btn dark wide" href="#/duelo">Retar a duelo</a></section>';
  }
  var w = D.filter(function (d) { return d.res === 'w'; }).length, l = D.filter(function (d) { return d.res === 'l'; }).length;
  var tag = { w: ['Victoria', '#DDF4E8', '#0F6B47'], l: ['Derrota', '#FCE4EA', '#A3123E'], d: ['Empate', '#F4F2F8', '#45405F'] };
  var rows = D.map(function (d) { var t = tag[d.res]; return '<div class="mb-duel">' + mbChip(t[0], t[1], t[2]) + '<b class="rk-mono">' + d.me + ' a ' + d.rv + '</b><span class="mut">' + d.n + ' problemas, desde ' + d.lo + '</span><span class="when">' + d.when + '</span></div>'; }).join('');
  return '<section class="mb-card">' + head + '<span class="rk-mono mb-rec" aria-label="' + w + ' victorias y ' + l + ' derrotas">' + w + ' a ' + l + '</span></div>' + rows + '<a class="mb-btn dark wide" href="#/duelo">Retar a duelo</a></section>';
}
function mbChart(a, b) {
  var A = mbStats(a).sims.slice(0, 6).reverse().map(function (s) { return s.p; }), B = mbStats(b).sims.slice(0, 6).reverse().map(function (s) { return s.p; });
  var all = A.concat(B), lo = Math.floor((Math.min.apply(null, all) - 60) / 50) * 50, hi = Math.ceil((Math.max.apply(null, all) + 60) / 50) * 50;
  var y = function (n) { return 230 - (n - lo) / (hi - lo) * 210; }, xs = [66, 164, 262, 360, 458, 530];
  var line = function (v) { return v.map(function (n, i) { return (i ? 'L' : 'M') + xs[i] + ' ' + y(n).toFixed(1); }).join(' '); };
  var bands = [[0, 1200, '#F1F1F1'], [1200, 1400, '#EDF5ED'], [1400, 1600, '#E5F5F0'], [1600, 1900, '#EDF0FC'], [1900, 9999, '#F6EAF6']], g = '';
  bands.forEach(function (k) { var t = Math.min(hi, k[1]), u = Math.max(lo, k[0]); if (t > u) g += '<rect x="44" y="' + y(t).toFixed(1) + '" width="506" height="' + (y(u) - y(t)).toFixed(1) + '" fill="' + k[2] + '"/>'; });
  [hi, lo].concat([1200, 1400, 1600, 1900].filter(function (t) { return t > lo + 30 && t < hi - 30; })).forEach(function (t) { g += '<text x="36" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#625C80" font-family="IBM Plex Mono, monospace">' + t + '</text>'; });
  xs.forEach(function (x, i) { g += '<text x="' + x + '" y="252" text-anchor="middle" font-size="11"' + (i === 5 ? ' font-weight="700" fill="#1E1B3A">Última' : ' fill="#625C80">' + (i + 1)) + '</text>'; });
  return '<svg viewBox="0 0 560 260" role="img" aria-label="Tu performance va de ' + A[0] + ' a ' + A[5] + ' y la de ' + b[0] + ' de ' + B[0] + ' a ' + B[5] + '">' + g +
    '<path class="mb-ln" d="' + line(A) + '" fill="none" stroke="#8B5CF6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path class="mb-ln" d="' + line(B) + '" fill="none" stroke="#E0457B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function viewComparar(h) {
  var b = mbFind(h), a = mbFind(RK_ME);
  if (!b) return mbNotFound();
  if (b === a) return viewMiembro(h);
  var sa = mbStats(a), sb = mbStats(b);
  var side = function (m, mine) {
    var c = RK_LV[m[2]];
    return '<div class="mb-side' + (mine ? '' : ' rv') + '">' + mbAv(m, 'mb-av sm', ' style="box-shadow:0 0 0 3px ' + (mine ? '#8B5CF6' : '#F05A8C') + '"') +
      '<div class="mb-sidet"><span class="who" style="color:' + (mine ? '#6D28D9' : '#B4234F') + '">' + (mine ? 'Tú' : 'Rival') + '</span><b class="rk-dsp">' + mbEsc(m[0]) + '</b>' + mbRate(m) +
      '<span class="mb-chips">' + mbChip(m[2], c[0], c[1]) + mbChip('Puesto ' + mbPos(m, 'General'), '#F0EBFC', '#4C1D95') + '</span></div></div>';
  };
  var per = [['ciclo', 'Este ciclo'], ['mes', 'Noviembre']].map(function (p) { return '<button type="button" data-mb-per="' + p[0] + '" aria-pressed="' + (p[0] === MB.per) + '">' + p[1] + '</button>'; }).join('');
  var lv = sa.levels.map(function (l, i) {
    var o = sb.levels[i];
    return '<div><div class="mb-lvh"><b>' + l[0] + '</b><span class="mut">de ' + l[2] + '</span></div>' +
      '<div class="mb-lvr"><span style="color:#6D28D9">Tú</span><span class="mb-track sm"><i style="width:' + Math.round(l[1] / l[2] * 100) + '%;background:#8B5CF6"></i></span><b class="rk-mono">' + l[1] + '</b></div>' +
      '<div class="mb-lvr"><span style="color:#B4234F">' + mbEsc(b[0]) + '</span><span class="mb-track sm"><i style="width:' + Math.round(o[1] / o[2] * 100) + '%;background:#E0457B"></i></span><b class="rk-mono">' + o[1] + '</b></div></div>';
  }).join('');
  return '<div class="mb-page">' + mbHero('#/miembro/' + encodeURIComponent(b[0]), 'Volver al perfil') + '<main class="mb-main">' +
    '<section class="mb-card mb-vs">' + side(a, true) + '<div class="mb-mid"><span class="rk-dsp">frente a</span><div class="mb-seg" role="group" aria-label="Período">' + per + '</div></div>' + side(b, false) + '</section>' +
    '<div class="mb-g2 c"><section class="mb-card" aria-label="Comparación de métricas"><h2 class="rk-dsp">Cara a cara</h2><div id="mb-rows">' + mbCmpRows(a, b, MB.per) + '</div></section>' + mbDuelCard(b) + '</div>' +
    '<div class="mb-g2 d"><section class="mb-card"><h2 class="rk-dsp">Aprendizaje</h2><p class="mb-sub">Problemas verificados del catálogo de Guía</p><div class="mb-lvls">' + lv + '</div></section>' +
      '<section class="mb-card"><div class="mb-h2r top"><div><h2 class="rk-dsp">Performance en simulaciones</h2><p class="mb-sub">Últimas seis sesiones de cada uno</p></div><div class="mb-leg"><span><i style="background:#8B5CF6"></i>Tú</span><span><i style="background:#E0457B"></i>' + mbEsc(b[0]) + '</span></div></div>' + mbChart(a, b) + '</section></div>' +
    '</main></div>';
}

/* ---------- animaciones ---------- */
// Distintas al cambio de sección del menú: el perfil "se arma" pieza por pieza y comparar enfrenta a los dos lados.
function mbReduced() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
var MB_SPRING = 'cubic-bezier(.34,1.45,.5,1)', MB_OUT = 'cubic-bezier(.2,.8,.2,1)';
function mbA(el, k, o) { if (el) el.animate(k, Object.assign({ fill: 'backwards', easing: MB_OUT }, o)); }
// los números suben desde cero
function mbCount(el, delay, dur) {
  var t = el.firstChild; if (!t || t.nodeType !== 3) return;
  var to = parseInt(t.nodeValue, 10), rest = t.nodeValue.replace(/^\d+/, ''); if (isNaN(to)) return;
  t.nodeValue = '0' + rest;
  var start = null;
  function step(ts) {
    if (start === null) start = ts + delay;
    var p = Math.max(0, Math.min(1, (ts - start) / dur)), e = 1 - Math.pow(1 - p, 3);
    t.nodeValue = Math.round(to * e) + rest;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  setTimeout(function () { t.nodeValue = to + rest; }, delay + dur + 400);
}
// salida propia: lo actual se desenfoca y se aleja un poco
function mbSwap() {
  V.classList.remove('leave', 'enter');
  var old = V.firstElementChild;
  if (old) old.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(.985)', filter: 'blur(6px)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' });
  V._t = setTimeout(function () { render(); window.scrollTo(0, 0); }, 220);
}
function mbEnter(root) {
  if (!root || mbReduced()) return;
  mbA(root.querySelector('.mb-hero>svg'), [{ opacity: 0, transform: 'translate(-50%,50px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 800 });
  mbA(root.querySelector('.mb-back'), [{ opacity: 0, transform: 'translateX(-24px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 80 });
  if (root.querySelector('.mb-vs')) mbEnterCmp(root); else mbEnterProfile(root);
}
function mbEnterProfile(root) {
  var id = root.querySelector('.mb-id');
  // la card de identidad se despliega desde arriba y el avatar cae con rebote
  mbA(id, [{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 24px)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0 round 24px)' }], { duration: 520, delay: 60 });
  mbA(id.querySelector('.mb-av'), [{ opacity: 0, transform: 'scale(.3) rotate(-18deg)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: 220, easing: MB_SPRING });
  mbA(id.querySelector('h1'), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 520, delay: 320 });
  mbA(id.querySelector('.mb-rt'), [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 520 });
  id.querySelectorAll('.mb-chip').forEach(function (el, i) { mbA(el, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 560 + i * 70, easing: MB_SPRING }); });
  id.querySelectorAll('.mb-acts>*').forEach(function (el, i) { mbA(el, [{ opacity: 0, transform: 'translateX(28px)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: 420 + i * 90 }); });
  mbEnterClub(root, 0);
}
// pestaña "En el club": métricas, actividad y cards; off adelanta las demoras al cambiar de pestaña
function mbEnterClub(root, off) {
  var A = function (el, k, o) { o.delay = Math.max(0, (o.delay || 0) + off); mbA(el, k, o); };
  // métricas: aparecen girando un poco hacia el frente y su número cuenta
  root.querySelectorAll('.mb-metric').forEach(function (el, i) {
    A(el, [{ opacity: 0, transform: 'perspective(600px) rotateX(-35deg)', transformOrigin: 'top' }, { opacity: 1, transform: 'none', transformOrigin: 'top' }], { duration: 560, delay: 420 + i * 80 });
    mbCount(el.querySelector('b'), Math.max(0, 460 + i * 80 + off), 900);
  });
  // actividad: las celdas se encienden columna por columna
  root.querySelectorAll('.mb-heat span').forEach(function (el, i) { A(el, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 650 + Math.floor(i / 7) * 28 + (i % 7) * 10 }); });
  root.querySelectorAll('.mb-bar i').forEach(function (el, i) { A(el, [{ transform: 'scaleY(0)' }, { transform: 'none' }], { duration: 620, delay: 700 + i * 70, easing: MB_SPRING }); });
  root.querySelectorAll('.mb-bar b').forEach(function (el, i) { A(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: 1000 + i * 70 }); });
  // cards de abajo: entran desde los lados
  root.querySelectorAll('.mb-g2 > .mb-card').forEach(function (el, i) { A(el, [{ opacity: 0, transform: 'translateX(' + (i % 2 ? 40 : -40) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: 560 + i * 90 }); });
  root.querySelectorAll('.mb-track i').forEach(function (el, i) { A(el, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 800, delay: 900 + i * 110 }); });
  root.querySelectorAll('.mb-sim:not(.hd)').forEach(function (el, i) { A(el, [{ opacity: 0, transform: 'translateX(16px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 900 + i * 70 }); });
}
function mbRowsIn(box, d) {
  // las barras salen del centro hacia cada lado y los números cuentan
  box.querySelectorAll('.mb-cmp').forEach(function (el, i) {
    mbA(el.querySelector('.k'), [{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: d + i * 60 });
    el.querySelectorAll('.mb-cb i').forEach(function (b) { mbA(b, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 620, delay: d + 80 + i * 60 }); });
    el.querySelectorAll('b').forEach(function (b) { mbA(b, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: d + 80 + i * 60 }); mbCount(b, d + 80 + i * 60, 700); });
  });
}
function mbEnterCmp(root) {
  var vs = root.querySelector('.mb-vs'), L = vs.querySelector('.mb-side:not(.rv)'), R = vs.querySelector('.mb-side.rv'), mid = vs.querySelector('.mb-mid');
  mbA(vs, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 40 });
  // cada lado llega desde su borde, como al entrar a un enfrentamiento
  mbA(L, [{ opacity: 0, transform: 'translateX(-90px)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: 120, easing: MB_SPRING });
  mbA(R, [{ opacity: 0, transform: 'translateX(90px)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: 120, easing: MB_SPRING });
  // "frente a" cae encima con golpe
  mbA(mid.firstChild, [{ opacity: 0, transform: 'scale(2.2)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 480, easing: MB_SPRING });
  mbA(mid.querySelector('.mb-seg'), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 640 });
  var cards = root.querySelectorAll('.mb-g2 > .mb-card');
  cards.forEach(function (el, i) { mbA(el, [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: 560 + i * 90 }); });
  mbRowsIn(root.querySelector('#mb-rows'), 760);
  root.querySelectorAll('.mb-duel').forEach(function (el, i) { mbA(el, [{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 820 + i * 90 }); });
  var nd = root.querySelector('.mb-noduel svg');
  mbA(nd, [{ opacity: 0, transform: 'rotate(-90deg) scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: 820, easing: MB_SPRING });
  root.querySelectorAll('.mb-lvr .mb-track i').forEach(function (el, i) { mbA(el, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 700, delay: 900 + i * 70 }); });
  root.querySelectorAll('.mb-ln').forEach(function (el, i) {
    var len = el.getTotalLength ? el.getTotalLength() : 0; if (!len) return;
    el.style.strokeDasharray = len; mbA(el, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1100, delay: 1000 + i * 200, easing: 'ease-in-out' });
  });
}
function mbSetPer(k) {
  if (k === MB.per) return;
  MB.per = k;
  document.querySelectorAll('[data-mb-per]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mbPer === k)); });
  var box = document.getElementById('mb-rows'), h = (location.hash.split('/')[2] || '');
  if (!box) return;
  var a = mbFind(RK_ME), b = mbFind(decodeURIComponent(h));
  if (mbReduced()) { box.innerHTML = mbCmpRows(a, b, k); return; }
  box.getAnimations({ subtree: true }).forEach(function (x) { x.cancel(); });
  box.querySelectorAll('.mb-cb i').forEach(function (el) { el.animate([{ transform: 'none' }, { transform: 'scaleX(0)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' }); });
  clearTimeout(box._t);
  box._t = setTimeout(function () { box.innerHTML = mbCmpRows(a, b, k); mbRowsIn(box, 0); }, 170);
}
document.addEventListener('click', function (e) { var b = e.target.closest('[data-mb-per]'); if (b) mbSetPer(b.dataset.mbPer); });
function mbSetTab(k) {
  var box = document.getElementById('mb-tabc'); if (!box || k === MB.tab) return;
  var h = decodeURIComponent(location.hash.split('/')[2] || ''); if (!mbFind(h)) return;
  MB.tab = k;
  document.querySelectorAll('[data-mb-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.mbTab === k)); });
  box.setAttribute('aria-labelledby', 'mb-tab-' + k);
  history.replaceState(null, '', '#/miembro/' + encodeURIComponent(h) + '/' + k);
  var tmp = document.createElement('div'); tmp.innerHTML = viewMiembro(h);
  var put = function () { box.innerHTML = tmp.querySelector('#mb-tabc').innerHTML; if (k === 'club') mbEnterClub(box, -400); };
  if (mbReduced()) { put(); return; }
  clearTimeout(box._t);
  box.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 170, easing: 'ease-in', fill: 'forwards' });
  box._t = setTimeout(function () { box.getAnimations().forEach(function (a) { a.cancel(); }); put(); }, 170);
}
document.addEventListener('click', function (e) { var b = e.target.closest('[data-mb-tab]'); if (b) mbSetTab(b.dataset.mbTab); });
