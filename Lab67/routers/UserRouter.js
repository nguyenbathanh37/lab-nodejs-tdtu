const express = require("express")
const { check, validationResult } = require('express-validator')
const db = require('../database')
const bcrypt = require('bcrypt')
const fs = require('fs')

const router = express.Router()

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }

    const error = req.flash('error') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''
    res.render('login', { error, email, password })
})

const loginValidator = [
    check('email').exists().withMessage('Please Enter Email!')
        .notEmpty().withMessage('Email empty!')
        .isEmail().withMessage('Invalid Email'),

    check('password').exists().withMessage('Please Enter Password!')
        .notEmpty().withMessage('Password empty!')
        .isLength({ min: 6 }).withMessage('At Least 6 Characters')
]

router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const { email, password } = req.body
        const sql = 'select * from account where email = ?'
        const params = [email]
        db.query(sql, params, (err, result, fields) => {
            if (err) {
                req.flash('error', err.message)
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/user/login')
            } else if (result.length === 0) {
                req.flash('error', 'Email does not exist!')
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/user/login')
            } else {
                const hashed = result[0].password
                const match = bcrypt.compareSync(password, hashed)
                if (match) {
                    //delete result[0].password
                    let user = result[0]
                    user.userRoot = `${req.vars.root}/users/${user.email}`
                    req.session.user = user
                    req.app.use(express.static(user.userRoot))
                    res.redirect('/')
                } else {
                    req.flash('error', 'Wrong Email or Password!')
                    req.flash('email', email)
                    req.flash('password', password)
                    return res.redirect('/user/login')
                }
            }
        })
    } else {
        result = result.mapped()
        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }

        const { email, password } = req.body

        req.flash('error', message)
        req.flash('email', email)
        req.flash('password', password)
        res.redirect('/user/login')
    }
})

router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }

    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    res.render('register', { error, name, email })
})

const resValidator = [
    check('name').exists().withMessage('Please Enter Username!')
        .notEmpty().withMessage('Username empty!')
        .isLength({ min: 6 }).withMessage('At Least 6 Characters'),

    check('email').exists().withMessage('Please Enter Email!')
        .notEmpty().withMessage('Email empty!')
        .isEmail().withMessage('Invalid Email'),

    check('password').exists().withMessage('Please Enter Password!')
        .notEmpty().withMessage('Password empty!')
        .isLength({ min: 6 }).withMessage('At Least 6 Characters'),

    check('confirm-password').exists().withMessage('Please Enter Password!')
        .notEmpty().withMessage('Password empty!')
        .isLength({ min: 6 }).withMessage('At Least 6 Characters')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password not match')
            }
            return true;
        })
]

router.post('/register', resValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        const { name, email, password } = req.body
        const hashed = bcrypt.hashSync(password, 10)

        const sql = 'insert into account(name, email, password) value (?,?,?)'
        const params = [name, email, hashed]

        db.query(sql, params, (err, result, fields) => {
            if (err) {
                req.flash('error', err.message)
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/user/register')
            } else if (result.affectedRows === 1) {
                const {root} = req.vars
                const userDir = root + '/users/' + email
                console.log(userDir);

                fs.mkdir(userDir, { recursive: true }, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                })
                return res.redirect('/user/login')
            }
            req.flash('error', 'Register Fail!')
            req.flash('name', name)
            req.flash('email', email)
            return res.redirect('/user/register')
        })
    } else {
        result = result.mapped()
        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }

        const { name, email } = req.body

        req.flash('error', message)
        req.flash('name', name)
        req.flash('email', email)
        res.redirect('/user/register')
    }

})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/user/login')
})

module.exports = router