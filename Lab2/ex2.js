const http = require('http');
const url = require('url');
const qs = require('querystring');

const isEmail = (email) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email)
}

const isPassword = (password) => {
    return (password != "" && password.length > 6)
}


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
        
            <style>
                #email,
                #password {
                    height: 25px;
                    width: 400px;
                    margin: 10px;
                    display: block;
                }
        
                button {
                    padding: 10px;
                    background-color: rgb(23, 121, 225);
                    color: white;
                    border: white;
                    border-radius: 5px;
                }
            </style>
        
        </head>
        <body>
            <h1>Đăng nhập</h1>
            <form action="/login" method="post">
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" placeholder="Enter email">
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" placeholder="Enter password">
                <button type="submit">Đăng nhập</button>
            </form>
        </body>
        </html>
        `);
        res.end();
    } else if (query.pathname == '/login') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const params = qs.parse(body);
                const email = params.email;
                const password = params.password;
                console.log(isEmail(email));
                console.log(isPassword(password));

                if(isEmail(email) && isPassword(password)){
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write('Login Success!');
                    return res.end();
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.write('Email or Password is invalid');
                    return res.end();
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.write('Not support for GET');
            return res.end();
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('Path is invalid');
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});