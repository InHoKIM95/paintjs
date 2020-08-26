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
const src = `./data/test3.png`;

var arr = new Array();
var predictNumber = -1


async function loadModel() {
    const handler = tfn.io.fileSystem("./model/tfjs_model/model.json");
    const model = await tf.loadLayersModel(handler);
    return model;
}

function predict(model, callback) {
    var num = 0;
    model.then(function (res) {
        const prediction = res.predict(tf.tensor(arr, [1, 28, 28, 1]));

        //prediction.print();
        //prediction.flatten().argMax().print();
        num = prediction.flatten().argMax().dataSync()[0];
        predictNumber = num;

    });

    callback(num);

}

function run(callback) {
    var model = loadModel();
    predict(model, function (number) {
        callback();
    });
}

const server = http.createServer(function (req, res) {

    console.log('Request received: ');

    let body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        const input = JSON.parse(body);
        arr = input.data;
        console.log(arr);
        run(function () {
            console.log("Running...");

        });
    });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    setTimeout(function () {
        res.end(JSON.stringify({ "msg": `${predictNumber}` })); // removed the 'callback' stuff
    }, 1000);

});

server.listen(3000, function () {
    console.log('Server running on port 3000');
});
