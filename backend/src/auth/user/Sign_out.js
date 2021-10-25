const express = require('express');
const router=express.Router();
const {con,redis_client}  = require ('../../config/Database_config.js');

// user send username,email,password we add them to database
router.delete('/sign_out',(req,res,next)=>{  
    const refresh_token=req.body.refresh_token  
    redis_client.lrem('refresh_token', 0, refresh_token, function(err, data){
        if(err) {
            return res.status(500).json({"error":error.message})
        }
        else{
            return res.status(200).json({"message":"user signed out"})
        }
    });
})

module.exports=router