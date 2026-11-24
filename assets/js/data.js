// Datos de ejemplo para los prototipos de GPC Ladders.
// Nada de esto es real: handles, problemas y números son inventados.
(function () {
  // PRNG determinista para que los tres diseños muestren lo mismo
  var seed = 20261118;
  function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function int(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }

  var levels = [
    { id: 'basico', name: 'Básico', letter: 'B', color: '#F7931E', ink: '#111111', range: [800, 1200],
      blurb: 'Implementación, matemática y las primeras ideas clave. Aquí aprendes a leer un problema y a no pelearte con el compilador.' },
    { id: 'intermedio', name: 'Intermedio', letter: 'I', color: '#F05A8C', ink: '#111111', range: [1200, 1600],
      blurb: 'Búsqueda binaria, grafos, DP clásica. Los temas que separan al que participa del que suma puntos.' },
    { id: 'avanzado', name: 'Avanzado', letter: 'A', color: '#3B8BEB', ink: '#FFFFFF', range: [1600, 2000],
      blurb: 'Estructuras de datos serias, árboles y combinatoria. Lo que se pide en un regional para pelear medalla.' },
    { id: 'icpc', name: 'Nivel ICPC', letter: '★', color: '#8B5CF6', ink: '#FFFFFF', range: [2000, 2600],
      blurb: 'Flujos, geometría, FFT y estrategia de equipo. El camino a PDA y, quién sabe, a la World Finals.' }
  ];

  var topicDefs = {
    basico: [
      ['impl', 'Implementación', '⌨', ['Simulación', 'Casos borde', 'Lectura rápida']],
      ['math1', 'Matemática', '∑', ['Paridad', 'Divisibilidad', 'Fórmulas cerradas']],
      ['sort', 'Ordenamiento', '⇅', ['sort + comparador', 'Conteo', 'Coordenadas']],
      ['str1', 'Strings', 'Aa', ['Palíndromos', 'Frecuencias', 'Subcadenas']],
      ['greedy', 'Greedy', '◔', ['Intercambio', 'Intervalos', 'Contraejemplos']],
      ['prefix', 'Sumas prefijas', '▤', ['Prefijos 1D', 'Prefijos 2D', 'Diferencias']],
      ['brute', 'Fuerza bruta', '⚒', ['Backtracking', 'Bitmask 2ⁿ', 'Poda']]
    ],
    intermedio: [
      ['bs', 'Búsqueda binaria', '⌕', ['Sobre la respuesta', 'lower_bound', 'Reales']],
      ['twop', 'Two pointers', '⇄', ['Ventana', 'Dos arreglos', 'Monotonía']],
      ['graph1', 'Grafos', '◎', ['BFS', 'DFS', 'Componentes', 'Bipartito']],
      ['dp1', 'Programación dinámica', '▦', ['Mochila', 'LIS', 'Grillas']],
      ['nt', 'Teoría de números', '℘', ['Criba', 'GCD / LCM', 'Exponenciación']],
      ['hash', 'Strings y hashing', '#', ['Polinomial', 'Doble hash', 'Comparar subcadenas']],
      ['ds1', 'Estructuras STL', '{}', ['set / map', 'Pila monótona', 'deque']],
      ['bits', 'Bits', '⊕', ['XOR', 'Máscaras', 'Popcount']]
    ],
    avanzado: [
      ['seg', 'Segment tree', '▥', ['Lazy', 'Merge de nodos', 'Descenso']],
      ['dsu', 'DSU', '⋈', ['Union by size', 'Offline', 'Rollback']],
      ['sp', 'Caminos mínimos', '↯', ['Dijkstra', 'Bellman-Ford', 'Floyd']],
      ['dp2', 'DP avanzada', '▩', ['Bitmask DP', 'Digit DP', 'DP en árboles']],
      ['comb', 'Combinatoria', 'nCk', ['Factoriales mod p', 'Inclusión-exclusión', 'Catalan']],
      ['str2', 'Strings clásicos', 'Σ*', ['KMP', 'Función Z', 'Trie']],
      ['trees', 'Árboles', '⟟', ['LCA', 'Binary lifting', 'Euler tour']],
      ['geo1', 'Geometría básica', '△', ['Producto cruz', 'Orientación', 'Áreas']]
    ],
    icpc: [
      ['flow', 'Flujos', '⇶', ['Dinic', 'Min-cut', 'Matching']],
      ['geo2', 'Geometría computacional', '⬡', ['Convex hull', 'Sweep line', 'Polígonos']],
      ['fft', 'FFT / NTT', '∿', ['Convolución', 'Polinomios', 'Big multiply']],
      ['dpopt', 'Optimización de DP', '⧉', ['Convex hull trick', 'Divide & conquer', 'Knuth']],
      ['hld', 'Heavy-light / Centroid', '⑂', ['HLD', 'Centroid', 'Small to large']],
      ['sa', 'Suffix structures', '$', ['Suffix array', 'LCP', 'Automaton']],
      ['games', 'Teoría de juegos', '♞', ['Nim', 'Grundy', 'Minimax']],
      ['team', 'Estrategia de equipo', '⚑', ['Lectura en paralelo', 'Una PC, tres cabezas', 'Debug en papel']]
    ]
  };

  var nameA = ['Valeria', 'Pizza', 'Torres', 'Llama', 'Cuy', 'Robot', 'Mochila', 'Ceviche', 'Combi', 'Tren', 'Lima', 'Arequipa', 'Cusco', 'Puente', 'Faro', 'Reloj', 'Globo', 'Moneda', 'Isla', 'Laberinto', 'Bodega', 'Grafo', 'Cadena', 'Tablero', 'Rey', 'Torre', 'Panadero', 'Cartero', 'Volcán', 'Chasqui'];
  var nameB = ['y el arreglo', 'perdidos', 'mágicos', 'en el Callao', 'contra el tiempo', 'balanceados', 'de colores', 'infinitos', 'y los XOR', 'en fila', 'del ciclo', 'pares', 'del Misti', 'a medianoche', 'sin vuelta', 'y la combi', 'gemelos', 'prohibidos', 'del puerto', 'en espiral'];
  var judges = ['CF', 'CF', 'CF', 'CF', 'AtCoder', 'CSES', 'vjudge'];

  var topics = [];
  var problems = {};
  levels.forEach(function (lv, li) {
    topicDefs[lv.id].forEach(function (t, ti) {
      var n = int(9, 14);
      var list = [];
      // progreso decreciente con el nivel para "tu" usuario
      var solvedRate = [0.92, 0.64, 0.28, 0.06][li];
      var ac = 0;
      for (var i = 0; i < n; i++) {
        var r = Math.round((lv.range[0] + (lv.range[1] - lv.range[0]) * (i / (n - 1)) + int(-60, 60)) / 100) * 100;
        var judge = pick(judges);
        var code = judge === 'CF' ? (int(1400, 2040) + String.fromCharCode(65 + int(0, 5)))
          : judge === 'AtCoder' ? ('abc' + int(250, 380) + '_' + String.fromCharCode(99 + int(0, 4)))
          : judge === 'CSES' ? String(int(1068, 2430)) : ('GPC-' + int(10, 99));
        var roll = rnd();
        var status = roll < solvedRate * (1.15 - i / n * 0.4) ? 'ac' : (roll < solvedRate + 0.12 ? 'wa' : 'none');
        if (li === 0) status = 'ac';
        if (status === 'ac') ac++;
        list.push({
          id: lv.id + '-' + t[0] + '-' + i,
          n: i + 1,
          name: pick(nameA) + ' ' + pick(nameB),
          judge: judge, code: code, rating: Math.max(800, r),
          solvedBy: Math.max(1, Math.round(38 * (1 - i / (n + 2)) * (1 - li * 0.18)) + int(-3, 3)),
          status: status,
          star: rnd() < 0.12
        });
      }
      problems[t[0]] = list;
      topics.push({
        id: t[0], level: lv.id, name: t[1], glyph: t[2], concepts: t[3],
        total: n, solved: ac,
        theory: [
          { kind: 'Lectura', title: 'Qué es ' + t[1].toLowerCase() + ' y cuándo usarlo', mins: int(8, 15) },
          { kind: 'Clase GPC', title: 'Clase grabada: ' + t[3][0], mins: int(45, 90) },
          { kind: 'Código', title: 'Plantilla en C++ — ' + t[3][1 % t[3].length], mins: int(5, 10) },
          { kind: 'Lectura', title: 'Errores típicos y casos borde', mins: int(6, 12) },
          { kind: 'Editorial', title: 'Problemas resueltos paso a paso', mins: int(20, 35) }
        ]
      });
    });
  });

  // Logros: 30, de más fácil a más difícil (el orden del arreglo es el de la página)
  var achievements = [
    { id: 'hola', name: 'Hola mundo', tier: 'comun', icon: '👋', color: '#16A34A', desc: 'Tu primer AC en Codeforces.' },
    { id: 'rueditas', name: 'Sin rueditas', tier: 'comun', icon: '🚲', color: '#8B5CF6', desc: 'Participa en tu primer contest.' },
    { id: 'diez', name: 'Diez de diez', tier: 'comun', icon: '🔟', color: '#8B5CF6', desc: 'Resuelve 10 problemas.' },
    { id: 'enviciado', name: 'Enviciado', tier: 'comun', icon: '🎰', color: '#8B5CF6', desc: 'Resuelve 50 problemas.' },
    { id: 'primeros-pasos', name: 'Primeros pasos', tier: 'comun', icon: '🖍️', color: '#16A34A', desc: 'Llega a Pupil (1200) en Codeforces.' },
    { id: 'pan', name: 'El pan de cada día', tier: 'comun', icon: '🥖', color: '#E9A84C', desc: 'Resuelve 5 problemas del día.' },
    { id: 'simulacro', name: 'Esto era un simulacro', tier: 'comun', icon: '🚨', color: '#16A34A', desc: 'Termina una simulación en Arena.' },
    { id: 'desarrollo', name: 'Era desarrollo de personaje', tier: 'comun', icon: '📉', color: '#F05A8C', desc: 'Pierde más de 100 de rating en un solo contest.' },
    { id: 'empieza', name: 'Empieza lo bueno', tier: 'comun', icon: '🔥', color: '#F7931E', desc: 'Asiste a tu primera clase del GPC.' },
    { id: 'metodos', name: 'Tengo mis métodos', tier: 'raro', icon: '🎩', color: '#2EC4B6', desc: 'Llega a Specialist (1400) en Codeforces.' },
    { id: 'un-ac-mas', name: 'Un AC más y me duermo', tier: 'raro', icon: '🐑', color: '#8B5CF6', desc: 'Resuelve 99 problemas.' },
    { id: 'fin-tutorial', name: 'Fin del tutorial', tier: 'raro', icon: '🎓', color: '#1E1B3A', desc: 'Completa todo el nivel Beginner.' },
    { id: 'grandes-ligas', name: 'Grandes ligas', tier: 'raro', icon: '🐟', color: '#3B8BEB', desc: 'Completa todo el nivel Junior.' },
    { id: 'stonks', name: 'Stonks', tier: 'raro', icon: '📈', color: '#F7931E', desc: 'Gana más de 100 de rating en un solo contest.' },
    { id: 'justo', name: 'Justo justo', tier: 'raro', icon: '⏱️', color: '#F7931E', desc: 'AC en los últimos 5 minutos de un contest.' },
    { id: 'pendientes', name: 'Asuntos pendientes', tier: 'raro', icon: '📝', color: '#F5C451', desc: 'Upsolvea 25 problemas.' },
    { id: 'greedy', name: 'Es greedy', tier: 'raro', icon: '🧵', color: '#16A34A', desc: 'Resuelve problemas de 15 temas distintos.' },
    { id: 'otra-vez', name: '¿Otra vez tú?', tier: 'raro', icon: '🪪', color: '#8B5CF6', desc: 'Participa en 15 contests.' },
    { id: 'jaque', name: 'Jaque mate', tier: 'epico', icon: '♚', color: '#F05A8C', desc: 'Hackea a alguien durante un round.' },
    { id: 'funcionaba', name: 'Se supone que eso funcionaba', tier: 'epico', icon: '💥', color: '#F05A8C', desc: 'Que alguien hackee tu solución.' },
    { id: 'david', name: 'David contra Goliat', tier: 'epico', icon: '🪨', color: '#E3AF3A', desc: 'Gana un duelo a alguien con 200 o más de rating que tú.' },
    { id: 'expert-dia', name: 'Expert por un día', tier: 'epico', icon: '🪞', color: '#3B8BEB', desc: 'Performance de 1600 o más en una simulación.' },
    { id: 'elegidos', name: 'Entre los elegidos', tier: 'epico', icon: '🔦', color: '#F5C451', desc: 'Termina un ciclo en el top 10 del ranking General.' },
    { id: 'joven', name: 'Joven promesa', tier: 'epico', icon: '🦁', color: '#3B8BEB', desc: 'Llega a Expert (1600) en Codeforces.' },
    { id: 'candidato', name: 'Candidato presidencial', tier: 'leyenda', icon: '🗳️', color: '#8B5CF6', desc: 'Llega a Candidate Master (1900) en Codeforces.' },
    { id: 'experiencia', name: '¿Esto cuenta como experiencia laboral?', tier: 'leyenda', icon: '🥈', color: '#9C99AC', desc: 'Resuelve 500 problemas.' },
    { id: 'perdi-cuenta', name: 'Ya perdí la cuenta', tier: 'leyenda', icon: '🥇', color: '#F5C451', desc: 'Resuelve 1000 problemas.' },
    { id: 'primero', name: 'Primero, luego existo', tier: 'leyenda', icon: '🏆', color: '#F5C451', desc: 'Termina primero en el ranking General del ciclo.' },
    { id: 'icpc', name: 'Mamá, estoy en ICPC', tier: 'leyenda', icon: '📺', color: '#F05A8C', desc: 'Participa en el ICPC representando a la UPC.' },
    { id: 'monas', name: 'Monas Chinas', tier: 'leyenda', icon: '🎈', color: '#1E1B3A', desc: 'Clasifica a un PDA, en honor al primer equipo de la UPC que lo logró.' }
  ];
  var mine = ['hola', 'rueditas', 'diez', 'enviciado', 'primeros-pasos', 'pan', 'simulacro', 'desarrollo', 'empieza', 'metodos', 'un-ac-mas', 'fin-tutorial', 'stonks', 'otra-vez'];
  achievements.forEach(function (a) { a.mine = mine.indexOf(a.id) !== -1; a.date = a.mine ? pick(['12 mar 2026', '3 may 2026', '28 jun 2026', '9 ago 2026', '21 sep 2026', '2 nov 2026']) : null; });

  var summitOf = { basico: 'fin-tutorial', intermedio: 'grandes-ligas' };
  var tierInfo = {
    comun: { name: 'Común', color: '#59547A' },
    raro: { name: 'Raro', color: '#3B8BEB' },
    epico: { name: 'Épico', color: '#F05A8C' },
    leyenda: { name: 'Leyenda', color: '#8B5CF6' }
  };

  function rankOf(r) {
    if (r >= 2400) return { name: 'Grandmaster', color: '#FF0000' };
    if (r >= 2100) return { name: 'Master', color: '#FF8C00' };
    if (r >= 1900) return { name: 'Candidate Master', color: '#AA00AA' };
    if (r >= 1600) return { name: 'Expert', color: '#0000FF' };
    if (r >= 1400) return { name: 'Specialist', color: '#03A89E' };
    if (r >= 1200) return { name: 'Pupil', color: '#008000' };
    return { name: 'Newbie', color: '#808080' };
  }

  var memberDefs = [
    ['segtree_sofi', 'Sofía L.', 'Senior', 2134],
    ['nocturno_dp', 'Renato Q.', 'Senior', 1968],
    ['lucia.flow', 'Lucía M.', 'Senior', 1842],
    ['mrbitmask', 'Mateo C.', 'Senior', 1711],
    ['kmp_kevin', 'Kevin H.', 'Junior', 1623],
    ['dijkstra_dani', 'Daniela V.', 'Junior', 1544],
    ['ximena_xor', 'Ximena T.', 'Junior', 1452],
    ['tu_handle', 'Tú', 'Junior', 1487],
    ['fabri_greedy', 'Fabricio R.', 'Junior', 1376],
    ['camila_ac', 'Camila S.', 'Beginner', 1263],
    ['alejo_wa', 'Alejandro P.', 'Beginner', 1188],
    ['renzo404', 'Renzo D.', 'Beginner', 1094],
    ['mati_mod', 'Matías G.', 'Beginner', 982],
    ['vale.prefix', 'Valentina N.', 'Beginner', 871]
  ];
  var verdicts = ['AC', 'AC', 'AC', 'WA', 'TLE', 'AC'];
  var agos = ['hace 3 min', 'hace 12 min', 'hace 40 min', 'hace 1 h', 'hace 3 h', 'ayer', 'hace 2 días'];
  var members = memberDefs.map(function (m, i) {
    var r = m[3];
    var base = Math.min(1, (r - 700) / 1500);
    var prog = [
      Math.min(100, Math.round(60 + base * 45 + int(-5, 5))),
      Math.min(100, Math.max(0, Math.round(base * 110 - 15 + int(-8, 8)))),
      Math.min(100, Math.max(0, Math.round(base * 90 - 40 + int(-8, 8)))),
      Math.min(100, Math.max(0, Math.round(base * 60 - 30 + int(-5, 5))))
    ];
    if (m[0] === 'tu_handle') prog = [100, 68, 22, 3];
    var hist = [];
    var v = r - int(250, 450);
    for (var k = 0; k < 24; k++) { v += int(-55, 75); hist.push(v); }
    hist[hist.length - 1] = r;
    var recent = [];
    for (var k2 = 0; k2 < 5; k2++) {
      var t = pick(topics);
      var p = pick(problems[t.id]);
      recent.push({ problem: p.name, code: p.judge + ' ' + p.code, rating: p.rating, verdict: pick(verdicts), ago: agos[Math.min(agos.length - 1, k2 + int(0, 2))], topic: t.name });
    }
    return {
      handle: m[0], name: m[1], group: m[2], rating: r, maxRating: r + int(0, 120), rank: rankOf(r),
      solved: m[0] === 'tu_handle' ? 412 : Math.round(80 + base * 900 + int(-40, 40)),
      streak: m[0] === 'tu_handle' ? 12 : int(0, 40),
      weekSolved: int(2, 31),
      ladder: prog,
      badges: m[0] === 'tu_handle' ? mine.length : Math.round(4 + base * 18 + int(-2, 2)),
      online: rnd() < 0.35,
      lastActive: pick(agos),
      history: hist,
      recent: recent,
      focus: pick(topics).name
    };
  });

  var me = members.filter(function (m) { return m.handle === 'tu_handle'; })[0];
  me.ladder = levels.map(function (l) {
    var a = 0, b = 0; topics.forEach(function (t) { if (t.level === l.id) { a += t.solved; b += t.total; } });
    return Math.round(a / b * 100);
  });

  // Heatmap de 26 semanas para el perfil
  var heat = [];
  for (var w = 0; w < 26; w++) { var col = []; for (var d = 0; d < 7; d++) { var x = rnd(); col.push(x < 0.35 ? 0 : x < 0.6 ? 1 : x < 0.8 ? 2 : x < 0.93 ? 3 : 4); } heat.push(col); }
  for (var s = 0; s < 12; s++) { heat[25 - Math.floor(s / 7)][6 - (s % 7)] = Math.max(1, heat[25 - Math.floor(s / 7)][6 - (s % 7)]); }
  me.heat = heat;

  var contests = [
    { name: 'GPC Weekly #34', judge: 'vjudge', when: 'Sáb 21 nov · 10:00', dur: '3 h', kind: 'gpc', note: 'Todos los niveles · Div. Beginner / Junior / Senior' },
    { name: 'Codeforces Round 1062 (Div. 2)', judge: 'CF', when: 'Dom 22 nov · 09:35', dur: '2 h', kind: 'cf', note: 'Rated para < 2100' },
    { name: 'AtCoder Beginner Contest 432', judge: 'AtCoder', when: 'Sáb 21 nov · 07:00', dur: '1 h 40', kind: 'atc', note: 'Ideal para Básico e Intermedio' },
    { name: 'Simulacro ICPC — set Latam 2024', judge: 'vjudge', when: 'Mié 25 nov · 18:00', dur: '5 h', kind: 'gpc', note: 'Solo equipos Senior · una PC por equipo' },
    { name: 'Educational Round 185', judge: 'CF', when: 'Jue 26 nov · 09:35', dur: '2 h', kind: 'cf', note: 'Hackeos abiertos 12 h — ve por el Caballo de Troya' },
    { name: 'Training Camp 2027', judge: 'GPC', when: 'Ene 2027', dur: '2 semanas', kind: 'camp', note: 'Con coaches finalistas mundiales' }
  ];

  var daily = { topic: 'Búsqueda binaria', level: 'intermedio', name: 'Escape Plan', judge: 'CF', code: '1873E', rating: 1300, solvedBy: 9 };

  window.GPC = {
    levels: levels, topics: topics, problems: problems, achievements: achievements, tierInfo: tierInfo,
    summit: function (lv) { var id = summitOf[lv]; return achievements.filter(function (a) { return a.id === id; })[0]; },
    members: members, me: me, contests: contests, daily: daily, rankOf: rankOf,
    topicsOf: function (lv) { return topics.filter(function (t) { return t.level === lv; }); },
    level: function (id) { return levels.filter(function (l) { return l.id === id; })[0]; },
    topic: function (id) { return topics.filter(function (t) { return t.id === id; })[0]; },
    levelProgress: function (lv) {
      var ts = topics.filter(function (t) { return t.level === lv; });
      var a = 0, b = 0; ts.forEach(function (t) { a += t.solved; b += t.total; });
      return { solved: a, total: b, pct: Math.round(a / b * 100) };
    }
  };
})();
