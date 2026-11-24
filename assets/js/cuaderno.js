/* Cuaderno: fichas personales de problemas. Se guardan solo en este navegador (localStorage),
   no salen en el perfil ni en las estadísticas. */
var CQ = { pos: 0, sheet: false, tid: 0 };
var CQ_THEMES = ['Implementación', 'Matemática', 'Ordenamiento', 'Strings', 'Greedy', 'Sumas prefijas', 'Fuerza bruta', 'Búsqueda binaria', 'Two pointers',
  'Grafos', 'Programación dinámica', 'Teoría de números', 'Bits', 'Segment tree', 'DSU', 'Caminos mínimos', 'Combinatoria', 'Árboles', 'Geometría'];
var CQ_ERR = ['Índices', 'Overflow', 'Caso borde', 'TLE', 'Leí mal el enunciado', 'Inicialización'];
var CQ_RES = ['Solo', 'Pista', 'Editorial', 'No salió'];
var CQ_REP = ['reescrito', 'explicado', 'de cero'], CQ_DAYS = [1, 7, 30];
var CQ_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function cqPad(n) { return (n < 10 ? '0' : '') + n; }
function cqToday() { var d = new Date(); return d.getFullYear() + '-' + cqPad(d.getMonth() + 1) + '-' + cqPad(d.getDate()); }
function cqAdd(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function cqLong(iso) { return +iso.slice(8) + ' de ' + CQ_MES[+iso.slice(5, 7) - 1]; }
function cqShort(iso) { return +iso.slice(8) + ' ' + CQ_MES[+iso.slice(5, 7) - 1].slice(0, 3); }
function cqEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function cqUrl(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }
function cqReps(f) { return CQ_DAYS.map(function (n, k) { return { iso: cqAdd(f.iso, n), what: CQ_REP[k], done: !!f.rp[k] }; }); }

/* ---------- datos ---------- */
// fichas de muestra la primera vez, con fechas relativas a hoy para que los repasos tengan sentido
function cqSeed() {
  var t = cqToday(), S = [
    [-25, [1, 1, 0], 'Kefa and Park', 'Codeforces 580C', 'https://codeforces.com/problemset/problem/580/C', '1500', ['Grafos', 'Árboles'], 'Solo', '35 min',
      'Árbol con gatos en algunos nodos. Contar las hojas a las que llego sin pasar por más de m gatos seguidos.',
      'Es un árbol y pregunta por caminos desde la raíz: DFS llevando un contador.',
      'DFS desde la raíz con la racha de gatos actual.\nSi la racha pasa de m, corto esa rama.\nSi llego a una hoja, sumo uno.',
      'Caso borde: tomé como hoja a la raíz cuando tenía un solo hijo.'],
    [-23, [1, 1, 0], 'Boredom', 'Codeforces 455A', 'https://codeforces.com/problemset/problem/455/A', '1500', ['Programación dinámica'], 'Pista', '50 min',
      'Si tomo un número x gano x puntos, pero se borran todos los x - 1 y x + 1. Máxima ganancia.',
      'Tomar x prohíbe a sus vecinos: es como no robar dos casas seguidas.',
      'cnt[x] = cuántas veces aparece x.\ndp[x] = max(dp[x - 1], dp[x - 2] + x por cnt[x]).\nLa respuesta es dp del valor máximo.',
      'Overflow: x por cnt[x] no entraba en int.'],
    [-21, [1, 1, 0], 'Interesting drink', 'Codeforces 706B', 'https://codeforces.com/problemset/problem/706/B', '1100', ['Búsqueda binaria', 'Ordenamiento'], 'Solo', '15 min',
      'n tiendas con precios. Cada día tengo m monedas: ¿en cuántas tiendas puedo comprar?',
      'Muchas preguntas de "cuántos son menores o iguales": ordenar y buscar.',
      'Ordenar los precios.\nPara cada m, upper_bound dice cuántos precios son menores o iguales.',
      'TLE: al principio recorría todo el arreglo en cada pregunta.'],
    [-19, [1, 1, 0], 'Even Odds', 'Codeforces 318A', 'https://codeforces.com/problemset/problem/318/A', '900', ['Matemática'], 'Solo', '15 min',
      'Escribo los impares del 1 al n y después los pares. ¿Qué número queda en la posición k?',
      'n llega a 10^12: no puedo armar la lista, tiene que ser una fórmula.',
      'Hay (n + 1) / 2 impares.\nSi k cae entre ellos, la respuesta es 2k - 1.\nSi no, es 2 (k - impares).',
      'Overflow: usé int y n no entraba.'],
    [-17, [1, 0, 0], 'Books', 'Codeforces 279B', 'https://codeforces.com/problemset/problem/279/B', '1400', ['Two pointers', 'Sumas prefijas'], 'Solo', '25 min',
      'Libros en fila, cada uno con su tiempo. Empiezo en cualquiera y leo seguido mientras me alcance t. Máximo de libros.',
      'Pide el bloque contiguo más largo con suma menor o igual a t, y los tiempos son positivos.',
      'Avanzo r sumando su tiempo.\nMientras la suma pase de t, saco el de la izquierda.\nGuardo el mayor r - l + 1.',
      'Leí mal el enunciado: creí que podía saltarme libros.'],
    [-15, [1, 1, 0], 'Static Range Sum Queries', 'CSES 1646', 'https://cses.fi/problemset/task/1646', '1100', ['Sumas prefijas'], 'Solo', '10 min',
      'Un arreglo que no cambia y muchas preguntas: ¿cuánto suma de a hasta b?',
      'Muchas consultas de suma sobre un arreglo fijo.',
      'pre[i] es la suma de los primeros i.\nLa respuesta es pre[b] - pre[a - 1].',
      'Índices: guardé desde 0 y las consultas empiezan en 1, así que a = 1 leía fuera.'],
    [-13, [1, 0, 0], 'Nested Ranges Count', 'CSES 2169', 'https://cses.fi/problemset/task/2169', '1800', ['Segment tree', 'Ordenamiento'], 'Solo', '30 min',
      'Para cada rango, contar cuántos rangos contiene y cuántos lo contienen.',
      'n hasta 2 x 10^5 y preguntas de contención: ordenar por un extremo y contar el otro.',
      'Ordenar por r; si empatan, l mayor primero.\nComprimir coordenadas.\nRecorrer y contar con un Fenwick los l mayores o iguales.',
      'Índices: me equivoqué con los índices del Fenwick.'],
    [-11, [1, 1, 0], 'Coin Combinations I', 'CSES 1635', 'https://cses.fi/problemset/task/1635', '1500', ['Programación dinámica'], 'Editorial', '45 min',
      'Contar de cuántas formas ordenadas puedo sumar x con las monedas dadas.',
      'Pide contar formas y el orden importa: DP sobre la suma.',
      'dp[0] = 1.\nPara cada suma s y cada moneda c: dp[s] += dp[s - c].\nTodo módulo 10^9 + 7.',
      'Inicialización: dejé dp[0] en 0 y todo salía 0.'],
    [-10, [1, 1, 0], 'Building Roads', 'CSES 1666', 'https://cses.fi/problemset/task/1666', '1300', ['Grafos', 'DSU'], 'Solo', '20 min',
      'Ciudades y caminos. Mínimo de caminos nuevos para que todo quede conectado, y cuáles son.',
      '"Que todo quede conectado": son componentes conexas.',
      'Encontrar las componentes con DFS.\nUnir un nodo de cada componente con uno de la siguiente.\nLa respuesta es componentes - 1.',
      'Leí mal el enunciado: también había que imprimir los caminos.'],
    [-7, [1, 0, 0], 'Factory Machines', 'CSES 1620', 'https://cses.fi/problemset/task/1620', '1500', ['Búsqueda binaria'], 'Pista', '40 min',
      'n máquinas, cada una tarda k segundos por producto. ¿Cuál es el menor tiempo para hacer t productos?',
      'Pide "el menor tiempo", y si alcanza con T también alcanza con T + 1.',
      'Binaria sobre T.\nEn T cada máquina hace T / k productos.\nSi la suma llega a t, T sirve.',
      'Overflow: la suma se pasaba de long long. Hay que cortar apenas llega a t.'],
    [-4, [1, 0, 0], 'Shortest Routes I', 'CSES 1671', 'https://cses.fi/problemset/task/1671', '1600', ['Caminos mínimos', 'Grafos'], 'Pista', '40 min',
      'Grafo dirigido con pesos. Distancia mínima desde la ciudad 1 hasta todas las demás.',
      'Pesos positivos y una sola fuente: Dijkstra.',
      'Dijkstra con cola de prioridad.\nSi saco un nodo con una distancia vieja, lo ignoro.\nDistancias en long long.',
      'TLE: no ignoraba las entradas viejas de la cola.\nOverflow: guardé las distancias en int.'],
    [-1, [0, 0, 0], 'Apartments', 'CSES 1084', 'https://cses.fi/problemset/task/1084', '1200', ['Greedy', 'Ordenamiento', 'Two pointers'], 'Solo', '20 min',
      'Cada persona acepta un departamento si su tamaño está a k o menos de lo que quiere. Máximo de personas con departamento.',
      'Emparejar dos listas por cercanía: ordenar las dos y recorrerlas juntas.',
      'Ordenar deseos y tamaños.\nSi encaja, emparejo y avanzo los dos.\nSi el departamento es chico, avanzo ese; si no, la persona.',
      'Caso borde: comparé con menor estricto y el margen incluye a k.']
  ];
  return S.map(function (x) {
    return { iso: cqAdd(t, x[0]), rp: x[1], n: x[2], j: x[3], l: x[4], r: x[5], ts: x[6], res: x[7], tm: x[8], en: x[9], se: x[10], idea: x[11], er: x[12] };
  });
}
function cqList() {
  try {
    var raw = localStorage.getItem('cq:fichas');
    if (raw === null) return cqFix(cqSeed());
    var v = JSON.parse(raw); return Array.isArray(v) ? cqFix(v) : [];
  } catch (e) { return CQ.mem || (CQ.mem = cqFix(cqSeed())); }
}
function cqPut(list) { CQ.mem = list; try { localStorage.setItem('cq:fichas', JSON.stringify(list)); } catch (e) {} }
function cqId() { return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
// fichas antiguas: les da id y separa el tipo de error ("Overflow: ...") del detalle
function cqFix(list) {
  var changed = false;
  list.forEach(function (f) {
    if (!f.id) { f.id = cqId(); changed = true; }
    if (!Array.isArray(f.errs)) {
      f.errs = []; var m = /^([^:\n]+):\s*/.exec(f.er || '');
      if (m && CQ_ERR.indexOf(m[1]) >= 0) { f.errs = [m[1]]; f.er = f.er.slice(m[0].length); }
      changed = true;
    }
    if (typeof f.up !== 'number') { f.up = 0; changed = true; }
    if (!Array.isArray(f.rp) || f.rp.length !== 3 || f.rp.some(function (x) { return typeof x !== 'boolean'; })) { f.rp = [0, 1, 2].map(function (k) { return !!(f.rp && f.rp[k]); }); changed = true; }
  });
  if (changed) cqPut(list);
  return list;
}
function cqErrText(f) { var t = (f.errs || []).join(', '); return t && f.er ? t + ': ' + f.er : t || f.er || ''; }
function cqIdx(id) { var L = cqList(); for (var i = 0; i < L.length; i++) if (L[i].id === id) return i; return -1; }

// repasos agrupados: hoy, atrasados, próximos 7 días y más adelante
function cqAgenda(list) {
  var t = cqToday(), wk = cqAdd(t, 7), ago = cqAdd(t, -6), A = { today: [], late: [], soon: [], later: [], doneWeek: 0 };
  list.forEach(function (f, i) {
    cqReps(f).forEach(function (r) {
      var it = { i: i, n: f.n, what: r.what, iso: r.iso };
      if (r.done) { if (r.iso >= ago && r.iso <= t) A.doneWeek++; return; }
      if (r.iso === t) A.today.push(it); else if (r.iso < t) A.late.push(it); else if (r.iso <= wk) A.soon.push(it); else A.later.push(it);
    });
  });
  ['late', 'soon', 'later'].forEach(function (k) { A[k].sort(function (a, b) { return a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0; }); });
  return A;
}
function cqPending() { var A = cqAgenda(cqList()); return A.today.length + A.late.length; }

/* ---------- caras ---------- */
function cqPg(i) { return 7 + 2 * i; }
function cqLeaf(side, label, inner, pn) { return '<section class="cq-leaf ' + side + '" aria-label="' + label + '">' + inner + '<span class="cq-pn">' + pn + '</span></section>'; }
function cqTocBtn(i, text, pg, indent) {
  return '<button type="button" class="cq-toc' + (indent ? ' in' : '') + '" data-cq-go="' + (i + 3) + '"><span>' + cqEsc(text) + '</span><span class="d" aria-hidden="true"></span><span>' + pg + '</span></button>';
}
function cqGuide() {
  return cqLeaf('l', 'Cómo se usa',
    '<p class="cq-ttl">Este cuaderno</p>' +
    '<p class="cq-h">Cuándo escribir</p><p class="cq-t">Solo si el problema no te salió, salió con ayuda o te enseñó algo nuevo. Las fáciles no necesitan ficha.</p>' +
    '<p class="cq-h">Dos caras por problema</p><p class="cq-t">Primera cara: los datos, el enunciado con tus palabras y la señal.\nSegunda cara: la idea y los errores que cometiste.</p>' +
    '<p class="cq-h">Repasos</p><p class="cq-t">Mañana lo reescribes de memoria.\nEn una semana lo explicas en dos líneas.\nEn un mes lo resuelves de cero.</p>' +
    '<p class="cq-h">Índice y repasos</p><p class="cq-t" style="margin:0">Cada ficha aparece sola en sus temas.\nEl botón Repasos te dice qué toca hoy.</p>', 1) +
  cqLeaf('r', 'Ejemplo',
    '<p class="cq-ttl">Watermelon</p>' +
    '<dl class="cq-kv" style="margin-bottom:0"><dt>juez</dt><dd>Codeforces 4A</dd><dt>rating</dt><dd>800</dd><dt>tema</dt><dd>Matemática</dd><dt>resultado</dt><dd>Solo, 10 min</dd></dl>' +
    '<p class="cq-note">en tus palabras, no copies el enunciado</p><p class="cq-h">Enunciado</p><p class="cq-t" style="margin:0">¿Se puede partir w kilos en dos partes pares?</p>' +
    '<p class="cq-note">qué te hizo pensar en la solución</p><p class="cq-h">Señal</p><p class="cq-t" style="margin:0">Dice "par", así que es paridad.</p>' +
    '<p class="cq-h">Idea</p><p class="cq-t" style="margin:0">Sí, si w es par y mayor que 2.</p>' +
    '<p class="cq-h">Error</p><p class="cq-t" style="margin:0">Olvidé w = 2: da 1 y 1.</p>', 2);
}
function cqIndex(list) {
  var ch = [];
  CQ_THEMES.concat(['Sin tema']).forEach(function (t) {
    var items = [];
    list.forEach(function (f, i) { if ((f.ts.length ? f.ts : ['Sin tema']).indexOf(t) >= 0) items.push(i); });
    if (items.length) ch.push({ name: t, items: items });
  });
  // la izquierda tiene 19 renglones bajo el título; lo que no entra sigue en la derecha
  var L = [], R = [], used = 0;
  ch.forEach(function (c, k) { c.n = k + 1; if (!R.length && used + c.items.length + 1 <= 19) { L.push(c); used += c.items.length + 2; } else R.push(c); });
  var block = function (c) {
    return '<div style="margin-bottom:32px"><p class="cq-toc-c">' + c.n + '. ' + cqEsc(c.name) + '</p>' +
      c.items.map(function (i) { return cqTocBtn(i, list[i].n, cqPg(i), true); }).join('') + '</div>';
  };
  var empty = list.length ? '' : '<p class="cq-t mut">Todavía no hay fichas. Usa "Nueva ficha" para escribir la primera.</p>';
  return cqLeaf('l', 'Índice, primera parte', '<p class="cq-ttl">Índice</p>' + empty + L.map(block).join(''), 3) +
    cqLeaf('r', 'Índice, segunda parte', R.map(block).join('') + (list.length ? '<p class="cq-t mut" style="margin:0">' + list.length + ' fichas en ' + ch.length + ' temas.</p>' : ''), 4);
}
function cqRepasos(list) {
  var A = cqAgenda(list), row = function (it, withDate) {
    return cqTocBtn(it.i, (withDate ? cqShort(it.iso) + ', ' : '') + it.n + ', ' + it.what, cqPg(it.i), false);
  };
  var none = function (t) { return '<p class="cq-t mut" style="margin:0">' + t + '</p>'; };
  var later = A.later.slice(0, Math.max(0, 15 - A.soon.length));
  return cqLeaf('l', 'Repasos pendientes',
    '<p class="cq-ttl">Repasos</p>' +
    '<p class="cq-h">Hoy, ' + cqLong(cqToday()) + '</p>' + (A.today.length ? A.today.map(function (it) { return row(it, false); }).join('') : none('Nada para hoy.')) +
    '<p class="cq-h" style="margin-top:32px">Atrasados</p>' + (A.late.length ? A.late.map(function (it) { return row(it, true); }).join('') : none('Ninguno. Vas al día.')) +
    '<p class="cq-h" style="margin-top:32px">Hechos esta semana</p><p class="cq-t" style="margin:0">' + A.doneWeek + ' repasos marcados en los últimos 7 días.</p>', 5) +
  cqLeaf('r', 'Próximos repasos',
    '<p class="cq-h" style="margin-top:64px">Próximos 7 días</p>' + (A.soon.length ? A.soon.map(function (it) { return row(it, true); }).join('') : none('Nada en los próximos días.')) +
    '<p class="cq-h" style="margin-top:32px">Más adelante</p>' + (later.length ? later.map(function (it) { return row(it, true); }).join('') : none('Nada programado.')), 6);
}
function cqFicha(f, i) {
  var u = cqUrl(f.l), reps = cqReps(f).map(function (r, k) {
    return '<button type="button" class="cq-rp" data-cq-rep="' + i + ':' + k + '" aria-pressed="' + r.done + '" aria-label="Repaso del ' + cqLong(r.iso) + ', ' + r.what + '"><span class="cq-box" aria-hidden="true"></span><span class="cq-rl">' + cqShort(r.iso) + '</span></button>';
  }).join('');
  var dd = function (v) { return v ? cqEsc(v) : '<span style="color:#B8B0D0">sin dato</span>'; };
  return cqLeaf('l', 'Primera cara',
    '<p class="cq-ttl">' + cqEsc(f.n) + '</p>' +
    '<dl class="cq-kv"><dt>juez</dt><dd>' + dd(f.j) + '</dd>' +
    '<dt>link</dt><dd>' + (u ? '<a href="' + cqEsc(u) + '" target="_blank" rel="noopener">' + cqEsc(u.replace(/^https?:\/\/(www\.)?/, '')) + '</a>' : dd('')) + '</dd>' +
    '<dt>rating</dt><dd>' + dd(f.r) + '</dd><dt>temas</dt><dd>' + dd(f.ts.join(', ')) + '</dd>' +
    '<dt>fecha</dt><dd>' + cqLong(f.iso) + '</dd><dt>resultado</dt><dd>' + dd(f.res) + '</dd><dt>tiempo</dt><dd>' + dd(f.tm) + '</dd>' +
    '<dt>repasos</dt><dd><div class="cq-reps">' + reps + '</div></dd></dl>' +
    '<p class="cq-h">Enunciado con mis palabras</p><p class="cq-t">' + cqEsc(f.en) + '</p>' +
    '<p class="cq-h">Señal</p><p class="cq-t">' + cqEsc(f.se) + '</p>', cqPg(i)) +
  cqLeaf('r', 'Segunda cara',
    '<p class="cq-h">Idea</p><p class="cq-t">' + cqEsc(f.idea) + '</p>' +
    '<p class="cq-h">Errores que cometí</p><p class="cq-t">' + cqEsc(cqErrText(f)) + '</p>', cqPg(i) + 1);
}
function cqSpread(pos, role) {
  var list = cqList(), inner = pos === 0 ? cqGuide() : pos === 1 ? cqIndex(list) : pos === 2 ? cqRepasos(list) : cqFicha(list[pos - 3], pos - 3);
  return '<div class="cq-spread ' + role + '">' + inner + '</div>';
}
var CQ_IC = {
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/></svg>',
  del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v11M7 9l5 5 5-5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
function cqWhere(p) { return 'Páginas ' + (2 * p + 1) + ' y ' + (2 * p + 2) + (p === 0 ? ', cómo se usa' : p === 1 ? ', índice' : p === 2 ? ', repasos' : ''); }
function cqBar() {
  var last = cqList().length + 2, p = CQ.pos;
  return '<button type="button" class="cq-btn" data-cq-go="' + (p - 1) + '"' + (p === 0 ? ' disabled' : '') + '>' + CQ_IC.prev + 'Página anterior</button>' +
    '<span class="cq-where" aria-live="polite">' + cqWhere(p) + '</span>' +
    '<div class="cq-acts">' + (p > 2 ?
      '<button type="button" class="cq-btn" data-cq-edit="' + (p - 3) + '">' + CQ_IC.edit + 'Editar</button>' +
      '<button type="button" class="cq-btn" data-cq-del="' + (p - 3) + '">' + CQ_IC.del + 'Eliminar</button>' +
      '<button type="button" class="cq-btn" data-cq-md="' + (p - 3) + '">' + CQ_IC.down + 'Descargar .md</button>' : '') +
    '<button type="button" class="cq-btn" data-cq-go="' + (p + 1) + '"' + (p >= last ? ' disabled' : '') + '>Página siguiente' + CQ_IC.next + '</button></div>';
}
// navegación compacta fija abajo (solo en pantallas angostas, ver CSS)
function cqMnav() {
  var last = cqList().length + 2, p = CQ.pos;
  return '<button type="button" class="cq-mb" data-cq-go="' + (p - 1) + '"' + (p === 0 ? ' disabled' : '') + ' aria-label="Página anterior">' + CQ_IC.prev + '</button>' +
    '<button type="button" class="cq-mb wide" data-cq-go="1"' + (p === 1 ? ' aria-current="page"' : '') + '>Índice</button>' +
    '<span class="cq-mp">' + (2 * p + 1) + '-' + (2 * p + 2) + '</span>' +
    '<button type="button" class="cq-mb" data-cq-go="' + (p + 1) + '"' + (p >= last ? ' disabled' : '') + ' aria-label="Página siguiente">' + CQ_IC.next + '</button>';
}
// flechas en los bordes del libro: aparecen solo cuando el mouse se acerca al centro del borde
function cqEdges() {
  var last = cqList().length + 2, p = CQ.pos;
  return '<button type="button" class="cq-edge prev" id="cq-ep" data-cq-go="' + (p - 1) + '"' + (p === 0 ? ' disabled' : '') + ' aria-label="Página anterior">' + CQ_IC.prev + '</button>' +
    '<button type="button" class="cq-edge next" id="cq-en" data-cq-go="' + (p + 1) + '"' + (p >= last ? ' disabled' : '') + ' aria-label="Página siguiente">' + CQ_IC.next + '</button>';
}
function cqNavUpdate() {
  var b = document.getElementById('cq-bar'); if (b) b.innerHTML = cqBar();
  var e = document.getElementById('cq-ep');
  if (e) { var t = document.createElement('div'); t.innerHTML = cqEdges(); e.nextElementSibling.replaceWith(t.lastChild); e.replaceWith(t.firstChild); }
  var m = document.getElementById('cq-mnav'); if (m) m.innerHTML = cqMnav();
}

/* ---------- borrador: lo que se escribe en el formulario se guarda solo ---------- */
function cqDraft() { try { var d = JSON.parse(localStorage.getItem('cq:borrador') || 'null'); return d && d.data ? d : null; } catch (e) { return null; } }
function cqDraftPut(d) { try { if (d) localStorage.setItem('cq:borrador', JSON.stringify(d)); else localStorage.removeItem('cq:borrador'); } catch (e) {} }
function cqWhen(ms) {
  var d = new Date(ms), hm = cqPad(d.getHours()) + ':' + cqPad(d.getMinutes()), iso = d.getFullYear() + '-' + cqPad(d.getMonth() + 1) + '-' + cqPad(d.getDate());
  return (iso === cqToday() ? 'hoy' : 'el ' + cqLong(iso)) + ' a las ' + hm;
}
function cqBlank() { return { n: '', j: '', l: '', r: '', ts: [], res: 'Solo', tm: '', en: '', se: '', idea: '', errs: [], er: '' }; }
// para comparar sin importar el orden en que se marcaron temas o errores
function cqNormD(d) { var x = Object.assign({}, d); x.ts = (d.ts || []).slice().sort(); x.errs = (d.errs || []).slice().sort(); return JSON.stringify(x); }
function cqPick(f) { var b = cqBlank(); Object.keys(b).forEach(function (k) { if (f[k] != null) b[k] = Array.isArray(b[k]) ? f[k].slice() : f[k]; }); return b; }
function cqFormData(fm) {
  var v = function (k) { return fm.elements[k] ? fm.elements[k].value : ''; };
  var all = function (k) { return Array.prototype.slice.call(fm.querySelectorAll('input[name="' + k + '"]:checked')).map(function (x) { return x.value; }); };
  return { n: v('n'), j: v('j'), l: v('l'), r: v('r'), ts: all('ts'), res: all('res')[0] || 'Solo', tm: v('tm'), en: v('en'), se: v('se'), idea: v('idea'), errs: all('errs'), er: v('er') };
}
function cqDraftSync() {
  var fm = document.getElementById('cq-form'); if (!fm || !CQ.sheet) return;
  var data = cqFormData(fm), same = cqNormD(data) === CQ.sheet.base;
  CQ.sheet.data = data; CQ.sheet.draftAt = same ? 0 : Date.now();
  cqDraftPut(same ? null : { mode: CQ.sheet.mode, id: CQ.sheet.id || null, at: Date.now(), data: data });
  var st = document.getElementById('cq-dstat');
  if (st) st.textContent = same ? '' : 'Borrador guardado en este navegador ' + cqWhen(Date.now()) + '.';
}
function cqDraftBanner() {
  var d = cqDraft(); if (!d || CQ.sheet) return '';
  var i = d.mode === 'edit' ? cqIdx(d.id) : -1, name = (d.data.n || '').trim() || 'ficha sin nombre';
  var what = i >= 0 ? 'Cambios sin guardar en "' + cqEsc(cqList()[i].n) + '"' : 'Ficha nueva sin guardar: "' + cqEsc(name) + '"';
  return '<div class="cq-dban" role="status"><span class="cq-dtag">Borrador</span><p>' + what + ', ' + cqWhen(d.at) + '.</p>' +
    '<div class="cq-acts"><button type="button" class="cq-btn dark" data-cq-resume>Seguir escribiendo</button><button type="button" class="cq-btn" data-cq-dropdraft>Descartar</button></div></div>';
}

/* ---------- formulario: ficha nueva o edición ---------- */
// mode 'new' | 'edit'; si hay un borrador para el mismo destino, lo recupera
function cqOpenSheet(mode, id) {
  var d = cqDraft(), list = cqList(), i = mode === 'edit' ? cqIdx(id) : -1;
  if (mode === 'edit' && i < 0) return;
  var mine = d && d.mode === mode && (mode === 'new' || d.id === id);
  if (d && !mine) {
    var other = d.mode === 'edit' && cqIdx(d.id) >= 0 ? 'los cambios sin guardar de "' + cqList()[cqIdx(d.id)].n + '"' : 'una ficha nueva sin guardar';
    if (!window.confirm('Tienes un borrador con ' + other + '. Si sigues, ese borrador se descarta. ¿Continuar?')) return;
    cqDraftPut(null); d = null;
  }
  var base = mode === 'edit' ? cqPick(list[i]) : cqBlank();
  CQ.sheet = { mode: mode, id: mode === 'edit' ? id : null, base: cqNormD(base), data: mine ? d.data : base, draftAt: mine ? d.at : 0 };
  cqRerender();
  window.scrollTo({ top: 0, behavior: 'auto' });
  var n = document.getElementById('cq-n'); if (n) n.focus({ preventScroll: true });
}
function cqSheet() {
  var S = CQ.sheet, D = S.data, edit = S.mode === 'edit', f = edit ? cqList()[cqIdx(S.id)] : null, t = cqToday();
  var val = function (k) { return ' value="' + cqEsc(D[k]) + '"'; };
  var ck = function (name, opts, type, sel) {
    return opts.map(function (o) { var on = Array.isArray(sel) ? sel.indexOf(o) >= 0 : sel === o; return '<label class="cq-ck"><input type="' + type + '" name="' + name + '" value="' + cqEsc(o) + '"' + (on ? ' checked' : '') + '>' + cqEsc(o) + '</label>'; }).join('');
  };
  var themes = CQ_THEMES.concat(D.ts.filter(function (x) { return CQ_THEMES.indexOf(x) < 0; }));
  var reps = edit ? cqReps(f).map(function (r) { return cqLong(r.iso) + ' (' + r.what + (r.done ? ', hecho' : ', pendiente') + ')'; }).join(', ') + '. Se conservan al editar.'
    : cqLong(cqAdd(t, 1)) + ', ' + cqLong(cqAdd(t, 7)) + ' y ' + cqLong(cqAdd(t, 30)) + '. Se programan solos: mañana, en una semana y en un mes.';
  return '<form class="cq-sheet" id="cq-form" novalidate aria-labelledby="cq-sheet-t">' +
    '<div><h2 class="dsp" id="cq-sheet-t">' + (edit ? 'Editar ficha' : 'Nueva ficha') + '</h2><p style="margin:6px 0 0;color:#45405F">' +
      (edit ? 'Corrige o completa lo que aprendiste. La fecha y los repasos no cambian.' : 'Llena lo que recuerdes. Al guardar se agrega como dos caras nuevas del cuaderno y aparece en el índice, dentro de sus temas.') + '</p></div>' +
    (S.draftAt ? '<div class="cq-dban in"><span class="cq-dtag">Borrador</span><p>Recuperamos lo que escribiste ' + cqWhen(S.draftAt) + '. Todavía no está guardado en el cuaderno.</p><button type="button" class="cq-btn" data-cq-dropdraft>Descartar borrador</button></div>' : '') +
    '<div class="cq-part">Primera cara</div>' +
    '<div class="cq-fl"><label for="cq-n">Nombre del problema</label><input id="cq-n" name="n" class="cq-in" required autocomplete="off"' + val('n') + '></div>' +
    '<div class="cq-g2">' +
      '<div class="cq-fl"><label for="cq-j">Juez</label><input id="cq-j" name="j" class="cq-in" placeholder="Codeforces 1520B" autocomplete="off"' + val('j') + '></div>' +
      '<div class="cq-fl"><label for="cq-l">Link</label><input id="cq-l" name="l" type="url" class="cq-in" placeholder="https://codeforces.com/problemset/problem/1520/B" autocomplete="off"' + val('l') + '></div>' +
      '<div class="cq-fl"><label for="cq-r">Rating</label><input id="cq-r" name="r" class="cq-in" inputmode="numeric" placeholder="1200" autocomplete="off"' + val('r') + '></div>' +
      '<div class="cq-fl"><label for="cq-f">Fecha</label><input id="cq-f" class="cq-in" value="' + cqLong(edit ? f.iso : t) + '" readonly><small>' + (edit ? 'Es la fecha en que creaste la ficha.' : 'Se pone sola.') + '</small></div>' +
    '</div>' +
    '<fieldset class="cq-fl"><legend>Temas</legend><small>Marca todos los que usa el problema.</small><div class="cq-cks">' + ck('ts', themes, 'checkbox', D.ts) + '</div></fieldset>' +
    '<div class="cq-g2">' +
      '<fieldset class="cq-fl"><legend>Resultado</legend><div class="cq-seg">' + CQ_RES.map(function (o) { return '<label><input type="radio" name="res" value="' + o + '"' + (D.res === o ? ' checked' : '') + '>' + o + '</label>'; }).join('') + '</div></fieldset>' +
      '<div class="cq-fl"><label for="cq-tm">Tiempo</label><input id="cq-tm" name="tm" class="cq-in" placeholder="35 min" autocomplete="off"' + val('tm') + '></div>' +
    '</div>' +
    '<div class="cq-fl"><span style="font-weight:700;font-size:15px">Repasos</span><p class="mono" style="margin:0;font-size:15px;color:#45405F">' + reps + '</p></div>' +
    '<div class="cq-fl"><label for="cq-en">Enunciado con mis palabras</label><small>Una o dos líneas. Si no puedes resumirlo, vuelve a leerlo.</small><textarea id="cq-en" name="en" class="cq-in">' + cqEsc(D.en) + '</textarea></div>' +
    '<div class="cq-fl"><label for="cq-se">Señal</label><small>¿Qué parte del enunciado te hizo pensar en la técnica? Un límite, una palabra, la forma de la pregunta.</small><textarea id="cq-se" name="se" class="cq-in">' + cqEsc(D.se) + '</textarea></div>' +
    '<div class="cq-part">Segunda cara</div>' +
    '<div class="cq-fl"><label for="cq-idea">Idea</label><small>Los pasos en orden, sin código.</small><textarea id="cq-idea" name="idea" class="cq-in" style="min-height:130px">' + cqEsc(D.idea) + '</textarea></div>' +
    '<fieldset class="cq-fl"><legend>Errores que cometí</legend><small>Marca el tipo y cuéntalo en una línea.</small><div class="cq-cks">' + ck('errs', CQ_ERR, 'checkbox', D.errs) + '</div>' +
      '<textarea name="er" class="cq-in" aria-label="Detalle del error" style="min-height:60px">' + cqEsc(D.er) + '</textarea></fieldset>' +
    '<p class="cq-err" id="cq-msg" role="alert"></p>' +
    '<div class="cq-acts"><button type="submit" class="cq-btn dark">' + (edit ? 'Guardar cambios' : 'Guardar en el cuaderno') + '</button><button type="button" class="cq-btn" data-cq-close>Cancelar</button></div>' +
    '<p class="cq-dstat" id="cq-dstat" aria-live="polite">' + (S.draftAt ? 'Borrador guardado en este navegador ' + cqWhen(S.draftAt) + '.' : '') + '</p>' +
  '</form>';
}

/* ---------- vista ---------- */
function cqMain() {
  if (CQ.sheet) return cqSheet();
  return cqDraftBanner() + '<div class="cq-book" id="cq-book"><span class="cq-ribbon" aria-hidden="true"></span>' + cqSpread(CQ.pos, 'cur') + cqEdges() + '</div>' +
    '<div class="cq-bar" id="cq-bar">' + cqBar() + '</div>' +
    '<nav class="cq-mnav" id="cq-mnav" aria-label="Páginas del cuaderno">' + cqMnav() + '</nav>';
}
function viewCuaderno() {
  var list = cqList();
  if (CQ.sheet && CQ.sheet.mode === 'edit' && cqIdx(CQ.sheet.id) < 0) CQ.sheet = false;
  CQ.pos = Math.min(CQ.pos, list.length + 2);
  return '<div class="cq-page"><div class="cq-wrap"><header class="cq-head"><div>' +
    '<a class="cq-back" href="#/training"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>Training</a>' +
    '<div class="cq-tline"><h1 class="dsp">Cuaderno</h1><button type="button" class="cq-q" data-cq-help aria-label="Para qué sirve el cuaderno" aria-haspopup="dialog">?</button></div></div><div class="cq-acts">' +
    '<button type="button" class="cq-btn" data-cq-go="0">Cómo se usa</button>' +
    '<button type="button" class="cq-btn" data-cq-go="1">Índice</button>' +
    '<button type="button" class="cq-btn" data-cq-go="2" id="cq-rpb">Repasos (' + cqPending() + ')</button>' +
    '<button type="button" class="cq-btn" data-cq-backup aria-haspopup="dialog">' + CQ_IC.save + 'Copia</button>' +
    '<button type="button" class="cq-btn dark" data-cq-new><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Nueva ficha</button>' +
    '</div></header><div id="cq-main">' + cqMain() + '</div></div></div>';
}

/* ---------- ventanas superpuestas (ayuda, copia de seguridad) ---------- */
function cqModal(inner, opts) {
  opts = opts || {};
  if (!document.querySelector('.cq-page')) return null;
  var box = document.getElementById('cq-help');
  if (!box) { box = document.createElement('div'); box.id = 'cq-help'; document.body.appendChild(box); }
  if (!box.firstChild) CQ.helpFrom = document.activeElement;
  box.innerHTML = '<div class="cq-ov" data-cq-hclose></div>' +
    '<section class="cq-help' + (opts.auto ? ' auto' : '') + '" role="dialog" aria-modal="true" aria-labelledby="cq-help-t" tabindex="-1">' +
    '<button type="button" class="cq-hx" data-cq-hclose aria-label="Cerrar">' + CQ_IC.x + '</button>' + inner +
    (opts.auto ? '<span class="cq-hbar" aria-hidden="true"></span>' : '') + '</section>';
  var card = box.querySelector('.cq-help'), bar = box.querySelector('.cq-hbar');
  if (bar) bar.addEventListener('animationend', cqHelpClose);
  CQ.helpInit = true;
  (opts.auto ? card : (card.querySelector(opts.focus || '.cq-btn.dark') || card)).focus({ preventScroll: true });
  CQ.helpInit = false;
  card.addEventListener('focusin', function (e) { if (!CQ.helpInit && e.target !== card) card.classList.add('hold'); });
  return card;
}
function cqHelpAuto() { try { return localStorage.getItem('cq:ayuda') !== 'no'; } catch (e) { return true; } }
// tarjeta de ayuda: sale sola al entrar (y se cierra sola) y con el botón ?
function cqHelp(auto) {
  var ico = function (d) { return '<span class="cq-hi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg></span>'; };
  cqModal('<h2 class="dsp" id="cq-help-t">Para qué sirve el cuaderno</h2>' +
    '<p class="cq-hl">Es tu registro personal de los problemas que te costaron o que te enseñaron algo nuevo, para no olvidar lo que aprendiste ni volver a tropezar con lo mismo.</p>' +
    '<ul class="cq-hlist">' +
      '<li>' + ico('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>') + '<div><b>Una ficha por problema</b><span>Datos, enunciado con tus palabras y la señal en una cara; la idea y tus errores en la otra. Puedes editarla cuando aprendas algo más.</span></div></li>' +
      '<li>' + ico('<path d="M4 6h16M4 12h10M4 18h7"/>') + '<div><b>Se ordena solo</b><span>Cada ficha aparece en el índice, dentro de los temas que marcaste.</span></div></li>' +
      '<li>' + ico('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>') + '<div><b>Repasos programados</b><span>Mañana, en una semana y en un mes. El botón Repasos te dice qué toca hoy.</span></div></li>' +
      '<li>' + ico('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>') + '<div><b>Solo tú lo ves</b><span>Se guarda en este navegador. No sale en tu perfil ni en las estadísticas. Con "Copia" lo pasas a otro navegador.</span></div></li>' +
    '</ul>' +
    '<div class="cq-hfoot"><label class="cq-ck"><input type="checkbox" id="cq-hno"' + (cqHelpAuto() ? '' : ' checked') + '>No mostrar al entrar</label>' +
    '<button type="button" class="cq-btn dark" data-cq-hclose>Entendido</button></div>', { auto: auto });
}
function cqHelpClose() {
  var box = document.getElementById('cq-help'); if (!box || !box.firstChild) return;
  var card = box.querySelector('.cq-help');
  card.classList.add('out'); box.querySelector('.cq-ov').classList.add('out');
  setTimeout(function () { box.innerHTML = ''; }, 220);
  if (CQ.helpFrom && CQ.helpFrom.focus && document.contains(CQ.helpFrom)) CQ.helpFrom.focus({ preventScroll: true });
}
function cqEnter() { if (cqHelpAuto()) setTimeout(function () { var b = document.getElementById('cq-help'); if (!b || !b.firstChild) cqHelp(true); }, 350); }

/* ---------- copia de seguridad: exportar e importar el cuaderno completo ---------- */
function cqBackup() {
  var n = cqList().length;
  cqModal('<h2 class="dsp" id="cq-help-t">Copia de seguridad</h2>' +
    '<p class="cq-hl">Tu cuaderno vive solo en este navegador. Descarga una copia para guardarla o pasarla a otro navegador; incluye fichas, temas, fechas y repasos.</p>' +
    '<div class="cq-bk"><div><b>Exportar</b><span>' + n + (n === 1 ? ' ficha' : ' fichas') + ' en un archivo .json.</span></div><button type="button" class="cq-btn dark" data-cq-export>' + CQ_IC.down + 'Descargar copia</button></div>' +
    '<div class="cq-bk"><div><b>Importar</b><span>Elige un archivo de copia. Antes de cambiar nada te mostramos qué contiene.</span></div>' +
      '<label class="cq-btn cq-file">Elegir archivo<input type="file" id="cq-imp" accept="application/json,.json"></label></div>' +
    '<p class="cq-err" id="cq-imsg" role="alert"></p>', { focus: '[data-cq-export]' });
}
function cqExport() {
  var data = { app: 'gpc-cuaderno', v: 1, exportado: new Date().toISOString(), fichas: cqList() };
  var a = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.href = url; a.download = 'cuaderno-gpc-' + cqToday() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  cqToast('Descargaste la copia de tu cuaderno.');
}
// valida y limpia cada ficha del archivo; devuelve { fichas, malas } o { error }
function cqParse(text) {
  var o; try { o = JSON.parse(text); } catch (e) { return { error: 'El archivo no es una copia válida: no se pudo leer como JSON.' }; }
  if (!o || o.app !== 'gpc-cuaderno' || !Array.isArray(o.fichas)) return { error: 'El archivo no es una copia del cuaderno del GPC.' };
  var out = [], bad = 0, seen = {}, str = function (x, max) { return typeof x === 'string' ? x.slice(0, max || 4000) : x == null ? '' : String(x).slice(0, max || 4000); };
  o.fichas.forEach(function (f) {
    if (!f || typeof f !== 'object' || typeof f.n !== 'string' || !f.n.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(f.iso || '') || isNaN(new Date(f.iso + 'T12:00:00Z'))) { bad++; return; }
    var g = {
      id: typeof f.id === 'string' && f.id ? f.id.slice(0, 40) : cqId(), iso: f.iso, up: typeof f.up === 'number' ? f.up : 0,
      rp: [0, 1, 2].map(function (k) { return !!(Array.isArray(f.rp) && f.rp[k]); }),
      n: str(f.n, 200).trim(), j: str(f.j, 200), l: str(f.l, 500), r: str(f.r, 20), tm: str(f.tm, 50),
      ts: Array.isArray(f.ts) ? f.ts.filter(function (x) { return typeof x === 'string' && x; }).map(function (x) { return x.slice(0, 60); }) : [],
      res: CQ_RES.indexOf(f.res) >= 0 ? f.res : 'Solo',
      en: str(f.en), se: str(f.se), idea: str(f.idea), er: str(f.er),
      errs: Array.isArray(f.errs) ? f.errs.filter(function (x) { return typeof x === 'string' && x; }).map(function (x) { return x.slice(0, 60); }) : []
    };
    if (seen[g.id]) { bad++; return; }
    seen[g.id] = 1; out.push(g);
  });
  if (!out.length) return { error: 'El archivo no tiene fichas válidas.' };
  return { fichas: out, malas: bad };
}
function cqKey(f) { return f.n.trim().toLowerCase() + '|' + f.iso; }
function cqSame(a, b) { var rp = function (f) { return [0, 1, 2].map(function (k) { return !!(f.rp && f.rp[k]); }).join(); }; return cqNormD(cqPick(a)) === cqNormD(cqPick(b)) && a.iso === b.iso && rp(a) === rp(b); }
// compara el archivo con el cuaderno actual: nuevas, iguales y con cambios (misma ficha por id, o mismo problema y fecha)
function cqPlan(inc) {
  var cur = cqList(), byId = {}, byKey = {}, P = { nuevas: [], iguales: 0, cambios: [], malas: 0 };
  cur.forEach(function (f, i) { byId[f.id] = i; byKey[cqKey(f)] = i; });
  inc.forEach(function (g) {
    var i = g.id in byId ? byId[g.id] : cqKey(g) in byKey ? byKey[cqKey(g)] : -1;
    if (i < 0) P.nuevas.push(g); else if (cqSame(cur[i], g)) P.iguales++; else P.cambios.push({ i: i, g: g });
  });
  return P;
}
function cqImportShow(res) {
  var msg = document.getElementById('cq-imsg');
  if (res.error) { if (msg) msg.textContent = res.error; return; }
  var P = cqPlan(res.fichas), n = cqList().length, total = res.fichas.length;
  CQ.imp = { fichas: res.fichas, plan: P };
  var li = function (k, t) { return '<li><b>' + k + '</b> ' + t + '</li>'; };
  var newer = P.cambios.filter(function (c) { return c.g.up > (cqList()[c.i].up || 0); }).length;
  cqModal('<h2 class="dsp" id="cq-help-t">Importar copia</h2>' +
    '<p class="cq-hl">El archivo tiene ' + total + (total === 1 ? ' ficha' : ' fichas') + '. Tu cuaderno tiene ' + n + '.</p>' +
    '<ul class="cq-plan">' +
      li(P.nuevas.length, P.nuevas.length === 1 ? 'nueva, se agrega.' : 'nuevas, se agregan.') +
      li(P.iguales, P.iguales === 1 ? 'ya está igual en tu cuaderno; se omite para no duplicarla.' : 'ya están igual en tu cuaderno; se omiten para no duplicarlas.') +
      li(P.cambios.length, (P.cambios.length === 1 ? 'existe en los dos con diferencias.' : 'existen en los dos con diferencias.') + ' Al combinar se queda la versión editada más recientemente' + (P.cambios.length ? ' (' + newer + ' del archivo, ' + (P.cambios.length - newer) + ' tuyas)' : '') + '; los repasos marcados en cualquiera de las dos se conservan.') +
      (res.malas ? li(res.malas, 'del archivo están incompletas o repetidas y no se importan.') : '') +
    '</ul>' +
    '<div class="cq-hfoot"><button type="button" class="cq-btn" data-cq-replace>Reemplazar todo</button><button type="button" class="cq-btn dark" data-cq-merge>Combinar</button></div>' +
    '<div id="cq-repl"></div>', { focus: '[data-cq-merge]' });
}
function cqMerge() {
  var I = CQ.imp; if (!I) return;
  var list = cqList();
  I.plan.cambios.forEach(function (c) {
    var a = list[c.i], b = c.g, keep = (b.up || 0) > (a.up || 0) ? Object.assign({}, b, { id: a.id }) : a;
    keep.rp = [0, 1, 2].map(function (k) { return !!(a.rp[k] || b.rp[k]); });
    list[c.i] = keep;
  });
  I.plan.nuevas.forEach(function (g) { list.push(g); });
  cqPut(list); CQ.imp = null; cqHelpClose();
  CQ.sheet = false; cqRerender();
  cqToast('Importaste ' + I.plan.nuevas.length + ' fichas nuevas y actualizaste ' + I.plan.cambios.length + '.');
}
function cqReplace(sure) {
  var I = CQ.imp; if (!I) return;
  if (!sure) {
    document.getElementById('cq-repl').innerHTML = '<div class="cq-dban in warn"><p>Se borrarán tus ' + cqList().length + ' fichas actuales y quedarán solo las ' + I.fichas.length + ' del archivo. Si no tienes otra copia, exporta primero.</p>' +
      '<div class="cq-acts"><button type="button" class="cq-btn dark" data-cq-replace-ok>Sí, reemplazar</button><button type="button" class="cq-btn" data-cq-export>Exportar primero</button></div></div>';
    document.querySelector('[data-cq-replace-ok]').focus();
    return;
  }
  var prev = cqList();
  cqPut(I.fichas.slice()); CQ.imp = null; cqHelpClose();
  CQ.sheet = false; CQ.pos = 1; cqRerender();
  cqToast('Reemplazaste el cuaderno con la copia.', function () { cqPut(prev); cqRerender(); });
}

/* ---------- aviso inferior con deshacer ---------- */
function cqToast(text, undo) {
  var t = document.getElementById('cq-toast');
  if (!t) { t = document.createElement('div'); t.id = 'cq-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
  clearTimeout(CQ.toastT);
  CQ.undoFn = undo || null;
  t.innerHTML = '<div class="cq-toast"><span>' + cqEsc(text) + '</span>' + (undo ? '<button type="button" class="cq-tb" data-cq-undo>Deshacer</button>' : '') + '<button type="button" class="cq-tx" data-cq-tclose aria-label="Cerrar aviso">' + CQ_IC.x + '</button></div>';
  CQ.toastT = setTimeout(cqToastClose, undo ? 10000 : 5000);
}
function cqToastClose() { clearTimeout(CQ.toastT); CQ.undoFn = null; var t = document.getElementById('cq-toast'); if (t) t.innerHTML = ''; }
function cqDelete(i) {
  var list = cqList(), f = list[i]; if (!f) return;
  list.splice(i, 1); cqPut(list);
  CQ.pos = Math.min(CQ.pos, list.length + 2); if (CQ.pos > 2 && !list[CQ.pos - 3]) CQ.pos = 1;
  cqRerender();
  cqToast('Eliminaste "' + f.n + '".', function () {
    var L = cqList(); L.splice(Math.min(i, L.length), 0, f); cqPut(L);
    CQ.pos = Math.min(i, L.length - 1) + 3; CQ.sheet = false; cqRerender();
  });
}

document.addEventListener('mousemove', function (e) {
  var book = document.getElementById('cq-book'); if (!book) return;
  var r = book.getBoundingClientRect(), mid = (e.clientY - r.top) / r.height;
  var inY = mid > .2 && mid < .8;
  book.classList.toggle('near-p', inY && Math.abs(e.clientX - r.left) < 110);
  book.classList.toggle('near-n', inY && Math.abs(e.clientX - r.right) < 110);
});
window.addEventListener('hashchange', function () {
  if (location.hash.indexOf('#/cuaderno') === 0) return;
  var b = document.getElementById('cq-help'); if (b) b.innerHTML = '';
  cqToastClose();
});
document.addEventListener('keydown', function (e) {
  var box = document.getElementById('cq-help');
  if (!box || !box.firstChild) return;
  if (e.key === 'Escape') { cqHelpClose(); return; }
  if (e.key === 'Tab') { // el foco se queda dentro de la ventana
    var f = box.querySelectorAll('button:not([disabled]), input'), a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
document.addEventListener('change', function (e) {
  if (e.target.id === 'cq-hno') { try { localStorage.setItem('cq:ayuda', e.target.checked ? 'no' : 'si'); } catch (x) {} return; }
  if (e.target.id === 'cq-imp') {
    var file = e.target.files && e.target.files[0]; if (!file) return;
    if (file.size > 5e6) { document.getElementById('cq-imsg').textContent = 'El archivo es demasiado grande para ser una copia del cuaderno.'; return; }
    var rd = new FileReader();
    rd.onload = function () { cqImportShow(cqParse(String(rd.result))); };
    rd.onerror = function () { document.getElementById('cq-imsg').textContent = 'No se pudo leer el archivo.'; };
    rd.readAsText(file);
    return;
  }
  if (e.target.closest && e.target.closest('#cq-form')) cqDraftSync();
});
document.addEventListener('input', function (e) {
  if (!e.target.closest || !e.target.closest('#cq-form')) return;
  clearTimeout(CQ.dT); CQ.dT = setTimeout(cqDraftSync, 300);
});
document.addEventListener('click', function (e) {
  if (e.target.closest('[data-cq-help]')) { cqHelp(false); return; }
  if (e.target.closest('[data-cq-hclose]')) { cqHelpClose(); return; }
  if (e.target.closest('[data-cq-undo]')) { var u = CQ.undoFn; cqToastClose(); if (u) u(); return; }
  if (e.target.closest('[data-cq-tclose]')) { cqToastClose(); return; }
  if (e.target.closest('[data-cq-backup]')) { cqBackup(); return; }
  if (e.target.closest('[data-cq-export]')) { cqExport(); return; }
  if (e.target.closest('[data-cq-merge]')) { cqMerge(); return; }
  if (e.target.closest('[data-cq-replace-ok]')) { cqReplace(true); return; }
  if (e.target.closest('[data-cq-replace]')) { cqReplace(false); return; }
});
function cqRerender() { var m = document.getElementById('cq-main'); if (m) m.innerHTML = cqMain(); var b = document.getElementById('cq-rpb'); if (b) b.textContent = 'Repasos (' + cqPending() + ')'; }
function cqStill() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 1100; }
function cqFinish(book) {
  clearTimeout(CQ.tid);
  book.querySelectorAll('.cq-spread.old').forEach(function (o) { o.remove(); });
  book.querySelectorAll('.cq-spread.new').forEach(function (n) { n.className = 'cq-spread cur'; });
}
function cqGo(pos) {
  var last = cqList().length + 2;
  pos = Math.max(0, Math.min(last, pos));
  var book = document.getElementById('cq-book');
  if (CQ.sheet || !book) { CQ.sheet = false; CQ.pos = pos; cqRerender(); return; }
  if (pos === CQ.pos) return;
  cqFinish(book);
  var dir = pos > CQ.pos ? 'f' : 'b', old = book.querySelector('.cq-spread.cur');
  CQ.pos = pos;
  cqNavUpdate();
  var top = book.getBoundingClientRect().top;
  if (top < 0) window.scrollTo({ top: window.scrollY + top - 90, behavior: cqStill() ? 'auto' : 'smooth' });
  if (cqStill() || !old) { if (old) old.remove(); book.insertAdjacentHTML('beforeend', cqSpread(pos, 'cur')); return; }
  old.className = 'cq-spread old ' + dir;
  book.insertAdjacentHTML('beforeend', cqSpread(pos, 'new ' + dir));
  CQ.tid = setTimeout(function () { cqFinish(book); }, 980);
}
function cqMd(f) {
  var reps = cqReps(f);
  return '---\nproblema: ' + f.n + '\njuez: ' + (f.j || '') + '\nlink: ' + (f.l || '') + '\nrating: ' + (f.r || '') + '\ntemas: [' + f.ts.join(', ') + ']\nfecha: ' + f.iso +
    '\nresultado: ' + (f.res || '') + '\ntiempo: ' + (f.tm || '') + '\n' + reps.map(function (r, k) { return 'repaso_' + CQ_DAYS[k] + ': ' + r.iso + '\nrepaso_' + CQ_DAYS[k] + '_hecho: ' + r.done; }).join('\n') +
    '\n---\n\n## Enunciado con mis palabras\n' + (f.en || '') + '\n\n## Señal\n' + (f.se || '') + '\n\n## Idea\n' + (f.idea || '') + '\n\n## Errores que cometí\n' + cqErrText(f) + '\n';
}
function cqDownload(i) {
  var f = cqList()[i]; if (!f) return;
  var a = document.createElement('a'), url = URL.createObjectURL(new Blob([cqMd(f)], { type: 'text/markdown;charset=utf-8' }));
  a.href = url; a.download = (f.n || 'ficha').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.md';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

document.addEventListener('click', function (e) {
  if (!document.querySelector('.cq-page')) return;
  var g = e.target.closest('[data-cq-go]'); if (g) { if (!g.disabled) cqGo(+g.dataset.cqGo); return; }
  var rp = e.target.closest('[data-cq-rep]');
  if (rp) {
    var ik = rp.dataset.cqRep.split(':'), list = cqList(), f = list[+ik[0]];
    if (!f) return;
    f.rp = [0, 1, 2].map(function (k) { return k === +ik[1] ? !f.rp[k] : !!f.rp[k]; });
    cqPut(list);
    rp.setAttribute('aria-pressed', String(f.rp[+ik[1]]));
    var b = document.getElementById('cq-rpb'); if (b) b.textContent = 'Repasos (' + cqPending() + ')';
    return;
  }
  var md = e.target.closest('[data-cq-md]'); if (md) { cqDownload(+md.dataset.cqMd); return; }
  var ed = e.target.closest('[data-cq-edit]'); if (ed) { var fe = cqList()[+ed.dataset.cqEdit]; if (fe) cqOpenSheet('edit', fe.id); return; }
  var dl = e.target.closest('[data-cq-del]'); if (dl) { cqDelete(+dl.dataset.cqDel); return; }
  if (e.target.closest('[data-cq-new]')) { cqOpenSheet('new'); return; }
  if (e.target.closest('[data-cq-resume]')) { var d = cqDraft(); if (d) cqOpenSheet(d.mode === 'edit' && cqIdx(d.id) >= 0 ? 'edit' : 'new', d.id); return; }
  if (e.target.closest('[data-cq-dropdraft]')) {
    cqDraftPut(null);
    if (CQ.sheet) { CQ.sheet.data = CQ.sheet.mode === 'edit' && cqIdx(CQ.sheet.id) >= 0 ? cqPick(cqList()[cqIdx(CQ.sheet.id)]) : cqBlank(); CQ.sheet.draftAt = 0; }
    cqRerender();
    cqToast('Descartaste el borrador.');
    return;
  }
  if (e.target.closest('[data-cq-close]')) {
    // cancelar no toca la ficha guardada; si escribiste algo, queda como borrador
    var S = CQ.sheet; cqDraftSync(); CQ.sheet = false;
    if (S && S.mode === 'edit' && cqIdx(S.id) >= 0) CQ.pos = cqIdx(S.id) + 3;
    cqRerender();
    if (cqDraft()) cqToast('Lo que escribiste quedó como borrador.');
  }
});
document.addEventListener('submit', function (e) {
  if (e.target.id !== 'cq-form') return;
  e.preventDefault();
  var fm = e.target, x = cqFormData(fm), S = CQ.sheet;
  ['n', 'j', 'l', 'r', 'tm', 'en', 'se', 'idea', 'er'].forEach(function (k) { x[k] = x[k].trim(); });
  if (!x.n) { document.getElementById('cq-msg').textContent = 'Ponle nombre al problema.'; fm.elements.n.focus(); return; }
  var list = cqList(), at;
  if (S && S.mode === 'edit') {
    at = cqIdx(S.id);
    if (at < 0) { document.getElementById('cq-msg').textContent = 'Esta ficha ya no existe. Se guardará como ficha nueva.'; S.mode = 'new'; S.id = null; return; }
    // la fecha, el id y los repasos marcados se conservan
    list[at] = Object.assign({}, list[at], x, { up: Date.now() });
  } else {
    list.push(Object.assign({ id: cqId(), iso: cqToday(), rp: [false, false, false], up: Date.now() }, x));
    at = list.length - 1;
  }
  cqPut(list); cqDraftPut(null);
  var edited = S && S.mode === 'edit';
  CQ.sheet = false; CQ.pos = at + 3;
  cqRerender();
  window.scrollTo({ top: 0, behavior: 'auto' });
  cqToast(edited ? 'Guardaste los cambios de "' + x.n + '".' : 'Agregaste "' + x.n + '" al cuaderno.');
});
