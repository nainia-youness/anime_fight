const express = require('express');
const router=express.Router();
const {con,redis_client}  = require ('../../config/Database_config.js');
const jwt=require('jsonwebtoken')
const {generate_access_token,validatePassword,validateEmail}  = require ('../auth_service.js');
const bcrypt = require('bcrypt')


// user send username,email,password we add them to database
router.post('/sign_in',(req,res,next)=>{    

    if(!req.body.password || !req.body.email){
        return res.status(400).json({"error":'request body cannot be empty'})
    }

    else if(Object.keys(req.body).length!=2){
        return res.status(400).json({"error":'number of request body keys uncorrect'})
    }

    else if(!validateEmail(req.body.email)){ // send email to him to make sure it s a real email
        return res.status(401).json({"error":'email invalid'})
    }

    else if(!validatePassword(req.body.password)){
        return res.status(401).json({"error":'password invalid'})
    }

    const email=req.body.email
    const password=req.body.password
    const get_user_id_query=`SELECT id_user,username,password FROM user WHERE email="${email}"`
    con.query(get_user_id_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            if(rows.length==0){
                return res.status(401).json({"error":"email doesn't exist"})
            }
            user={"name":rows[0].username,"user_id":rows[0].id_user}
            db_password=rows[0].password
            bcrypt.compare(password,db_password,function(err, ismatch) {
                if(err){
                    return res.status(500).json({"error":err.message})
                }
                if (!ismatch) {
                    return res.status(401).json({"error":"wrong password"})
                }
                else {
                    const refresh_token=jwt.sign(user,process.env.SECRET_REFRESH_TOKEN_KEY)//redis_client}

                    let multi = redis_client.multi()

                    multi.rpush('refresh_token', refresh_token);
                    
                    multi.exec(function(errors, results) {
                        if(errors){
                            return res.status(500).json({"error":errors.message})
                        }
                        else{
                            const access_token=generate_access_token(user)
                            return res.status(200).json({"message":"user signed in","access_token":access_token,"refresh_token":refresh_token})
                        }
                    })

                }
            });
        }
      });
})

module.exports=router