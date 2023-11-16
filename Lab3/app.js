const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs')
require('dotenv').config();

const isEmail = (email) => {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email)
}

const isPassword = (password) => {
  return (password != "" && password.length > 5)
}

const products = [
  {
    id: "1",
    name: "Product1",
    price: 10,
    description: "",
    image: "",
  },
  {
    id: "2",
    name: "Product2",
    price: 20,
    description: "",
    image: "",
  },
  {
    id: "3",
    name: "Product3",
    price: 30,
    description: "",
    image: "",
  },
];

// const isLoggedIn = (username, password) => {
//   return username == process.env.USER_NAME && password == process.USER_PASSWORD
// }
let isLoggedIn = false;


const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true);

  if (req.url === "/") {
    if (isLoggedIn) {
      res.writeHead(200, { 'Content-type': 'text/html' });
      // fs.readFile('./home.html', null, (error, data) => {
      //   if (error) {
      //     res.writeHead(404);
      //     res.write('File not found!');
      //   } else {
      //     console.log(data.toString());
      //     res.write(data)
      //   }
      //   res.end();
      // })
      res.write(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
          <title>Document</title>
      </head>
      <body>
          <h1>Danh sách sản phẩm</h1>
          <a class="btn btn-success" href="/add">Thêm sản phẩm</a>
          <p>Chọn một sản phẩm cụ thể để xem chi tiết</p>
          <table class="table-light table-striped" cellpadding="10" cellspacing="10" border="0" style="border-collapse: collapse;">
              <tr class="header">
                  <td>STT</td>
                  <td>Tên sản phẩm</td>
                  <td>Giá</td>
                  <td>Thao tác</td>
              </tr>`);

      products.forEach((item) => {
        res.write(
          `<tr class="item">
                    <td>${item.id}</td>
                    <td><a style="color: black; text-decoration: none;" href="/${item.id}">${item.name}</a></td>
                    <td>$${item.price}</td>
                    <td><a href="/edit">Chỉnh sửa</a> | <a href="/delete">Xóa</a></td>
                </tr>`)
      }),
        res.write(`</table>
        </body>
        </html>`);
    } else {
      res.writeHead(301, { "Location": "http://localhost:3000/login" });
      res.end();
    }
  } else if (query.pathname == "/login") {
    if (req.method == 'GET') {
      res.writeHead(200, { 'Content-type': 'text/html' });
      fs.readFile('./login.html', null, (error, data) => {
        if (error) {
          res.writeHead(404);
          res.write('File not found!');
        } else {
          res.write(data)
        }
        res.end();
      })
    } else if (req.method == 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const params = qs.parse(body);
        const email = params.email;
        const password = params.password;
        if (process.env.USER_NAME == email && process.env.USER_PASSWORD) {
          isLoggedIn = true;
        }
        //console.log(process.env.USER_NAME , process.env.USER_PASSWORD);
        if (isEmail(email) && isPassword(password) && isLoggedIn) {
          res.writeHead(301, { "Location": "http://localhost:3000" });
          res.end();
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.write('Email or Password is invalid');
          return res.end();
        }
      });
    }
  } else if (req.url == '/:id') {
    req.params.id
    console.log(query.pathname);
    const idp = query.pathname
    const getProduct = products.find(({ id }) => id == idp)
    res.write(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
          <title>Document</title>
      </head>
      <body>
          <h1>Chi tiết sản phẩm</h1>
          <table class="table-light table-striped" cellpadding="10" cellspacing="10" border="0" style="border-collapse: collapse;">
              <tr class="header">
                  <td>STT</td>
                  <td>Tên sản phẩm</td>
                  <td>Giá</td>
                  <td>Hình Ảnh</td>
                  <td>Mô tả</td>
                  <td>Thao tác</td>
              </tr>
              <tr class="item">
                  <td>${getProduct.id}</td>
                  <td>${getProduct.name}</td>
                  <td>$${getProduct.price}</td>
                  <td><img src="${getProduct.img}" alt=""></td>
                  <td>${getProduct.description}</td>
                  <td><a href="/edit">Chỉnh sửa</a> | <a href="/delete">Xóa</a></td>
              </tr>
          </table>
      </body>
      </html>`);
  } else if (query.pathname == '/add') {
    if (req.method == 'GET') {
      res.writeHead(200, { 'Content-type': 'text/html' });
      fs.readFile('./add.html', null, (error, data) => {
        if (error) {
          res.writeHead(404);
          res.write('File not found!');
        } else {
          res.write(data)
        }
        res.end();
      })
    } else if (req.method == 'POST') {
        console.log("hhh");
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', () => {
          const params = qs.parse(body);
          const name_product = params.nameproduct;
          const price_product = params.priceproduct;
          const des_product = params.desproduct;

          products.push({
            id: products.length + 1,
            name: name_product,
            price: price_product,
            description: des_product,
            image: "",
          });
          res.writeHead(301, { "Location": "http://localhost:3000" });
          res.end();
        });
      }
  } else if (req.pathname == '/edit') {
    if (req.method == 'GET') {
      res.writeHead(200, { 'Content-type': 'text/html' });
      fs.readFile('./edit.html', null, (error, data) => {
        if (error) {
          res.writeHead(404);
          res.write('File not found!');
        } else {
          res.write(data)
        }
        res.end();
      })
    } else if (req.method == 'POST') {
       console.log("nhiều deadline quá em làm chưa xong ạ :((");
    }
  }
})

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
