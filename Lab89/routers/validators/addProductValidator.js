const {check} = require('express-validator')

module.exports = [
    check('name').exists().withMessage('Please Enter Name!')
        .notEmpty().withMessage('name empty!'),

    check('price').exists().withMessage('Please Enter Price!')
        .notEmpty().withMessage('Price empty!')
        .isNumeric().withMessage('Price Invalid'),

    check('desc').exists().withMessage('Please Enter Description!')
        .notEmpty().withMessage('Description empty!')
]