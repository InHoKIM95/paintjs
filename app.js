const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const save = document.getElementById("jsSave");

canvas.width = 700;
canvas.height = 700;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "black";
ctx.lineWidth = 15;

let painting = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function onMouseDown(event) {
    painting = true;
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    console.log("pensize : ", size);
    ctx.lineWidth = size;
}

function handleModeClick() {
    // ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick() {
    var dataURL = canvas.toDataURL();
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    //임시 보관용 배열생성
    var a1 = new Array(canvas.width * canvas.height);
    var a2 = new Array(4);

    var cnt = 0;
    var arrcnt = 0;

    for (var i = 0; i < data.length; i++) {
        
        if (i % 4 == 0) {
            a2[0] = data[i];
            cnt++;
        } else if (i % 4 == 1) {
            a2[1] = data[i];
            cnt++;
        } else if (i % 4 == 2) {
            a2[2] = data[i];
            cnt++;
        } else {
            a2[3] = data[i];
            cnt++;
        }
        if (cnt == 4) {
            a1[arrcnt] = a2;
            arrcnt++;
            cnt = 0;
            a2 = new Array(4);
        }
    }

    //RGB값 최종 보관용 배열 생성
    var rgbData = Array.from(Array(canvas.width), () => new Array(canvas.height));

    var count = 0;
    for (var i = 0; i < rgbData.length; i++) {
        for (var j = 0; j < rgbData[i].length; j++) {
            rgbData[i][j] = a1[count];
            count++;
        }
    }

    var xmin = canvas.width-1;
    var xmax = 0;
    var ymin = canvas.height-1;
    var ymax = 0;

    for (var i = 0; i < rgbData.length; i++) {
        for (var j = 0; j < rgbData[i].length; j++) {
            if(rgbData[i][j][0]!=255){
                if(j < xmin){
                    xmin = j;
                }
                if(j > xmax){
                    xmax = j;
                }
                if(i < ymin){
                    ymin = i;
                }
                if(i > ymax){
                    ymax = i;
                }
            }
        }
    }
    console.log(xmin,xmax,ymin,ymax);

    CropImage(xmin,xmax,ymin,ymax);

    // a태그 생성해서 다운로드 받는것
    // const link = document.createElement("a");
    // link.href = image;
    // link.download = "PaintJS!";
    // link.click();
}

function CropImage(xmin,xmax,ymin,ymax){
    var crop_canvas = document.getElementById("cropCanvas");
    crop_canvas.style.visibility = "visible";
    var width = (xmax+1)-xmin;
    var height = (ymax+1)-ymin;
    var crop_ctx = crop_canvas.getContext("2d");

    crop_ctx.drawImage(ctx,
        xmin, ymin,
        width, height,
        0, 0,
        width, height
    );
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach(color =>
    color.addEventListener("click", handleColorClick)
);


if (range) {
    range.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (save) {
    save.addEventListener("click", handleSaveClick);
}