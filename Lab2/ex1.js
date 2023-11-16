const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true);
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        
        <body>
            <form action="/result">
                <div>
                    <label for="num1">Số hạng 1</label>
                    <input type="text" name="a" id="num1">
                </div>
                <div>
                    <label for="num2">Số hạng 2</label>
                    <input type="text" name="b" id="num2">
                </div>
                <div>
                    <label for="op">Phép tính</label>
                    <select name="op">
                        <option value="">Chọn phép tính</option>
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                    </select>
                </div>
                <button type="submit">Tính</button>
            </form>
        </body>
        
        </html>
        `);
        res.end();
    } else if (query.pathname == '/result') {
        if (!query.query.a || !query.query.b || !query.query.op) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.write('Ban chua chon phep toan');
            return res.end();
        }
        const a = parseFloat(query.query.a); 
        const b = parseFloat(query.query.b);
        const op = query.query.op
        let result;
        switch(op){
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                result = a / b;
                break;   
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`${a} ${op} ${b} = ${result}`);
        return res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('Duong dan khong hop le');
        return res.end();
    }
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });