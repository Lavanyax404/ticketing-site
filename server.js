const http = require('http');
const fs = require('fs');
const path = require('path');

function serveFile(filePath, contentType, response) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (err, page404) => {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(page404, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end(`Server Error: ${err.code}`);
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

http.createServer((req, res) => {
    let urlPath = req.url;

    if (urlPath === '/' || urlPath === '/home') {
        urlPath = '/views/index.html';
    } else if (urlPath === '/events') {
        urlPath = '/views/events.html';
    } else if (urlPath === '/contact') {
        urlPath = '/views/contact.html';
    }

    const extname = path.extname(urlPath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    const filePath = path.join(__dirname, urlPath);
    serveFile(filePath, contentType, res);
}).listen(3001, () => {
    console.log('Server running on port 3001');
});
