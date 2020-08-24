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
ctx.strokeStyle = "black";
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
    console.log("pensize : ",size);
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
    const dataURL = canvas.toDataURL();

    var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);


    var data = imgData.data;
    console.log(data);
    
    var rgbData = new Array();
    var rgb = new Array();
    var cnt = 1;
    for(var i = 0 ; i < data.length ; i++){
        if(i%4==0){
            rgb[0] = data[i];
        }else if(i%4==1){
            rgb[1] = data[i];
            cnt++;
        }else if(i%4==2){
            rgb[2] = data[i];
            cnt++;
        }else{
            rgb[3] = data[i];
            cnt++;
        }
        if(cnt==4){
            rgbData.push(rgb);
            cnt = 1;
        }
    }
    console.log(rgbData);



    // var imgData = ctx.getImageData(0,0,canvas.width, canvas.height);
    // console.log(imgData);
    // ctx.putImageData(imgData,10,70);

    // $.ajax({
    //     type:'post',
    //     url:'image.php',
    //     data: {'imgBase64' : dataURL},
    //     success: function(){
    //         console.log('성공');
    //     },
    //     error: function(){
    //         alert('실패');
    //     }
    // });


    // a태그 생성해서 다운로드 받는것
    // const link = document.createElement("a");
    // link.href = image;
    // link.download = "PaintJS!";
    // link.click();
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