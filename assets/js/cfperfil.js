/* Perfil Codeforces de un miembro (pestaña "En Codeforces"). Datos de ejemplo: los de Jean_Pool salen de sus
   capturas de Codeforces y sus extensiones; los demás miembros se derivan de su rating. No se consulta la API. */
var CF = { sec: 'rating', heat: 'act', m: null };
var CF_SECS = [['rating', 'Rating'], ['actividad', 'Actividad'], ['problemas', 'Problemas'], ['temas', 'Temas'], ['envios', 'Envíos'], ['contests', 'Contests'], ['semana', 'Semana a semana'], ['pendientes', 'Sin resolver']];
var CF_MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var CF_RATING = [['2024-07-02', 380], ['2024-07-16', 640], ['2024-08-01', 820], ['2024-08-20', 930], ['2024-09-25', 990], ['2024-10-04', 1010], ['2024-10-06', 968],
  ['2024-10-13', 1042], ['2024-11-20', 1108], ['2024-12-05', 1132], ['2024-12-12', 1102], ['2024-12-20', 1150], ['2024-12-22', 1171], ['2024-12-24', 1182],
  ['2024-12-28', 1166], ['2025-01-25', 1190], ['2025-02-01', 1122], ['2025-02-05', 1221], ['2025-02-08', 1296], ['2025-05-25', 1305], ['2025-06-01', 1402],
  ['2025-09-01', 1386], ['2025-09-04', 1421], ['2025-10-01', 1456], ['2025-10-20', 1444], ['2025-11-10', 1466], ['2025-12-20', 1480], ['2026-01-05', 1496],
  ['2026-01-10', 1512], ['2026-02-01', 1531], ['2026-03-01', 1592], ['2026-03-25', 1495], ['2026-04-05', 1551], ['2026-05-01', 1502], ['2026-05-10', 1506],
  ['2026-05-20', 1491], ['2026-06-25', 1545], ['2026-07-02', 1548], ['2026-10-28', 1548], ['2026-11-12', 1689], ['2026-11-16', 1701]];
var CF_ROUNDS = ['Codeforces Round 1068 (Div. 2)', 'Educational Round 186 (Div. 2)', 'Codeforces Round 1061 (Div. 2)', 'Codeforces Round 1037 (Div. 3)',
  'Codeforces Round 1035 (Div. 2)', 'Educational Round 179 (Div. 2)', 'Codeforces Round 1025 (Div. 2)', 'Codeforces Round 1022 (Div. 2)'];
var CF_HIST = [[800, 450], [900, 114], [1000, 127], [1100, 137], [1200, 124], [1300, 97], [1400, 71], [1500, 41], [1600, 32], [1700, 19], [1800, 18], [1900, 23], [2000, 11], [2100, 3], [2200, 3], [2300, 2], [2400, 1], [2800, 1]];
var CF_TAGS = [['implementation', 563], ['greedy', 486], ['math', 455], ['brute force', 260], ['constructive algorithms', 188], ['sortings', 177], ['strings', 146],
  ['number theory', 110], ['dp', 105], ['data structures', 103], ['binary search', 91], ['two pointers', 61], ['dfs and similar', 49], ['graphs', 42], ['bitmasks', 35], ['dsu', 34], ['trees', 33]];
var CF_UNSOLVED = ['2053-C', '1000-D', '2126-F', '1891-C', '222-C', '103640-M', '103185-C', '1203-F1', '1118-D1', '2183-D2', '9-E', '873-A', '2211-C1', '1628-B', '101755-G', '101755-D', '2257-E', '744-A', '106682-J', '2000-H', '2276-G', '2275-H'];
var CF_VERD = [['AC', 2104, '#2BB673'], ['WA', 1182, '#F05A8C'], ['TLE', 214, '#3B8BEB'], ['MLE', 19, '#F5A524'], ['RE', 96, '#9C6ADE'], ['CE', 61, '#9A96AE']];
var CF_INDEX = [['A', 512], ['B', 438], ['C', 297], ['D', 152], ['E', 61], ['F', 24], ['G+', 13]];
var CF_ICO = {
  l: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  r: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  ext: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};

function cfTier(r) { return r < 1200 ? '#BDB9CC' : r < 1400 ? '#72C585' : r < 1600 ? '#5CC6B6' : r < 1900 ? '#8C9EEE' : r < 2100 ? '#D186E6' : r < 2400 ? '#F3B062' : '#E8607A'; }
function cfDate(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
function cfFmt(d) { return d.getUTCDate() + ' ' + CF_MES[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
function cfRnd(seed) { var x = seed % 2147483647 || 1; return function () { x = x * 16807 % 2147483647; return (x - 1) / 2147483646; }; }

/* ---------- datos por miembro ---------- */
function cfData(m) {
  if (m._cf) return m._cf;
  var me = m[0] === RK_ME, R = m[1], seed = mbSeed(m[0]), rnd = cfRnd(seed + 11);
  var k = me ? 1 : Math.max(.18, Math.pow(R / 1701, 2.2));
  var sc = function (v) { return me ? v : Math.max(0, Math.round(v * k)); };
  var rating = CF_RATING.map(function (x) { return { d: cfDate(x[0]), r: me ? x[1] : Math.round(380 + (x[1] - 380) * (R - 380) / 1321) }; });
  var hist = CF_HIST.map(function (h) { return [h[0], h[0] > R + 350 && !me ? 0 : sc(h[1])]; });
  var tags = CF_TAGS.map(function (t) { return [t[0], sc(t[1])]; });
  var index = CF_INDEX.map(function (t, i) { return [t[0], i > 3 && R < 1500 && !me ? Math.round(sc(t[1]) / 3) : sc(t[1])]; });
  var verd = CF_VERD.map(function (v) { return [v[0], sc(v[1]), v[2]]; });
  var nUns = me ? 22 : 6 + seed % 14, uns = CF_UNSOLVED.slice(seed % 5, seed % 5 + nUns);
  // actividad del último año, de lunes a hoy
  var end = Date.UTC(2026, 10, 21), endD = new Date(end), wd = (endD.getUTCDay() + 6) % 7;
  var start = end - (wd + 52 * 7) * 864e5, days = [], dens = me ? null : Math.min(.6, m[4] / 160);
  var monthD = { 11: .45, 0: .4, 1: .3, 2: .55, 3: .35, 4: .4, 5: .15, 6: .12, 7: .2, 8: .55, 9: .35, 10: .3 };
  for (var t = start; t <= end; t += 864e5) {
    var d = new Date(t), on = rnd() < (dens != null ? dens * (.6 + monthD[d.getUTCMonth()]) : monthD[d.getUTCMonth()]);
    var n = on ? [1, 1, 1, 2, 2, 3, 4, 6][Math.floor(rnd() * 8)] : 0, mx = 0;
    if (n) { var base = 800 + (t - start) / 864e5 * 1.4 * (R / 1701); mx = Math.floor(Math.min(R + 300, Math.max(800, base + (rnd() - .5) * 600)) / 100) * 100; }
    days.push({ d: d, n: n, mx: mx });
  }
  var year = 0, month = 0, best = 0, cur = 0, bestM = 0, curM = 0;
  days.forEach(function (x, i) {
    year += x.n; if (i >= days.length - 30) { month += x.n; curM = x.n ? curM + 1 : 0; bestM = Math.max(bestM, curM); }
    cur = x.n ? cur + 1 : 0; best = Math.max(best, cur);
  });
  var solved = me ? 1519 : Math.max(year + 40, sc(1519));
  var max = rating.reduce(function (a, b) { return b.r > a.r ? b : a; });
  var deltas = rating.slice(1).map(function (x, i) { return { i: i + 1, d: x.r - rating[i].r }; });
  var up = deltas.reduce(function (a, b) { return b.d > a.d ? b : a; }), dn = deltas.reduce(function (a, b) { return b.d < a.d ? b : a; });
  var contests = [];
  for (var c = 0; c < 8; c++) {
    var j = rating.length - 1 - c, rk = me ? [612, 388, 2104, 1450, 1720, 3311, 2580, 4012][c] : 300 + (seed * (c + 3)) % 5200;
    contests.push({ d: rating[j].d, name: CF_ROUNDS[c], rank: rk, old: rating[j - 1].r, now: rating[j].r });
  }
  var hard = 0; hist.forEach(function (h) { if (h[1]) hard = h[0]; });
  var wk = me ? [6, 3, 0, 3] : [seed % 9, seed % 4, seed % 2, seed % 3];
  m._cf = {
    rating: rating, max: max, hist: hist, tags: tags, index: index, verd: verd, uns: uns, days: days, start: new Date(start), contests: contests,
    solved: solved, year: me ? 431 : year, month: me ? 18 : month, best: me ? 53 : best + 9, bestY: me ? 6 : best, bestM: me ? 2 : bestM,
    hard: hard, avg: me ? 1082 : Math.round(900 + (R - 900) * .45), bestRank: me ? 388 : 300 + seed % 900,
    up: up, dn: dn, first: me ? '12 jun 2024' : '3 jul 2024', week: wk, firstTry: me ? 58 : 40 + seed % 25
  };
  return m._cf;
}

/* ---------- piezas ---------- */
function cfHead(t, sub, extra) { return '<div class="cf-ch"><div><h2 class="rk-dsp">' + t + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (extra || '') + '</div>'; }

function cfRatingSvg(D) {
  var W = 880, H = 320, pl = 52, pr = 16, pt = 14, pb = 30, lo = 300, hi = Math.max(1900, Math.ceil((D.max.r + 100) / 100) * 100);
  var t0 = Date.UTC(2024, 5, 20), t1 = Date.UTC(2026, 10, 30);
  var X = function (d) { return pl + (d - t0) / (t1 - t0) * (W - pl - pr); }, Y = function (r) { return pt + (hi - r) / (hi - lo) * (H - pt - pb); };
  var g = '', bands = [[lo, 1200, '#EFEEF3'], [1200, 1400, '#E6F5E9'], [1400, 1600, '#E2F5F1'], [1600, 1900, '#E8ECFC'], [1900, 2100, '#F6EAF6'], [2100, 2400, '#FDF1E2'], [2400, 4000, '#FCE8EB']];
  bands.forEach(function (b) { var a = Math.max(lo, b[0]), c = Math.min(hi, b[1]); if (c > a) g += '<rect x="' + pl + '" y="' + Y(c).toFixed(1) + '" width="' + (W - pl - pr) + '" height="' + (Y(a) - Y(c)).toFixed(1) + '" fill="' + b[2] + '"/>'; });
  [1200, 1400, 1600, 1900, 2100, 2400].forEach(function (r) {
    if (r >= hi) return;
    g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(r).toFixed(1) + '" y2="' + Y(r).toFixed(1) + '" stroke="#fff"/><text x="' + (pl - 8) + '" y="' + (Y(r) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#625C80" font-family="IBM Plex Mono, monospace">' + r + '</text>';
  });
  [[2024, 6], [2024, 9], [2025, 0], [2025, 3], [2025, 6], [2025, 9], [2026, 0], [2026, 3], [2026, 6], [2026, 9]].forEach(function (q) {
    g += '<text x="' + X(Date.UTC(q[0], q[1], 1)).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#625C80" font-family="IBM Plex Mono, monospace">' + CF_MES[q[1]] + ' ' + String(q[0]).slice(2) + '</text>';
  });
  var pts = D.rating.map(function (p) { return [X(p.d), Y(p.r)]; });
  g += '<path class="cf-draw" pathLength="1" d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ') + '" fill="none" stroke="#E0A526" stroke-width="2.5" stroke-linejoin="round"/>';
  pts.forEach(function (p) { g += '<circle class="cf-dot" style="animation-delay:' + Math.round(300 + p[0] / W * 900) + 'ms" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.4" fill="#fff" stroke="#E0A526" stroke-width="2"/>'; });
  var L = pts[pts.length - 1];
  g += '<circle class="cf-dot" style="animation-delay:1250ms" cx="' + L[0].toFixed(1) + '" cy="' + L[1].toFixed(1) + '" r="7" fill="#E0457B" stroke="#fff" stroke-width="3"/>';
  return '<svg class="cf-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Rating de ' + D.rating[0].r + ' en julio de 2024 a ' + D.rating[D.rating.length - 1].r + ' en noviembre de 2026, en ' + D.rating.length + ' contests">' + g + '</svg>';
}

function cfHeat(D, mode) {
  var sc = ['#EEEAF8', '#D9CCF7', '#B79CF2', '#8B5CF6', '#5B2FC9'], cells = '', mon = '', last = -1;
  D.days.forEach(function (x, j) {
    var c = mode === 'act' ? sc[x.n === 0 ? 0 : x.n === 1 ? 1 : x.n === 2 ? 2 : x.n <= 4 ? 3 : 4] : (x.n ? cfTier(x.mx) : '#EEEAF8');
    cells += '<i style="background:' + c + ';animation-delay:' + (Math.floor(j / 7) * 14) + 'ms" title="' + cfFmt(x.d) + ': ' + x.n + (x.n === 1 ? ' problema' : ' problemas') + (mode === 'rat' && x.n ? ', máx. ' + x.mx : '') + '"></i>';
  });
  var weeks = Math.ceil(D.days.length / 7);
  for (var w = 0; w < weeks; w++) {
    var dd = new Date(D.start.getTime() + w * 7 * 864e5);
    if (dd.getUTCMonth() !== last && dd.getUTCDate() <= 7) { mon += '<span style="grid-column:' + (w + 1) + ' / span 4">' + CF_MES[dd.getUTCMonth()] + '</span>'; last = dd.getUTCMonth(); }
  }
  var leg = mode === 'act'
    ? '<div class="cf-leg"><span>Menos</span>' + sc.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '<span>Más</span></div>'
    : '<div class="cf-leg">' + [[800, '&lt;1200'], [1200, '1200'], [1400, '1400'], [1600, '1600'], [1900, '1900'], [2100, '2100'], [2400, '2400+']].map(function (x) { return '<span><i style="background:' + cfTier(x[0]) + '"></i>' + x[1] + '</span>'; }).join('') + '</div>';
  return '<div class="cf-hm"><div class="cf-hm-l" aria-hidden="true"><span></span><span></span><span>lun</span><span></span><span>mié</span><span></span><span>vie</span><span></span></div>' +
    '<div class="cf-hm-s"><div class="cf-hm-m" style="grid-template-columns:repeat(' + weeks + ',11px)" aria-hidden="true">' + mon + '</div>' +
    '<div class="cf-hm-g" role="img" aria-label="' + (mode === 'act' ? 'Problemas resueltos por día' : 'Rating máximo resuelto por día') + ' en el último año">' + cells + '</div></div></div>' + leg;
}

function cfHist(D) {
  var W = 880, H = 300, pl = 36, pb = 26, pt = 22, n = D.hist.length, bw = (W - pl - 6) / n;
  var mx = Math.max.apply(null, D.hist.map(function (h) { return h[1]; })) || 1, step = mx > 300 ? 100 : mx > 120 ? 50 : mx > 40 ? 20 : 5, g = '';
  for (var v = 0; v <= mx; v += step) { var y = pt + (mx - v) / mx * (H - pt - pb); g += '<line x1="' + pl + '" x2="' + W + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#EEEAF8"/><text x="' + (pl - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="10" fill="#625C80" font-family="IBM Plex Mono, monospace">' + v + '</text>'; }
  D.hist.forEach(function (h, i) {
    var hh = h[1] / mx * (H - pt - pb), x = pl + i * bw + 3, y = H - pb - hh, cx = (x + (bw - 6) / 2).toFixed(1);
    g += '<rect class="cf-gy" style="animation-delay:' + i * 40 + 'ms" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw - 6).toFixed(1) + '" height="' + Math.max(hh, 1.5).toFixed(1) + '" rx="4" fill="' + cfTier(h[0]) + '"/>';
    g += '<text x="' + cx + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="600" fill="#1E1B3A" font-family="IBM Plex Mono, monospace">' + h[1] + '</text>';
    g += '<text x="' + cx + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="#625C80" font-family="IBM Plex Mono, monospace">' + h[0] + '</text>';
  });
  return '<svg class="cf-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Problemas resueltos por rating, de 800 a 2800">' + g + '</svg>';
}

function cfIndex(D) {
  var mx = Math.max.apply(null, D.index.map(function (x) { return x[1]; })) || 1;
  return '<div class="cf-ibs" role="img" aria-label="Resueltos por letra: ' + D.index.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + '">' +
    D.index.map(function (x, i) { return '<div class="cf-ib"><b class="rk-mono">' + x[1] + '</b><i style="height:' + Math.max(3, Math.round(x[1] / mx * 130)) + 'px;animation-delay:' + i * 60 + 'ms"></i><span class="rk-dsp">' + x[0] + '</span></div>'; }).join('') + '</div>';
}

function cfRecords(D) {
  var dl = function (v) { return v > 0 ? '+' + v : '−' + (-v); };
  var R = [[D.hard, 'Problema más difícil', 'Con rating de Codeforces', cfTier(D.hard)], [D.avg, 'Rating promedio', 'De los problemas con rating', ''],
    [D.bestRank, 'Mejor puesto', 'En un contest con rating', ''], [dl(D.up.d), 'Mayor subida', cfFmt(D.rating[D.up.i].d), '#16A34A'],
    [dl(D.dn.d), 'Mayor caída', cfFmt(D.rating[D.dn.i].d), '#DC2626'], [D.first, 'Primer AC', 'En Codeforces', '']];
  return '<div class="cf-rcs">' + R.map(function (x) { return '<div class="cf-rc"><b class="rk-dsp"' + (x[3] ? ' style="color:' + x[3] + '"' : '') + '>' + x[0] + '</b><span>' + x[1] + '</span><em>' + x[2] + '</em></div>'; }).join('') + '</div>';
}

function cfTags(D) {
  var mx = D.tags[0][1] || 1;
  return '<div class="cf-tgs">' + D.tags.map(function (t, i) { return '<div class="cf-tg"><span>' + t[0] + '</span><i><s style="width:' + (t[1] / mx * 100).toFixed(1) + '%;animation-delay:' + i * 35 + 'ms"></s></i><b class="rk-mono">' + t[1] + '</b></div>'; }).join('') + '</div>';
}

function cfVerd(D) {
  var tot = D.verd.reduce(function (a, v) { return a + v[1]; }, 0) || 1;
  return '<div class="cf-vbar" role="img" aria-label="Veredictos: ' + D.verd[0][1] + ' AC de ' + tot + ' envíos">' + D.verd.map(function (v) { return '<s style="width:' + (v[1] / tot * 100).toFixed(2) + '%;background:' + v[2] + '"></s>'; }).join('') + '</div>' +
    '<div class="cf-vls">' + D.verd.map(function (v) { return '<div class="cf-vl"><i style="background:' + v[2] + '"></i><span>' + v[0] + '</span><b class="rk-mono">' + v[1] + '</b><em class="rk-mono">' + Math.round(v[1] / tot * 100) + '%</em></div>'; }).join('') + '</div>' +
    '<div class="cf-note"><b class="rk-dsp">' + D.firstTry + '%</b><span>de los problemas aceptados al primer intento · ' + tot + ' envíos en total</span></div>';
}

function cfContests(D) {
  return '<div class="cf-tw"><table class="cf-ct"><thead><tr><th>Fecha</th><th>Contest</th><th class="r">Puesto</th><th class="r">Cambio</th><th class="r">Rating</th></tr></thead><tbody>' +
    D.contests.map(function (c) {
      var dl = c.now - c.old, col = dl > 0 ? '#16A34A' : dl < 0 ? '#DC2626' : '#625C80';
      return '<tr><td class="rk-mono mut">' + cfFmt(c.d) + '</td><td><a href="https://codeforces.com/contests" target="_blank" rel="noopener">' + c.name + '</a></td><td class="rk-mono r">' + c.rank + '</td><td class="rk-mono r" style="color:' + col + ';font-weight:700">' + (dl > 0 ? '+' + dl : dl < 0 ? '−' + (-dl) : '0') + '</td><td class="rk-mono r"><b style="color:' + rkRc(c.now) + '">' + c.now + '</b></td></tr>';
    }).join('') + '</tbody></table></div><a href="https://codeforces.com/contests/with/' + encodeURIComponent(CF.m[0]) + '" target="_blank" rel="noopener" class="cf-more">Ver los ' + D.rating.length + ' contests en Codeforces' + CF_ICO.ext + '</a>';
}

function cfWeek(D) {
  var w = D.week, don = [['AC', w[0], '#2BB673'], ['WA', w[1], '#F05A8C'], ['TLE', w[2], '#3B8BEB'], ['Otros', w[3], '#F5C451']], tot = w[0] + w[1] + w[2] + w[3], a0 = -90, arcs = '';
  don.forEach(function (x) {
    if (!x[1]) return;
    var a1 = a0 + x[1] / tot * 360, r = 44, rad = Math.PI / 180;
    arcs += '<path class="cf-arc" pathLength="1" d="M' + (56 + r * Math.cos(a0 * rad)).toFixed(2) + ' ' + (56 + r * Math.sin(a0 * rad)).toFixed(2) + ' A44 44 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + (56 + r * Math.cos(a1 * rad)).toFixed(2) + ' ' + (56 + r * Math.sin(a1 * rad)).toFixed(2) + '" fill="none" stroke="' + x[2] + '" stroke-width="18"/>';
    a0 = a1;
  });
  var rows = [['Rating máximo', D.max.r], ['Resueltos', w[0]], ['Envíos', tot], ['Problema más difícil', w[0] ? Math.min(D.hard, CF.m[1] + 200) : '—'], ['Rating promedio', w[0] ? Math.round(CF.m[1] * .85 / 100) * 100 : '—'], ['Contests', 0], ['Virtuales', 1]];
  var nav = '<div class="cf-wn"><button type="button" class="cf-ib2" aria-label="Semana anterior">' + CF_ICO.l + '</button><button type="button" class="cf-ib2" aria-label="Semana siguiente" disabled>' + CF_ICO.r + '</button></div>';
  return cfHead('Semana a semana', '15 al 21 de noviembre de 2026 · semana actual', nav) +
    '<div class="cf-wk"><div class="cf-wt">' + rows.map(function (x, i) { return '<div class="cf-pr" style="animation-delay:' + i * 40 + 'ms"><span>' + x[0] + '</span><b class="rk-mono">' + x[1] + '</b></div>'; }).join('') + '</div>' +
    '<div class="cf-dn"><svg viewBox="0 0 112 112" width="112" height="112" role="img" aria-label="' + don.map(function (x) { return x[1] + ' ' + x[0]; }).join(', ') + '">' + (tot ? arcs : '<circle cx="56" cy="56" r="44" fill="none" stroke="#EEEAF8" stroke-width="18"/>') + '<text x="56" y="62" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="800" font-size="20" fill="#1E1B3A">' + tot + '</text></svg>' +
    '<div class="cf-dl">' + don.map(function (x) { return '<div class="cf-vl"><i style="background:' + x[2] + '"></i><span>' + x[0] + '</span><b class="rk-mono">' + x[1] + '</b></div>'; }).join('') + '</div></div></div>' +
    '<div class="cf-pv"><span><b>Semana anterior</b> · 8 al 14 nov</span><span class="mut">Sin envíos</span></div>';
}

function cfUnsolved(D) {
  return '<div class="cf-uss">' + D.uns.map(function (p, i) {
    var q = p.split('-'), gym = +q[0] > 100000;
    return '<a class="cf-us rk-mono" style="animation-delay:' + i * 25 + 'ms" href="https://codeforces.com/' + (gym ? 'gym' : 'contest') + '/' + q[0] + '/problem/' + q[1] + '" target="_blank" rel="noopener">' + p + '</a>';
  }).join('') + '</div>';
}

/* ---------- secciones ---------- */
function cfSection(key) {
  var m = CF.m, D = cfData(m), i = 0, c;
  CF_SECS.forEach(function (s, j) { if (s[0] === key) i = j; });
  if (key === 'rating') c = cfHead('Rating', 'Máximo ' + D.max.r + ', ' + cfFmt(D.max.d)) + cfRatingSvg(D);
  else if (key === 'actividad') c = cfHead('Actividad', 'Cada celda es un día del último año',
      '<div class="mb-seg cf-seg" role="group" aria-label="Color de las celdas"><button type="button" data-cf-heat="act" aria-pressed="' + (CF.heat === 'act') + '">Cantidad</button><button type="button" data-cf-heat="rat" aria-pressed="' + (CF.heat === 'rat') + '">Dificultad</button></div>') +
    '<div id="cf-heat">' + cfHeat(D, CF.heat) + '</div><div class="cf-hr"></div><div class="cf-hss">' +
    [[D.solved, 'resueltos en total'], [D.year, 'en el último año'], [D.month, 'en el último mes'], [D.best + ' días', 'racha máxima'], [D.bestY + ' días', 'racha máx. del año'], [D.bestM + ' días', 'racha máx. del mes']]
      .map(function (x) { return '<div class="cf-hs"><b class="rk-dsp">' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>';
  else if (key === 'problemas') c = cfHead('Problemas', 'Por rating y por letra') + cfHist(D) + '<div class="cf-hr"></div><div class="cf-g2"><div>' + cfIndex(D) + '</div>' + cfRecords(D) + '</div>';
  else if (key === 'temas') c = cfHead('Temas', D.tags.length + ' temas con más problemas') + cfTags(D);
  else if (key === 'envios') c = cfHead('Envíos', 'Veredictos de todos los envíos') + cfVerd(D);
  else if (key === 'contests') c = cfHead('Contests', D.rating.length + ' contests · mejor puesto ' + D.bestRank) + cfContests(D);
  else if (key === 'semana') c = cfWeek(D);
  else c = cfHead('Sin resolver', D.uns.length + ' problemas con envíos y sin AC') + cfUnsolved(D);
  var p = CF_SECS[i - 1], n = CF_SECS[i + 1];
  return '<div class="cf-crumb rk-mono">0' + (i + 1) + ' / 0' + CF_SECS.length + '</div><section class="mb-card cf-card" aria-labelledby="cf-t">' + c.replace('<h2 class="rk-dsp">', '<h2 class="rk-dsp" id="cf-t">') + '</section>' +
    '<div class="cf-pn">' + (p ? '<button type="button" class="cf-pnb" data-cf-sec="' + p[0] + '">' + CF_ICO.l + '<span><small>Anterior</small>' + p[1] + '</span></button>' : '<span></span>') +
    (n ? '<button type="button" class="cf-pnb nx" data-cf-sec="' + n[0] + '"><span><small>Siguiente</small>' + n[1] + '</span>' + CF_ICO.r + '</button>' : '<span></span>') + '</div>';
}

function cfView(m) {
  if (CF.m !== m) { CF.m = m; }
  var D = cfData(m);
  var kp = [['Rating actual', m[1], G.rankOf(m[1]).name, rkRc(m[1])], ['Problemas resueltos', D.solved, D.year + ' en el último año', ''], ['Contests', D.rating.length, 'Mejor puesto: ' + D.bestRank, '']];
  return '<div class="cf">' +
    '<div class="mb-metrics cf-kpis">' + kp.map(function (x) { return '<div class="mb-metric"><span>' + x[0] + '</span><b class="rk-dsp"' + (x[3] ? ' style="color:' + x[3] + '"' : '') + '>' + x[1] + '</b><em>' + x[2] + '</em></div>'; }).join('') + '</div>' +
    '<div class="cf-lay"><nav class="cf-nav" aria-label="Secciones del perfil de Codeforces"><div class="mb-card cf-navc">' +
    CF_SECS.map(function (s, i) { return '<button type="button" class="cf-nv" data-cf-sec="' + s[0] + '" aria-current="' + (s[0] === CF.sec ? 'page' : 'false') + '"><span class="rk-mono">0' + (i + 1) + '</span>' + s[1] + '</button>'; }).join('') +
    '</div><div class="mb-card cf-upd"><span>Datos de ejemplo</span><a href="https://codeforces.com/profile/' + encodeURIComponent(m[0]) + '" target="_blank" rel="noopener">Abrir en Codeforces' + CF_ICO.ext + '</a></div></nav>' +
    '<div class="cf-main" id="cf-sec">' + cfSection(CF.sec) + '</div></div></div>';
}

/* ---------- interacción ---------- */
function cfGo(key) {
  var box = document.getElementById('cf-sec'); if (!box || !key) return;
  CF.sec = key;
  document.querySelectorAll('.cf-nv').forEach(function (b) { b.setAttribute('aria-current', b.dataset.cfSec === key ? 'page' : 'false'); });
  // en celular el menú es una fila horizontal: se desliza hasta la sección activa
  var nc = document.querySelector('.cf-navc'), act = nc && nc.querySelector('[aria-current=page]');
  if (act && nc.scrollWidth > nc.clientWidth) nc.scrollTo({ left: act.offsetLeft - 16, behavior: mbReduced() ? 'auto' : 'smooth' });
  var swap = function () {
    box.innerHTML = cfSection(key);
    var nav = document.querySelector('.cf-nav'), r = box.getBoundingClientRect();
    if (r.top < 70 || (nav && nav.getBoundingClientRect().top < 0 && innerWidth < 760)) window.scrollTo({ top: scrollY + r.top - 90, behavior: mbReduced() ? 'auto' : 'smooth' });
  };
  if (mbReduced()) { swap(); return; }
  clearTimeout(box._t);
  box.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
  box._t = setTimeout(function () { box.getAnimations().forEach(function (a) { a.cancel(); }); swap(); }, 160);
}
function cfHeatSet(mode) {
  if (mode === CF.heat) return;
  CF.heat = mode;
  document.querySelectorAll('[data-cf-heat]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cfHeat === mode)); });
  var box = document.getElementById('cf-heat'); if (box) box.innerHTML = cfHeat(cfData(CF.m), mode);
}
document.addEventListener('click', function (e) {
  var s = e.target.closest('[data-cf-sec]'); if (s) { cfGo(s.dataset.cfSec); return; }
  var h = e.target.closest('[data-cf-heat]'); if (h) cfHeatSet(h.dataset.cfHeat);
});
