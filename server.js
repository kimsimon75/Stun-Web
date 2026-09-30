const http = require('node:http');
const { createReadStream, stat } = require('node:fs');
const { extname, join, normalize } = require('node:path');

const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.md': 'text/markdown; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
};

const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = normalize(join(__dirname, relative));
    if (!file.startsWith(__dirname)) { response.writeHead(403).end(); return; }
    stat(file, (error, info) => {
        if (error || !info.isFile()) { response.writeHead(404).end('Not found'); return; }
        response.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
        createReadStream(file).pipe(response);
    });
});

const PORT = Number(process.env.PORT) || 8080;
server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
        console.error(`${PORT} 포트를 다른 프로그램이 사용 중입니다. 기존 서버를 종료하거나 PORT=8081로 실행하세요.`);
        process.exitCode = 1;
        return;
    }
    throw error;
});
server.listen(PORT, () => console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`));
