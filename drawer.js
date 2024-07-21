
/**
 * 画面タッチでカラフルな線を描く
 * ------------------------------
 */
var drawing = false
var last_x = null
var last_y = null
var last2_x = null
var last2_y = null
var hue = 0
var hue2 = 0;
var canvas = document.getElementById('stage')
var ctx = canvas.getContext('2d')
var lineWidthInput = document.getElementById('lineWidth');
var lineWidthValue = document.getElementById('lineWidthValue');
var clearCanvasButton = document.getElementById('clearCanvas');
var blackCanvasButton = document.getElementById('blackCanvas');

canvas.width = canvas.offsetWidth;		/* この初期化をしないとスマホではClearButtonでクリアされない */
canvas.height = canvas.offsetHeight;

function resize() {
	canvas.setAttribute('width', window.innerWidth*2)
	canvas.setAttribute('height', window.innerHeight*2)
	ctx.font = '30px serif'
	ctx.fillText('Rainbow Draw', 20, 40)
	ctx.lineWidth = lineWidthInput.value;
	ctx.scale(2, 2)
	    // 初期の線の太さを表示
    lineWidthValue.textContent = lineWidthInput.value;
}

resize()
window.addEventListener('resize', resize)
window.addEventListener('orientationchange', resize)
canvas.addEventListener('mousedown', drawStart, false)
canvas.addEventListener('touchstart', drawStart, false)

// 線の太さが変更されたときのイベントリスナー
lineWidthInput.addEventListener('input', (event) => {
    ctx.lineWidth = event.target.value;
    lineWidthValue.textContent = event.target.value;
});


// キャンバスをクリアするボタンのイベントリスナー
clearCanvasButton.addEventListener('click', (event) => {
//    ctx.fillStyle = 'black'; // 塗りつぶしの色を黒に設定
//    ctx.fillRect(0, 0, canvas.width, canvas.height); // キャンバス全体を黒で塗りつぶす
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

blackCanvasButton.addEventListener('click', (event) => {
    ctx.fillStyle = 'black'; // 塗りつぶしの色を黒に設定
    ctx.fillRect(0, 0, canvas.width, canvas.height); // キャンバス全体を黒で塗りつぶす
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



function drawStart(event) {
	event.preventDefault()
	drawing = true
	last_x = event.pageX
	last_y = event.pageY
	last2_x = last_x
	last2_y = last_y
}
canvas.addEventListener('mousemove', drawLine, false)
canvas.addEventListener('touchmove', drawLine, false)

function drawLine(event) {
	if(!drawing) return
	if(event.type==='touchmove') event = event.changedTouches[0]

    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;

    // 色相を1度ずつ増やし、360度を超えたら0に戻す
    hue = ((hue + 8) % 360);
    hue2 = 360 - hue;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

    // 中間点を計算して滑らかな線を描く
    const midX = (last_x + x) / 2;
    const midY = (last_y + y) / 2;

    ctx.beginPath();
    ctx.moveTo(last2_x, last2_y);
    ctx.quadraticCurveTo(last_x, last_y, x, y);
    ctx.stroke();
    ctx.closePath();

	last2_x = last_x;
	last2_y = last_y;
    last_x = x;
    last_y = y;
}

canvas.addEventListener('mouseup', drawFinish, false)
canvas.addEventListener('touchend', drawFinish, false)
function drawFinish() {
	drawing = false
}
