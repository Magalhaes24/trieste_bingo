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
    "Alguém com uma mala enorme a procurar o hostel", 
    "Sítio que o Fausto diria que fumava uma", 
    "Espaço já visitado pelas manas do daily"
];


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function adjustFontSize(cell) {
    let fontSize = 16; // Initial font size in px
    cell.style.fontSize = fontSize + "px";

    while (cell.scrollHeight > cell.clientHeight || cell.scrollWidth > cell.clientWidth) {
        fontSize -= 1;
        cell.style.fontSize = fontSize + "px";

        if (fontSize <= 9) break; // Prevents the font from becoming too small
    }
}

function generateBingoCard() {
    const shuffledPhrases = shuffle([...phrases]).slice(0, 30); // 6 rows x 5 columns
    const bingoCard = document.getElementById("bingoCard");
    bingoCard.innerHTML = "";

    shuffledPhrases.forEach((text) => {
        const cell = document.createElement("div");
        cell.classList.add("bingo-cell");
        cell.textContent = text;

        // Adjust font size dynamically
        setTimeout(() => adjustFontSize(cell), 10);

        // Tap to mark/unmark
        cell.addEventListener("click", () => {
            cell.classList.toggle("marked");
        });

        bingoCard.appendChild(cell);
    });
}

generateBingoCard();
