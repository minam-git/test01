/**
 * 画面タッチでカラフルな線を描く
 * ------------------------------
 */
let drawing = false;
let last_x = null;
let last_y = null;
let last2_x = null;
let last2_y = null;
let hue = 0;
let hue2 = 0;
let flag1st = false;

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const clearCanvasButton = document.getElementById('clearCanvas');
const blackCanvasButton = document.getElementById('blackCanvas');

/**
 * キャンバスのサイズをウィンドウサイズに合わせて変更し、初期設定を行う
 */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
	
    ctx.font = '30px serif';
    ctx.fillText('Draw Rainbow Lines!', 20, 40);
    ctx.lineWidth = lineWidthInput.value;

    lineWidthValue.textContent = lineWidthInput.value;
}

/**
 * イベントからキャンバス上の座標を取得する
 * @param {Event} event - マウスやタッチのイベント
 * @returns {Object} - キャンバス上の座標 {x, y}
 */
function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const offsetX = rect.left;
    const offsetY = rect.top;
    const clientX = event.clientX || event.changedTouches[0].clientX;
    const clientY = event.clientY || event.changedTouches[0].clientY;

    return {
        x: (clientX - offsetX) * scaleX,
        y: (clientY - offsetY) * scaleY
    };
}

/**
 * 描画を開始する処理
 * @param {Event} event - マウスやタッチのイベント
 */
function drawStart(event) {
    event.preventDefault();
    drawing = true;
    flag1st = true;
    
    const { x, y } = getCanvasCoordinates(event);
    last_x = x;
    last_y = y;
    last2_x = x;
    last2_y = y;
}

/**
 * 線を描く処理
 * @param {Event} event - マウスやタッチのイベント
 */
function drawLine(event) {
    if (!drawing) return;

    const { x, y } = getCanvasCoordinates(event);

    hue = (hue + 8) % 360;
    hue2 = 360 - hue;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

    ctx.beginPath();
    if (flag1st) {
        ctx.moveTo(last_x, last_y);
        ctx.lineTo(x, y);
    } else {
        ctx.moveTo(last2_x, last2_y);
        ctx.quadraticCurveTo(last_x, last_y, x, y);
    }
    ctx.stroke();
    ctx.closePath();

    last2_x = last_x;
    last2_y = last_y;
    last_x = x;
    last_y = y;
    flag1st = false;
}

/**
 * 描画を終了する処理
 */
function drawFinish() {
    drawing = false;
    flag1st = false;
}

// 初期化処理
resize();
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
canvas.addEventListener('mousedown', drawStart, false);
canvas.addEventListener('touchstart', drawStart, false);
canvas.addEventListener('mousemove', drawLine, false);
canvas.addEventListener('touchmove', drawLine, false);
canvas.addEventListener('mouseup', drawFinish, false);
canvas.addEventListener('touchend', drawFinish, false);

// 線の太さが変更されたときのイベントリスナー
lineWidthInput.addEventListener('input', (event) => {
    ctx.lineWidth = event.target.value;
    lineWidthValue.textContent = event.target.value;
});

// キャンバスをクリアするボタンのイベントリスナー
clearCanvasButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// キャンバスを黒で塗りつぶすボタンのイベントリスナー
blackCanvasButton.addEventListener('click', () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
