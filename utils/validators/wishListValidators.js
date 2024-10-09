const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const ProductModel = require('../../config/models/productModel')


exports.addProductTOWishListValidator= [

    check('productId')
    .notEmpty().withMessage('ProductId is required')
    .isMongoId().withMessage('Invalid ProductId ')
    .custom(async(val)=>{

        const product = await ProductModel.findById(val)

        if(!product){

            throw new Error(`There is no product belong to this id ${val}`)
        }
        return true
    })
    ,validatorMiddleWare
]

exports.RemoveProductFromWishListValidator= [

    check('productId')
    .notEmpty().withMessage('ProductId is required')
    .isMongoId().withMessage('Invalid ProductId ')
    
    ,validatorMiddleWare
]

