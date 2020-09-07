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
ctx.lineWidth = 35;

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

//분석 버튼 클릭시 function
function handleSaveClick() {
    function predict(callback) {
        return new Promise(function (resolve, reject) {
            var dataURL = canvas.toDataURL();
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;

            //임시 보관용 배열생성
            var rgbData = createArrayData(canvas.width, canvas.height, data);

            var xmin = canvas.width - 1;
            var xmax = 0;
            var ymin = canvas.height - 1;
            var ymax = 0;

            var no_image = 1;
            for (var i = 0; i < rgbData.length; i++) {
                for (var j = 0; j < rgbData[i].length; j++) {
                    if (rgbData[i][j][0] != 255) {
                        if (j < xmin) {
                            xmin = j;
                        }
                        if (j > xmax) {
                            xmax = j;
                        }
                        if (i < ymin) {
                            ymin = i;
                        }
                        if (i > ymax) {
                            ymax = i;
                        }
                        no_image = 0;
                    }
                }
            }
            console.log("canvas x,y 최소 최대좌표 : ", xmin, xmax, ymin, ymax);

            var result_p_tag = document.getElementById("result_p");
            var input_array = new Array(28 * 28);

            if (no_image == 0) {
                var result_rgbData = CropImage(xmin, xmax, ymin, ymax);
                for (var i = 0; i < result_rgbData.length; i++) {
                    for (var j = 0; j < result_rgbData[i].length; j++) {
                        if (result_rgbData[i][j][0] == 255 && result_rgbData[i][j][1] == 255 && result_rgbData[i][j][2] == 255) {
                            input_array[28 * i + j] = 0;
                        } else {
                            input_array[28 * i + j] = 1;
                        }
                    }
                }

                // for (var i = 0; i < 28; i++) {
                //     for (var j = 0; j < 28; j++) {
                //         input_array[28 * i + j] = parseFloat(result_rgbData[i][j][0])/255.0;
                //     }
                // }
                console.log(input_array);

                console.log("result_rgbData : ", result_rgbData);
                $(document).ready(function () {
                    $.ajax({
                        url: 'http://localhost:3000',
                        data: `{"data":[${input_array}]}`,
                        type: 'POST',
                        dataType: "JSON",
                        jsonpCallback: 'callback',
                        success: function (data) {
                            var ret = data;
                            var predict_number = ret.predictNumber;
                            console.log('Success: ')
                            console.log(`${ret.predictNumber}입니다.`);
                            $('#resultNumber').text('결과는 '+ret.predictNumber+' 입니다.');
                            resolve(ret.predictNumber);
                        },
                        error: function (xhr, status, error) {
                            console.log('Error: ' + error.message);
                            reject();
                        },
                    });
                });
            }
        });
    }
    predict().then(function(tableData){
        console.log(tableData);
    })
}



//arrray형태로 rgb값을 x,y 좌표별 만드는 function
function createArrayData(width, height, data) {
    var a1 = new Array(width * height);
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

    var rgbData = Array.from(Array(width), () => new Array(height));

    var count = 0;
    for (var i = 0; i < rgbData.length; i++) {
        for (var j = 0; j < rgbData[i].length; j++) {
            rgbData[i][j] = a1[count];
            count++;
        }
    }

    return rgbData;
}

//rgb data에 따라 이미지를 잘라서 캔버스에 넣는 function
function CropImage(xmin, xmax, ymin, ymax) {
    var crop_canvas = document.getElementById("cropCanvas");
    var crop_ctx = crop_canvas.getContext("2d");
    var width = (xmax + 1) - xmin;
    var height = (ymax + 1) - ymin;

    var crop_width = 18;
    var crop_height = 20;

    crop_canvas.width = crop_width;
    crop_canvas.height = crop_height;

    console.log("crop_cavas left, top, width, height : ", xmin, ymin, width, height);

    crop_ctx.drawImage(canvas,
        xmin, ymin,
        width, height,
        0, 0,
        crop_width, crop_height
    );

    var result_canvas = document.getElementById("resultCanvas");
    var result_ctx = result_canvas.getContext("2d");

    var result_width = 28;
    var result_height = 28;

    result_canvas.width = result_width;
    result_canvas.height = result_height;
    result_ctx.fillStyle = "white";
    result_ctx.fillRect(0, 0, result_width, result_height);

    result_ctx.drawImage(crop_canvas,
        0, 0,
        crop_width, crop_height,
        5, 4,
        crop_width, crop_height);

    var result_imgData = result_ctx.getImageData(0, 0, result_width, result_height);
    var result_data = result_imgData.data;
    var result_rgbData = createArrayData(result_width, result_height, result_data);

    return result_rgbData;
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