// server.js

// Node.js에 기본 내장되어 있는 http 모듈을 로드한다.canvas
const http = require("http");

// http 모듈의 createServer 메소드를 호출하여 HTTP 서버 생성
const server = http.createServer(function(request, response){
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Controll-Allow-Origib', '*');
    response.end(JSON.stringify({
        platform : process.platform,
        nodeVersion : process.version,
        uptime : Math.round(process.uptime())
    }));
});

const port = 8090;
server.listen(port,function(){
    console.log('Ajax server started on port ${port}');
});