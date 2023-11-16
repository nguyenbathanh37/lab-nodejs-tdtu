const {check} = require('express-validator')

module.exports = [
    check('name').exists().withMessage('Please Enter Username!')
        .notEmpty().withMessage('Username empty!')
        .isLength({ min: 6 }).withMessage('At Least 6 Characters'),

    check('email').exists().withMessage('Please Enter Email!')
        .notEmpty().withMessage('Email empty!')
        .isEmail().withMessage('Invalid Email'),

    check('password').exists().withMessage('Please Enter Password!')
        .notEmpty().withMessage('Password empty!')
        .isLength({ min: 6 }).withMessage('At Least 6 Characters')
]