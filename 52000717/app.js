const express = require("express");
const ejs = require("ejs");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const form = require('express-form');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

const token = 'Bearer 66faab55fa7f0a1b12ef0536ce2ea370cafd46a273deaf3817ed67f4401e1b2d';

// Áp dụng rate limit cho tất cả các yêu cầu
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Thời gian giới hạn (15 phút)
  max: 100 // Số lần yêu cầu tối đa trong thời gian giới hạn
});

app.use(limiter);

app.set("view engine", "ejs");

// Use middleware (static file)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//sử dụng middleware flash
app.use(flash());

//sử dụng middleware session
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Đưa middleware express-form vào trong ứng dụng
app.use(form());

app.get("/", async (req, res) => {
  const response = await fetch("https://gorest.co.in/public-api/users", {
    headers: {
      Authorization: token,
    },
  });
  const data = await response.json();
  const users = data.data;
  const messages = req.flash("success");
  if (messages.length > 0) {
    console.log(2);
    res.render("home", { users: users, messages: messages });
  } else {
    console.log(1);
    res.render("home", { users: users });
  }
});

//thêm người dùng
app.get("/add-users", (req, res) => {
  res.render("addUsers");
});

app.post("/add-users", async (req, res) => {

  if (!req.form.isValid) {
    res.status(400).send('Invalid form data');
    return;
  }
  
  const newUser = {
    name: req.body.name,
    gender: req.body.gender,
    email: req.body.email,
    status: req.body.status,
  };
  console.log(newUser);

  const response = await fetch("https://gorest.co.in/public-api/users", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const result = await response.json();
  console.log(result);
  if (result.code === 422 && result.data[0].message) {
    res.render("addUsers", { error: "Người dùng đã tồn tại" });
  } else {
    req.flash("success", "Thêm người dùng thành công");
    res.redirect("/");
  }
});

//xóa người dùng
  app.post(`/delete/:id`, async (req, res) => {
    const id = req.params.id;
    console.log(id.toString());
    const response = await fetch(`https://gorest.co.in/public-api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();
    if (result.code === 204) {
      req.flash("success", "Xóa người dùng thành công");
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Không tìm thấy người dùng" });
    }
  });

app.post("/updateUser", async (req, res) => {
  const id = req.body.id;
  const newUserInfo = {
    name: req.body.name,
    email: req.body.email,
    status: req.body.status,
  };

  const response = await fetch(`https://gorest.co.in/public-api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(newUserInfo),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const result = await response.json();
  console.log(result);
  if (result.code !== 200 && result.data.message) {
    res.status(404).json({ error: "Không tìm thấy người dùng" });
  } else {
    req.flash("success", "Chỉnh sửa người dùng thành công");
    res.redirect("/home");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://gorest.co.in/public-api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const result = await response.json();
  if (result.code === 200) {
    res.render("detailUser", { user: result.data });
  } else {
    res.status(404).json({ error: "Không tìm thấy người dùng" });
  }
});

app.use((req, res) => {
  res.status(404)
  res.render('error')
})


app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
});
