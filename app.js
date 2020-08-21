const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const save = document.getElementById("jsSave");

canvas.width = 700;
canvas.height = 700;

ctx.fillStyle = "white";
ctx.fillRect(0,0, canvas.width, canvas.height);
ctx.strokeStyle = "#2c2c2c";
ctx.lineWidth = 15;

let painting = false;

function stopPainting(){
    painting = false;
}

function startPainting(){
    painting = true;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x,y);
    } else {
        ctx.lineTo(x,y);
        ctx.stroke();
    }
}

function onMouseDown(event){
    painting = true;
}

function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
}

function handleRangeChange(event){
    const size = event.target.value;
    console.log(size);
    ctx.lineWidth = size;
}

function handleModeClick(){
    // ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.width, canvas.height);
}

function handleCM(event){
    event.preventDefault();
}

function handleSaveClick(){
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS!";
    link.click();
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach(color => 
    color.addEventListener("click", handleColorClick)
);


if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode){
    mode.addEventListener("click", handleModeClick);
}

if(save){
    save.addEventListener("click", handleSaveClick);
}