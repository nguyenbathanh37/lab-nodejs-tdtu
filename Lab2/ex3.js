const http = require('http');
const url = require('url');

const students = [
    {id: 1, name: 'Student 1', email: 'email1@student.com'},
    {id: 2, name: 'Student 2', email: 'email2@student.com'},
    {id: 3, name: 'Student 3', email: 'email3@student.com'},
    {id: 4, name: 'Student 4', email: 'email4@student.com'},
    {id: 5, name: 'Student 5', email: 'email5@student.com'},
    {id: 6, name: 'Student 6', email: 'email6@student.com'},
    {id: 7, name: 'Student 7', email: 'email7@student.com'},
    {id: 8, name: 'Student 8', email: 'email8@student.com'},
    {id: 9, name: 'Student 9', email: 'email9@student.com'},
    {id: 10, name: 'Student 10', email: 'email10@student.com'},
    {id: 11, name: 'Student 11', email: 'email11@student.com'},
]

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true);

    if (query.pathname == '/students') {
        if(req.method == 'GET'){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(students));
        } else if(req.method == 'POST'){
            let body = '';
            req.on('data', chunk =>{
                body += chunk.toString();
            });
            req.on('end', () => {
                students.push(JSON.parse(body));
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 201;
                res.end(JSON.stringify(students));
            })
        } else {
            res.statusCode = 400;
            res.end();
        }
    } else if (query.pathname.startsWith('/students/')){
        const id = parseInt(query.pathname.split('/')[2]);
        const student = students.find(s => s.id === id);
        const studentIndex = students.findIndex(s => s.id === id);
        if(!student){
            res.statusCode = 404;
            res.end();
        }

        if(req.method == 'GET'){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(student));
        } else if (req.method == 'PUT'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                students[studentIndex] = JSON.parse(body);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(students));
            });
        } else if (req.method == 'DELETE'){
            students.splice(studentIndex, 1);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(students))
        } else {
            res.statusCode = 400;
            res.end();
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Endpoint Error'}));
    }
})

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});