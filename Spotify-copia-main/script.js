
import { db } from "./config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const progresso = document.getElementById("progresso");
const progressoc = document.getElementById("progressoc")
const musica = new Audio();
const btnmusica = document.querySelectorAll(".musica");
const play = document.getElementById("play")


const listaMusicas = document.getElementById("lista-musicas");

function criarBotaoMusica(m) {
  const btn = document.createElement("button");
  btn.className = "musica";
  btn.setAttribute("data-src", m.audioUrl);

  const img = document.createElement("img");
  img.src = m.capaUrl;
  img.alt = m.titulo;

  const p = document.createElement("p");
  p.className = "nome";
  p.textContent = `${m.titulo} - ${m.artista}`;

  btn.append(img, p);
  return btn;
}

async function carregarMusicas() {
  const snap = await get(ref(db, "musicas"));
  const musicas = snap.val() || {};
  Object.values(musicas).forEach(m => listaMusicas.appendChild(criarBotaoMusica(m)));
}

play.addEventListener('click', () => {
  if (musica.paused) {
    musica.play();
    play.textContent = '⏸';
  } else {
    musica.pause();
    play.textContent = '▶';
  }
});


document.addEventListener('click', (e) => {
  const botao = e.target.closest('.musica');
  if (!botao) return;

  play.textContent = '⏸';
  musica.src = botao.getAttribute('data-src');
  document.getElementById("teste").innerHTML = `Tocando: ${botao.textContent}`;
  musica.play();
});

musica.addEventListener('timeupdate', (e) => {
  const { duration, currentTime } = e.srcElement;
  const progressop = (currentTime / duration) * 100;
  progresso.style.width = `${progressop}%`;
});

  progressoc.addEventListener('click', (e) => {
  const width = progressoc.clientWidth;
  const clickX = e.offsetX;
  const duration = musica.duration;
  musica.currentTime = (clickX / width) * duration;
  });

const musicas = document.querySelectorAll('.musica')
const biblioteca = document.querySelector(".biblioteca");

function salvarBiblioteca() {
  const lista = [...biblioteca.querySelectorAll(".musica")]
    .map(m => m.getAttribute("data-src"));
  localStorage.setItem("biblioteca", JSON.stringify(lista));
}

function carregarBiblioteca() {
  const lista = JSON.parse(localStorage.getItem("biblioteca") || "[]");
  lista.forEach(src => {
    const original = document.querySelector(`.musicas .musica[data-src="${src}"]`);
    if (original) biblioteca.appendChild(original.cloneNode(true));
  });
}

carregarMusicas().then(carregarBiblioteca);

document.addEventListener('contextmenu', (e) => {
  const elemento = e.target.closest('.musica');
  if (!elemento) return;

  e.preventDefault();

  if (elemento.closest('.biblioteca')) {
    if (confirm("Remover da Biblioteca?")) {
      elemento.remove();
      salvarBiblioteca();
    }
    return;
  }

  if (confirm("Enviar para a Biblioteca?")) {
    biblioteca.appendChild(elemento.cloneNode(true));
    salvarBiblioteca();
  }
});

const pesquisa = document.getElementById("pesquisar");

pesquisa.addEventListener("input", () => {
  const termo = pesquisa.value.toLowerCase().trim();

  document.querySelectorAll(".musica").forEach(musica => {
    const nome = musica.textContent.toLowerCase();
    musica.style.display = nome.includes(termo) ? '' : 'none';
  });
});


