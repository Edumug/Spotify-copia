const progresso = document.getElementById("progresso");
const progressoc = document.getElementById("progressoc")
const musica = new Audio();
const btnmusica = document.querySelectorAll(".musica");
const play = document.getElementById("play")

play.addEventListener('click', () => {
  if (musica.paused) {
    musica.play();
    play.textContent = '⏸';
  } else {
    musica.pause();
    play.textContent = '▶';
  }
});


btnmusica.forEach(botao => botao.onclick = function(){
  play.textContent = '⏸';
  const data = this.getAttribute("data-src")
  musica.src = data;

  document.getElementById("teste").innerHTML = `Tocando: ${this.textContent}`;
  musica.play()
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