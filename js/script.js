const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
let contex = canvas.getContext("2d");
let selectedColor = "#000";
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let previousMouseX, previousMouseY, snapshot;
const setCanvasBackground = () => {
  contex.fillStyle = "#fff";
  contex.fillRect(0, 0, canvas.width, canvas.height);
  contex.fillStyle = selectedColor;
};
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});
const startDraw = (e) => {
  isDrawing = true;
  previousMouseX = e.offsetX;
  previousMouseY = e.offsetY;
  contex.beginPath();
  contex.lineWidth = brushWidth;
  snapshot = contex.getImageData(0, 0, canvas.width, canvas.height);
  contex.strokeStyle = selectedColor;
  contex.fillStyle = selectedColor;
};
const drawRectangle = (e) => {
  if (!isDrawing) return;
  fillColor.checked
    ? contex.fillRect(
        e.offsetX,
        e.offsetY,
        previousMouseX - e.offsetX,
        previousMouseY - e.offsetY
      )
    : contex.strokeRect(
        e.offsetX,
        e.offsetY,
        previousMouseX - e.offsetX,
        previousMouseY - e.offsetY
      );
};
const drawCircle = (e) => {
  contex.beginPath();
  const radius = Math.sqrt(
    Math.pow(previousMouseX - e.offsetX, 2) +
      Math.pow(previousMouseY - e.offsetY, 2)
  );
  contex.arc(previousMouseX, previousMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? contex.fill() : contex.stroke();
};
const drawTriangle = (e) => {
  contex.beginPath();
  contex.moveTo(previousMouseX, previousMouseY);
  contex.lineTo(e.offsetX, e.offsetY);
  contex.lineTo(previousMouseX * 2 - e.offsetX, e.offsetY);
  contex.closePath();
  fillColor.checked ? contex.fill() : contex.stroke();
};
const drawing = (e) => {
  if (!isDrawing) return;
  contex.putImageData(snapshot, 0, 0);

  switch (selectedTool) {
    case "brush":
      contex.lineTo(e.offsetX, e.offsetY);
      contex.stroke();
      break;
    case "rectangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      contex.strokeStyle = "#fff";
      contex.lineTo(e.offsetX, e.offsetY);
      contex.stroke();
      break;
    default:
      break;
  }
};
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");

    selectedColor = bgColor;
    contex.strokeStyle = btn.classList[0];
    contex.fillStyle = btn.classList[0];
  });
});
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click", () => {
  contex.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});
saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `Canva-Paint-${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", drawing);
