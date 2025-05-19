/* ------------------------------------------------- */
/*  CONSTANTS & PHRASES                              */
/* ------------------------------------------------- */
const ROWS = 6, COLS = 5, CELLS = ROWS * COLS;
const STORAGE_KEY = "bingoCardStateV3";

const phrases = [
  "Um senhor idoso a ler jornal num banco de praça",
  "Um ciclista a atravessar uma passadeira sem desmontar",
  "Um turista com um mapa a tentar orientar-se",
  "Um vendedor ambulante a oferecer pulseiras e bijuteria",
  "Um homem de fato a beber café num balcão de bar",
  "Uma senhora a passear um cão pequeno com um casaco",
  "Um homem a tocar guitarra na praça",
  "Uma pessoa a andar com uma caixa de pizza",
  "Um casal de idosos de braço dado a caminhar lentamente",
  "Um artista de rua a desenhar caricaturas",
  "Um barco de pescadores a descarregar peixe",
  "Um vendedor de comida ambulante",
  "Um grupo de estudantes sentados no chão a conversar",
  "Um homem de bicicleta a ultrapassar o trânsito",
  "Um trabalhador de limpeza a varrer a calçada",
  "Um casal a tirar selfies com o mar ao fundo",
  "Um músico de rua a tocar acordeão",
  "Um jovem com uma trotinete elétrica a desviar-se dos peões",
  "Um grupo de turistas a seguir um guia com guarda-chuva levantado",
  "Um vendedor de gelados a servir um cone gigante",
  "Um senhor a discutir com o motorista de autocarro",
  "Um empregado de restaurante a ajustar as cadeiras do terraço",
  "Um casal a discutir em voz alta no meio da rua",
  "Um carteiro a distribuir cartas",
  "Um artista de rua a fazer estátua humana",
  "Um vendedor de rua a vender óculos de sol falsificados",
  "Um jovem a andar com uma mala de viagem pequena",
  "Um homem a passear dois cães grandes",
  "Uma mulher a correr para apanhar o autocarro",
  "Um sem-abrigo a pedir esmola com um cão ao lado",
  "Uma criança a correr atrás dos pombos na praça",
  "Um grupo de amigos a rir alto num café",
  "Um motociclista a acelerar num semáforo vermelho",
  "Um turista a tentar falar italiano e a gesticular muito",
  "Um pintor de rua a retratar uma paisagem",
  "Uma pessoa a usar chapéu italiano",
  "Um jovem a ouvir música alta com auscultadores enormes",
  "Uma pessoa a andar com um saco de compras",
  "Um estudante a ler um livro",
  "Um homem de meia-idade a fumar um charuto",
  "Uma criança a comer um gelado",
  "Um casal de namorados sem noção de espaço público",
  "Um grupo de ciclistas vestidos com roupa desportiva",
  "Uma pessoa a pescar",
  "Um turista a tentar tirar foto a uma gaivota",
  "Alguém com uma mala enorme a procurar o hostel"
];

/* ------------------------------------------------- */
/*  STATE LOAD / SAVE                                */
/* ------------------------------------------------- */
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      s &&
      Array.isArray(s.order)      && s.order.length      === CELLS &&
      Array.isArray(s.marks)      && s.marks.length      === CELLS &&
      Array.isArray(s.rowCount)   && s.rowCount.length   === ROWS  &&
      typeof s.cardCelebrated === "boolean"
    ) return s;
  } catch {}
  return null;
}
const saveState = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

/* ------------------------------------------------- */
/*  CONFETTI: robust loader                          */
/* ------------------------------------------------- */
function loadConfetti() {
  if (window.confetti) return Promise.resolve();

  return new Promise((resolve) => {
    const cdn = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    const script = document.createElement("script");
    script.src = cdn;
    script.async = true;
    script.onload  = () => resolve();
    script.onerror = () => resolve();  // continue silently if CDN fails
    document.head.appendChild(script);
  });
}

async function blastConfetti() {
  await loadConfetti();
  if (window.confetti) {
    window.confetti({
      particleCount : 240,
      spread        : 180,
      startVelocity : 55,
      ticks         : 480,
      origin        : { y: 0.6 }
    });
  }
}

/* ------------------------------------------------- */
/*  TEXT-FIT helper                                  */
/* ------------------------------------------------- */
function fitText(cell, { max = 18, min = 9 } = {}) {
  let size = max;
  cell.style.fontSize = size + "px";

  while (size > min &&
        (cell.scrollHeight > cell.clientHeight ||
         cell.scrollWidth  > cell.clientWidth))
    cell.style.fontSize = --size + "px";

  while (size < max &&
        cell.scrollHeight <= cell.clientHeight &&
        cell.scrollWidth  <= cell.clientWidth)
    cell.style.fontSize = ++size + "px";

  if (cell.scrollHeight > cell.clientHeight ||
      cell.scrollWidth  > cell.clientWidth)
    cell.style.fontSize = --size + "px";
}

/* ------------------------------------------------- */
/*  BUILD GRID                                       */
/* ------------------------------------------------- */
function build(state) {
  const grid = document.getElementById("bingoCard");
  grid.innerHTML = "";

  state.order.forEach((text, i) => {
    const row = Math.floor(i / COLS);

    const cell = document.createElement("div");
    cell.className = "bingo-cell";
    cell.textContent = text;
    cell.dataset.idx = i;
    cell.dataset.row = row;
    cell.style.animationDelay = `${i * 35}ms`;

    if (state.marks[i]) cell.classList.add("marked");

    cell.addEventListener("click", () => toggleMark(cell, state));
    grid.appendChild(cell);
  });

  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.querySelectorAll(".bingo-cell").forEach(fitText)
    )
  );
}

/* ------------------------------------------------- */
/*  HANDLE MARK & ROW CHECK                          */
/* ------------------------------------------------- */
function toggleMark(cell, state) {
  const idx = +cell.dataset.idx;
  const row = +cell.dataset.row;

  state.marks[idx] = !state.marks[idx];
  cell.classList.toggle("marked");

  state.rowCount[row] += state.marks[idx] ? 1 : -1;

  if (!state.cardCelebrated && state.rowCount[row] === COLS) {
    state.cardCelebrated = true;
    blastConfetti();
  }

  saveState(state);
}

/* ------------------------------------------------- */
/*  NEW CARD & INITIAL STATE                         */
/* ------------------------------------------------- */
function freshState() {
  const order = [...phrases].sort(() => Math.random() - 0.5).slice(0, CELLS);
  return {
    order,
    marks: Array(CELLS).fill(false),
    rowCount: Array(ROWS).fill(0),
    cardCelebrated: false
  };
}
function newCard() {
  const s = freshState();
  saveState(s);
  build(s);
}
window.newBingoCard = newCard;

/* ------------------------------------------------- */
/*  INIT                                             */
/* ------------------------------------------------- */
(function init() {
  const state = loadState() || freshState();
  saveState(state);

  /* Upgrade old saves that don't track row counts */
  if (!state.rowCount) {
    state.rowCount = Array(ROWS).fill(0);
    state.marks.forEach((m, i) => m && state.rowCount[Math.floor(i / COLS)]++);
  }

  build(state);

  document.getElementById("refreshBtn").addEventListener("click", newCard);
  window.addEventListener("resize",
    () => document.querySelectorAll(".bingo-cell").forEach(fitText)
  );
})();
