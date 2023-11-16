const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')

const Product = require('../models/ProductModel')

const addProductValidator = require('./validators/addProductValidator')

Router.get('/', (req, res) => {
    Product.find().select('name price desc -_id')
    .then(products => {
        res.json({
            code:0,
            message: 'get all product success',
            data: products
        })
    })
})

Router.post('/', addProductValidator, (res, req) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {name, price, desc} = req.body
        let product = new Product({
            name, price, desc
        })

        product.save()
        .then(() => {
            return res.json({code: 0, message: 'add product success', data: product})
        })
        .catch(e => {
            return res.json({code: 2, message: e.message})
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