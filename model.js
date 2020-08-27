var http = require('http');
var util = require('util')

const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
var express = require('express')
//var async = require('async');

var http = require('http');
var fs = require('fs');
var url = require('url');

const getPixels = require('get-pixels');
const { setTimeout } = require('timers');
const src = `./data/test3.png`;

var arr = new Array();


async function loadModel() {
    const handler = tfn.io.fileSystem("./model/tfjs_model/model.json");
    const model = await tf.loadLayersModel(handler);
    return model;
}

function predict(model, callback) {
    return new Promise(function (resolve, reject) {
        var predictNumber;
        model.then(function (res) {
            const prediction = res.predict(tf.tensor(arr, [1, 28, 28, 1], "float32"));
            predictNumber = prediction.flatten().argMax().dataSync()[0];
            
            console.log("======Image Array======");
            console.log(arr)
            console.log("======Predict classes======")
            prediction.print();

        }).then(function (res) {
            callback();
            resolve(predictNumber);
        });
    })

}

function run(callback) {
    var model = loadModel();
    var predictNumber = predict(model, function () {
        callback();
    });
    return predictNumber;
}

const server = http.createServer(async function (req, res) {
    var predictNumber = -1; 
    console.log('Request received: ');

    let body = [];

    await req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        const input = JSON.parse(body);
        arr = input.data;
    });
    await run(function () {
        console.log("Running...");
    }).then(function(res){
        console.log("Predict Number "+res);
        predictNumber = res;
    });

    await res.setHeader('Content-Type', 'application/json');
    await res.setHeader('Access-Control-Allow-Origin', '*');
    await res.end(JSON.stringify({ "predictNumber": `${predictNumber}` })); // removed the 'callback' stuff

    

});

server.listen(3000, function () {
    console.log('Server running on port 3000');
});
