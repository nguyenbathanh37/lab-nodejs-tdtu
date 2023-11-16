require('dotenv').config()
const express = require("express")
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const multer = require('multer')

const fileReader = require('./fileReader')
const UserRouter = require('./routers/UserRouter')

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('thanh'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())

app.use((req, res, next) => {
  req.vars = {root: __dirname}
  next()
})

app.use('/user', UserRouter)

const getCurrentDir = (req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  const {userRoot} = req.session.user
  let {dir} = req.query
  if(dir === undefined){
    dir = ''
  }
  let currentDir = `${userRoot}/${dir}`
  if(!fs.existsSync(currentDir)){
    currentDir = userRoot
  }
  req.vars.currentDir = currentDir
  req.vars.userRoot = userRoot
  next()
}

app.get('/', getCurrentDir, (req, res) => {
  if(!req.session.user){
    return res.redirect('/user/login')
  }

  let {userRoot, currentDir} = req.vars

  fileReader.load(userRoot, currentDir)
  .then(files => {
    const user = req.session.user
    res.render('index', {user, files})
  })
})

const uploader = multer({dest: __dirname + '/uploads'})

app.post('/upload', uploader.single('attachment'), (req, res) => {
  const {email, path} = req.body
  const file = req.file

  if(!email || !path || !file){
    return res.json({code: 1, message: 'Thông tin không hợp lệ'})
  }

  const {root} = req.vars
  const currentPath = `${root}/users/${email}/${path}`

  if(!fs.existsSync(currentPath)) {
    return res.json({code: 2, message: 'Đường dẫn cần lưu không tồn tại'})
  }

  let name = file.originalname
  let newPath = currentPath + '/' + name
  fs.renameSync(file.path, newPath)

  return res.json({code: 0, message: 'Upload thành công' + newPath})
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`http://localhost:${port}`))