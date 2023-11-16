const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Account = require('../models/AccountModel')

const registerValidator = require('./validators/registerValidator')
const loginValidator = require('./validators/loginValidator')

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        let {email, password} = req.body
        let account = undefined
        Account.findOne({email: email})
        .then(acc => {
            if (!acc) {
                throw new Error('email does not exist')
            }
            account = acc
            return bcrypt.compare(password, acc.password)
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                return res.status(401).json({code: 3, message: 'Login Fail: pass does not match'})
            }
            const {JWT_SECRET} = process.env
            jwt.sign({
                email: account.email,
                name: account.name         
            }, 'JWT_SECRET', {
                expiresIn: '1h'
            }, (err, token) => {
                if(err) throw new err
                return res.json({
                    code: 0,
                    message: 'Login Success',
                    token: token
                })
            })
        })
        .catch(e => {
            return res.status(401).json({code: 2, message: 'Login Fail: ' + e.message})
        })
    } else {
        let messages = result.mapped()
        let message = ''
        for (fields in messages) {
            message = messages[fields].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        const { name, email, password } = req.body
        Account.findOne({email: email})
        .then(acc => {
            if (acc) {
                throw new Error('email exist')
            }
        })
        .then(() => bcrypt.hash(password, 10))
        .then(hashed => {
            let user = new Account({
                name: name,
                email: email,
                password: hashed
            })
            return user.save()
        })
        .then(() => {
            return res.json({code: 0, message: 'Register Success'})
        }).catch(e => {
            return res.json({code: 2, message: 'Register Fail: ' + e.message})

        })
    } else {
        let messages = result.mapped()
        let message = ''
        for (fields in messages) {
            message = messages[fields].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

module.exports = Router