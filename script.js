const buttons = document.querySelectorAll(".music-item");
const statusText = document.getElementById("status");

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;
let currentBuffer = null;
let currentUrl = null;

async function loadAndPlay(url, name) {
  //AudioContextを有効化
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  //同じ曲なら停止
  if (currentUrl === url) {
    stopAudio();
    statusText.textContent = "【曲名を選択して再生】";
    currentUrl = null;
    return;
  }

  stopAudio();

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true; //ギャップ無しループ
  source.connect(audioContext.destination);
  source.start(0);

  currentSource = source;
  currentBuffer = audioBuffer;
  currentUrl = url;

  statusText.textContent = "再生中: " + name;
}

function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
    currentSource.disconnect();
    currentSource = null;
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const url = btn.dataset.src;
    const name = btn.textContent;
    loadAndPlay(url, name);
  });
});
