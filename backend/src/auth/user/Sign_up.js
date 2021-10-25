const express = require('express');
const router=express.Router();
const {con}  = require ('../../config/Database_config.js');
const bcrypt = require('bcrypt')
const {validatePassword,validateEmail}  = require ('../auth_service.js');

// user send username,email,password we add them to database
router.post('/sign_up',(req,res,next)=>{    
    
    if(!req.body.username || !req.body.password || !req.body.email){
        return res.status(400).json({"error":'request body cannot be empty'})
    }

    else if(Object.keys(req.body).length!=3){
        return res.status(400).json({"error":'request body must contain three keys'})
    }

    else if(!validateEmail(req.body.email)){ // send email to him to make sure it s a real email
        return res.status(401).json({"error":'email invalid'})
    }

    else if(!validatePassword(req.body.password)){
        return res.status(401).json({"error":'password invalid'})
    }
    const username=req.body.username
    const email=req.body.email

    const is_email_exist_query=`SELECT EXISTS(SELECT id_user FROM user WHERE email="${email}") as is_exist;`
    con.query(is_email_exist_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            const is_email_exist=rows[0].is_exist
            if(is_email_exist){
                return res.status(401).json({"error":"email already exist"})
            }
            else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{//10 is the salt
                    if(err){
                        return res.status(500).json({"error":err.message})
                    }
                    else{
                        const sign_up_query=`INSERT INTO user (email,password,username) VALUES("${email}","${hash}","${username}");`
                        con.query(sign_up_query, (err,rows) => {
                            if (err){
                                return res.status(500).json({"error":err.message})
                            }
                            else{
                                return res.status(200).json({"message":"user signed up"})
                            }
                          });
                    }
                })
            }
        }
      });
})


module.exports=router