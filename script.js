/* ------------------------------------------------- */
/*  48 Bingo phrases                                 */
/* ------------------------------------------------- */
const phrases = [
    "Um senhor idoso a ler jornal num banco de praça",  "Um ciclista a atravessar uma passadeira sem desmontar",
    "Um turista com um mapa a tentar orientar-se",      "Um vendedor ambulante a oferecer pulseiras e bijuteria",
    "Um homem de fato a beber café num balcão de bar",  "Uma senhora a passear um cão pequeno com um casaco",
    "Um homem a tocar guitarra na praça",               "Uma pessoa a andar com uma caixa de pizza",
    "Um casal de idosos de braço dado a caminhar lentamente",
    "Um artista de rua a desenhar caricaturas",         "Um barco de pescadores a descarregar peixe",
    "Um vendedor de comida ambulante",                  "Um grupo de estudantes sentados no chão a conversar",
    "Um homem de bicicleta a ultrapassar o trânsito",   "Um trabalhador de limpeza a varrer a calçada",
    "Um casal a tirar selfies com o mar ao fundo",      "Um músico de rua a tocar acordeão",
    "Um jovem com uma trotinete elétrica a desviar-se dos peões",
    "Um grupo de turistas a seguir um guia com guarda-chuva levantado",
    "Um vendedor de gelados a servir um cone gigante",  "Um senhor a discutir com o motorista de autocarro",
    "Um empregado de restaurante a ajustar as cadeiras do terraço",
    "Um casal a discutir em voz alta no meio da rua",   "Um carteiro a distribuir cartas",
    "Um artista de rua a fazer estátua humana",         "Um vendedor de rua a vender óculos de sol falsificados",
    "Um jovem a andar com uma mala de viagem pequena",  "Um homem a passear dois cães grandes",
    "Uma mulher a correr para apanhar o autocarro",     "Um sem-abrigo a pedir esmola com um cão ao lado",
    "Uma criança a correr atrás dos pombos na praça",   "Um grupo de amigos a rir alto num café",
    "Um motociclista a acelerar num semáforo vermelho", "Um turista a tentar falar italiano e a gesticular muito",
    "Um pintor de rua a retratar uma paisagem",         "Uma pessoa a usar chapéu italiano",
    "Um jovem a ouvir música alta com auscultadores enormes",
    "Uma pessoa a andar com um saco de compras",        "Um estudante a ler um livro",
    "Um homem de meia-idade a fumar um charuto",        "Uma criança a comer um gelado",
    "Um casal de namorados sem noção de espaço público","Um grupo de ciclistas vestidos com roupa desportiva",
    "Uma pessoa a pescar",                              "Um turista a tentar tirar foto a uma gaivota",
    "Alguém com uma mala enorme a procurar o hostel"
  ];
  
  /* ------------------------------------------------- */
  /*  Local-storage helpers                            */
  /* ------------------------------------------------- */
  const STORAGE_KEY = "bingoCardState";
  const ROWS = 6, COLS = 5, CELLS = 30;
  
  function loadState() {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (
        d &&
        Array.isArray(d.order)   && d.order.length   === CELLS &&
        Array.isArray(d.marks)   && d.marks.length   === CELLS &&
        Array.isArray(d.rowDone) && d.rowDone.length === ROWS  &&
        Array.isArray(d.colDone) && d.colDone.length === COLS
      ) return d;
    } catch {/* ignore */}
    return null;
  }
  const saveState = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  
  /* Fresh blank game */
  function freshState() {
    const order = [...phrases].sort(() => Math.random() - 0.5).slice(0, CELLS);
    return {
      order,
      marks:   Array(CELLS).fill(false),
      rowDone: Array(ROWS).fill(false),
      colDone: Array(COLS).fill(false)
    };
  }
  
  /* ------------------------------------------------- */
  /*  Text-fit helper                                  */
  /* ------------------------------------------------- */
  function fitText(cell, { max = 18, min = 9 } = {}) {
    let size = max;
    cell.style.fontSize = size + "px";
    while (
      size > min &&
      (cell.scrollHeight > cell.clientHeight ||
       cell.scrollWidth  > cell.clientWidth)
    ) cell.style.fontSize = --size + "px";
  
    while (
      size < max &&
      cell.scrollHeight <= cell.clientHeight &&
      cell.scrollWidth  <= cell.clientWidth
    ) cell.style.fontSize = ++size + "px";
  
    if (
      cell.scrollHeight > cell.clientHeight ||
      cell.scrollWidth  > cell.clientWidth
    ) cell.style.fontSize = --size + "px";
  }
  
  /* ------------------------------------------------- */
  /*  🔴  BIG ROW-CONFETTI EXPLOSION                   */
  /* ------------------------------------------------- */
  function celebrateRow() {
    if (typeof confetti !== "function") return;
  
    // three quick bursts (left, center, right)
    const defaults = { spread: 105, startVelocity: 55, ticks: 550, particleCount: 120 };
    confetti({ ...defaults, origin: { x: 0.1, y: 0.6 } });
    confetti({ ...defaults, origin: { x: 0.5, y: 0.4 } });
    confetti({ ...defaults, origin: { x: 0.9, y: 0.6 } });
  }
  
  /* ------------------------------------------------- */
  /*  Build the board                                  */
  /* ------------------------------------------------- */
  function build(state) {
    const { order, marks } = state;
    const grid = document.getElementById("bingoCard");
    grid.innerHTML = "";
  
    order.forEach((txt, idx) => {
      const r = Math.floor(idx / COLS);
      const c = idx % COLS;
  
      const cell = Object.assign(document.createElement("div"), {
        className: "bingo-cell",
        textContent: txt,
        style: `animation-delay:${idx * 40}ms`
      });
      cell.dataset.idx = idx;
      cell.dataset.row = r;
      cell.dataset.col = c;
  
      if (marks[idx]) cell.classList.add("marked");
  
      cell.addEventListener("click", () => toggleMark(cell, state));
      grid.appendChild(cell);
    });
  
    // wait 2 frames → layout stable → fit
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.querySelectorAll(".bingo-cell").forEach(fitText)
      )
    );
  }
  
  /* ------------------------------------------------- */
  /*  Handle clicks, update state, maybe explode       */
  /* ------------------------------------------------- */
  function toggleMark(cell, state) {
    const { marks, rowDone } = state;
    const idx = +cell.dataset.idx;
    marks[idx] = !marks[idx];
    cell.classList.toggle("marked");
  
    const r = +cell.dataset.row,
          c = +cell.dataset.col;
  
    /* ROW check & celebration (columns no longer celebrate) */
    if (!rowDone[r]) {
      const rowCells = [...document.querySelectorAll(`.bingo-cell[data-row='${r}']`)];
      if (rowCells.every((c) => c.classList.contains("marked"))) {
        rowDone[r] = true;
        celebrateRow();
      }
    }
  
    saveState(state);
  }
  
  /* ------------------------------------------------- */
  /*  New shuffled card                                */
  /* ------------------------------------------------- */
  function shuffleCard() {
    const fresh = freshState();
    saveState(fresh);
    build(fresh);
  }
  window.newBingoCard = shuffleCard;
  
  /* ------------------------------------------------- */
  /*  Initialise                                       */
  /* ------------------------------------------------- */
  (function init() {
    const state = loadState() || freshState();
    saveState(state);               // ensure we store full schema
  
    build(state);
  
    document.getElementById("refreshBtn")
            .addEventListener("click", shuffleCard);
  
    window.addEventListener("resize", () =>
      document.querySelectorAll(".bingo-cell").forEach(fitText)
    );
  })();
  
