import { db } from "./config.js";

import {
  ref,
  push,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



const CLOUD_NAME = "utvyzxlr";

const UPLOAD_PRESET = "bagugafy_upload";


const musicasRef = ref(db, "musicas");

const form = document.getElementById("form-musica");
const tabela = document.getElementById("tabela");

const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");

const statusUpload = document.getElementById("status-upload");

const campo = id => document.getElementById(id);


let editandoId = null;

let cache = {};

let capaAtual = "";
let audioAtual = "";



async function enviarParaCloudinary(arquivo, tipo) {

  if (!arquivo) {
    return null;
  }

  let url;

  if (tipo === "imagem") {

    url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  } else {

    url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  }


  const formData = new FormData();

  formData.append("file", arquivo);

  formData.append("upload_preset", UPLOAD_PRESET);

  formData.append(
    "folder",
    tipo === "imagem"
      ? "bagugafy/capas"
      : "bagugafy/musicas"
  );


  const resposta = await fetch(url, {
    method: "POST",
    body: formData
  });


  if (!resposta.ok) {

    const erro = await resposta.text();

    console.error("Erro Cloudinary:", erro);

    throw new Error("Não foi possível enviar o arquivo.");

  }


  const dados = await resposta.json();

  return dados.secure_url;
}


form.addEventListener("submit", async (e) => {

  e.preventDefault();


  const titulo = campo("titulo").value.trim();

  const artista = campo("artista").value.trim();

  const capaArquivo = campo("capa").files[0];

  const audioArquivo = campo("audio").files[0];


  if (!titulo || !artista) {

    alert("Preencha o título e o artista.");

    return;

  }


  try {

    btnSalvar.disabled = true;

    statusUpload.textContent = "Preparando upload...";


    if (capaArquivo) {

      statusUpload.textContent = "Enviando capa...";

      capaAtual = await enviarParaCloudinary(
        capaArquivo,
        "imagem"
      );

    }

    if (audioArquivo) {

      statusUpload.textContent = "Enviando música...";

      audioAtual = await enviarParaCloudinary(
        audioArquivo,
        "audio"
      );

    }

    const dados = {

      titulo: titulo,

      artista: artista,

      capaUrl: capaAtual,

      audioUrl: audioAtual

    };

    if (editandoId) {

      await update(
        ref(db, `musicas/${editandoId}`),
        dados
      );

    }

    else {

      dados.criadoEm = new Date().toISOString();

      await push(
        musicasRef,
        dados
      );

    }


    statusUpload.textContent =
      "✅ Música salva com sucesso!";


    resetarForm();


  } catch (erro) {

    console.error(erro);

    statusUpload.textContent =
      "❌ Erro ao enviar a música.";

    alert(
      "Erro ao enviar a música. Veja o Console (F12) para mais detalhes."
    );

  }


  btnSalvar.disabled = false;

});


onValue(musicasRef, (snap) => {

  cache = snap.val() || {};

  tabela.innerHTML = "";


  Object.entries(cache).forEach(([id, m]) => {

    const tr = document.createElement("tr");

    const tdCapa = document.createElement("td");

    const img = document.createElement("img");

    img.src = m.capaUrl || "img/logo.png";

    img.width = 50;

    img.height = 50;

    img.style.objectFit = "cover";

    tdCapa.appendChild(img);

    tr.appendChild(tdCapa);


    const tdTitulo = document.createElement("td");

    tdTitulo.textContent = m.titulo || "";

    tr.appendChild(tdTitulo);

    const tdArtista = document.createElement("td");

    tdArtista.textContent = m.artista || "";

    tr.appendChild(tdArtista);


    const tdAcoes = document.createElement("td");


    const btnEditar = document.createElement("button");

    btnEditar.textContent = "✏️";

    btnEditar.onclick = () => editar(id);


    const btnExcluir = document.createElement("button");

    btnExcluir.textContent = "🗑️";

    btnExcluir.onclick = () => excluir(id);


    tdAcoes.append(
      btnEditar,
      btnExcluir
    );


    tr.appendChild(tdAcoes);


    tabela.appendChild(tr);

  });

});

function editar(id) {

  const m = cache[id];

  if (!m) {
    return;
  }


  editandoId = id;


  campo("titulo").value =
    m.titulo || "";


  campo("artista").value =
    m.artista || "";

  capaAtual =
    m.capaUrl || "";


  audioAtual =
    m.audioUrl || "";
  campo("capa").value = "";

  campo("audio").value = "";


  btnSalvar.textContent =
    "Salvar alterações";


  btnCancelar.hidden = false;


  statusUpload.textContent =
    "Editando música. Se quiser trocar a capa ou o áudio, selecione um novo arquivo.";

}

async function excluir(id) {

  if (!confirm("Excluir esta música?")) {
    return;
  }


  try {

    await remove(
      ref(db, `musicas/${id}`)
    );

  } catch (erro) {

    console.error(erro);

    alert(
      "Não foi possível excluir a música."
    );

  }

}


function resetarForm() {

  form.reset();

  editandoId = null;

  capaAtual = "";

  audioAtual = "";


  btnSalvar.textContent =
    "+ Adicionar música";


  btnCancelar.hidden = true;

}

btnCancelar.addEventListener(
  "click",
  () => {

    resetarForm();

    statusUpload.textContent = "";

  }
);