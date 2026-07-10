const buttons = document.querySelectorAll(".music-item, .music-item-2");

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;
let currentBuffer = null;
let currentUrl = null;
let currentStatusText = null; //現在再生中の曲に対応するstatus要素

//ボタンが属する.plstGame内の.status要素を取得
function getStatusTextFor(btn) {
  const container = btn.closest(".plstGame");
  return container ? container.querySelector(".status") : null;
}

async function loadAndPlay(url, name, statusText) {
  //AudioContextを有効化
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  //同じ曲なら停止
  if (currentUrl === url) {
    stopAudio();
    if (currentStatusText) {
      currentStatusText.textContent = "【曲名を選択して再生】";
    }
    currentUrl = null;
    currentStatusText = null;
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
  currentStatusText = statusText;

  if (statusText) {
    statusText.textContent = "再生中: " + name;
  }
}

function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
    currentSource.disconnect();
    currentSource = null;
  }
  //停止時、直前に再生していたstatus表示をリセット
  if (currentStatusText) {
    currentStatusText.textContent = "【曲名を選択して再生】";
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const url = btn.dataset.src;
    const name = btn.textContent;
    const statusText = getStatusTextFor(btn);
    loadAndPlay(url, name, statusText);
  });
});
