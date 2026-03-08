const audio = document.getElementById("myAudio");
const sndBtn = document.getElementById("sndBtn");
const statusText = document.getElementById("status"); // 追加
const buttons = document.querySelectorAll(".music-item"); // getElementByIdから変更

let currentSrc = "";

// メインボタン（いらっしゃいませ）の処理
sndBtn.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    sndBtn.textContent = "♪";
  } else {
    audio.pause();
    sndBtn.textContent = "▶";
  }
});

// プレイリストボタンの処理
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedSrc = button.getAttribute("data-src");

    if (currentSrc === selectedSrc) {
      if (audio.paused) {
        audio.play();
        statusText.textContent = button.textContent.trim() + " を再生中";
      } else {
        audio.pause();
        statusText.textContent = "停";
      }
    } else {
      audio.src = selectedSrc;
      audio.play();
      currentSrc = selectedSrc;
      statusText.textContent = button.textContent.trim() + " を再生中";
      // メインボタンの方も一応リセットしておくと親切
      sndBtn.textContent = "（いらっしゃいませ）";
    }
  });
});
