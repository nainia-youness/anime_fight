const express = require('express');
const router=express.Router();
const sign_up_route=require('./user/Sign_up.js')
const sign_in_route=require('./user/Sign_in.js')
const sign_out_route=require('./user/Sign_out.js')
const token_route=require('./user/Token.js')

base_route='/user'
router.use(base_route,sign_up_route)
router.use(base_route,sign_in_route)
router.use(base_route,token_route)
router.use(base_route,sign_out_route)



module.exports=router