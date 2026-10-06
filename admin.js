import { db } from "./config.js";
import { ref, push, update, remove, onValue }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const musicasRef = ref(db, "musicas");
const form = document.getElementById("form-musica");
const tabela = document.getElementById("tabela");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");

let editandoId = null;
let cache = {};

const campo = id => document.getElementById(id);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    titulo: campo("titulo").value.trim(),
    artista: campo("artista").value.trim(),
    capaUrl: "img/" + campo("capa").value.trim(),
    audioUrl: "musicas/" + campo("audio").value.trim(),
  };

  if (editandoId) {
    await update(ref(db, `musicas/${editandoId}`), dados);
  } else {
    dados.criadoEm = new Date().toISOString();
    await push(musicasRef, dados);
  }
  resetarForm();
});

onValue(musicasRef, (snap) => {
  cache = snap.val() || {};
  tabela.innerHTML = "";

  Object.entries(cache).forEach(([id, m]) => {
    const tr = document.createElement("tr");

    const tdCapa = document.createElement("td");
    const img = document.createElement("img");
    img.src = m.capaUrl;
    img.width = 50;
    tdCapa.appendChild(img);
    tr.appendChild(tdCapa);

    [m.titulo, m.artista].forEach(texto => {
      const td = document.createElement("td");
      td.textContent = texto;
      tr.appendChild(td);
    });

    const tdAcoes = document.createElement("td");
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "✏️";
    btnEditar.onclick = () => editar(id);
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.onclick = () => excluir(id);
    tdAcoes.append(btnEditar, btnExcluir);
    tr.appendChild(tdAcoes);

    tabela.appendChild(tr);
  });
});

function editar(id) {
  const m = cache[id];
  editandoId = id;
  campo("titulo").value = m.titulo;
  campo("artista").value = m.artista;
  campo("capa").value = m.capaUrl.replace("img/", "");
  campo("audio").value = m.audioUrl.replace("musicas/", "");
  btnSalvar.textContent = "Salvar alterações";
  btnCancelar.hidden = false;
}

async function excluir(id) {
  if (confirm("Excluir esta música?")) {
    await remove(ref(db, `musicas/${id}`));
  }
}

function resetarForm() {
  form.reset();
  editandoId = null;
  btnSalvar.textContent = "+ Adicionar música";
  btnCancelar.hidden = true;
}

btnCancelar.addEventListener("click", resetarForm);