const express = require('express');
const router=express.Router();
const like_route=require('./fights/Like.js')
const vote_route=require('./fights/Vote.js')
const comment_route=require('./fights/Comment.js')


base_route='/fights'
router.use(base_route,like_route)
router.use(base_route,vote_route)
router.use(base_route,comment_route)

module.exports=router



