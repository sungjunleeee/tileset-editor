const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraseBtn = document.getElementById("erase-btn");
const saveBtn = document.getElementById("save-btn");
const gridBtn = document.getElementById("grid-btn");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.getElementById("canvas");
const grid = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const g_ctx = grid.getContext("2d");

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
grid.width = CANVAS_WIDTH;
grid.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth;
let isPainting = false;
let isFilling = false;
let isErasing = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(event) {
  isPainting = true;
}

function stopPainting(event) {
  isPainting = false;
}
function cancelPainting(event) {
  isPainting = false;
  ctx.beginPath();
}
function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
  this.nextElementSibling.value = this.value;
}
function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}
function onModeClick() {
  ctx.globalCompositeOperation = "source-over";
  if (isErasing) {
    isErasing = false;
    ctx.fillStyle = color.value;
  } else if (isFilling) {
    isFilling = false;
    ctx.fillStyle = color.value;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    ctx.strokeStyle = color.value;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.globalCompositeOperation = "destination-out";
  isErasing = true;
  isFilling = false;
  modeBtn.innerText = "Draw";
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.png";
  a.click();
}

function showGrid() {
  if (grid.style.cssText != "display: none;") {
    grid.style = "display: none;";
  } else {
    grid.style = "position: absolute; left: 0; top: 0; z-index: 1";
  }
}

function drawGrid() {
  g_ctx.strokeStyle = "black";
  g_ctx.lineWidth = 1;
  for (let i = 0; i < Math.floor(CANVAS_WIDTH / 32); i++) {
    g_ctx.moveTo(i * 32, 0);
    g_ctx.lineTo(i * 32, CANVAS_HEIGHT);
    g_ctx.stroke();
  }
  for (let i = 0; i < Math.floor(CANVAS_HEIGHT / 32); i++) {
    g_ctx.moveTo(0, i * 32);
    g_ctx.lineTo(CANVAS_WIDTH, i * 32);
    g_ctx.stroke();
  }
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("input", onLineWidthChange);
color.addEventListener("input", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraserClick);
saveBtn.addEventListener("click", onSaveClick);
gridBtn.addEventListener("click", showGrid);
drawGrid();
