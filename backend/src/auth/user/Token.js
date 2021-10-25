const express = require('express');
const router=express.Router();
const {redis_client}  = require ('../../config/Database_config.js');
const jwt=require('jsonwebtoken')
const {generate_access_token}  = require ('../auth_service.js');

router.post('/token', (req, res) => {
    
    const refresh_token=req.body.refresh_token
    if(refresh_token==null) return res.status(401).json({"error":"refresh token is not sent"})
    //check if the refresh token is in the database, if it doens t exist res.sendStatus(403)
    redis_client.lrange('refresh_token', 0, -1, (err, items) => {
        if (err) return res.status(500).json({"error":err.message})
        else{
            let is_token_exist=false
            items.forEach((item, i) => {
                if(item==refresh_token)
                    is_token_exist=true
            })
            if(!is_token_exist)
                return res.status(403).json({"error":"refresh token not valid"})
            else{
                jwt.verify(refresh_token,process.env.SECRET_REFRESH_TOKEN_KEY,(err,user)=>{
                    if (err) return  res.status(403).json({"error":err.message})
                    const access_token=generate_access_token({"name":user.username,"user_id":user.user_id})//create a new object
                    res.status(200).json({"access_token":access_token})
                })
            }
        }
       })
})

module.exports=router
