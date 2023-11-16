require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const AccountRouter = require('./routers/AccountRouter')
const OrderRouter = require('./routers/OrderRouter')
const ProductRouter = require('./routers/ProductRouter')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Welcome to Rest API'
    })
})

app.use('/account', AccountRouter)
app.use('/orders', OrderRouter)
app.use('/products', ProductRouter)

const port = process.env.PORT || 3000

mongoose.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    app.listen(port || 3000, () => {
        console.log(`http://localhost:${port}`)
    })
})
.catch(e => console.log('Cant not connect mongodb: ' + e.message))