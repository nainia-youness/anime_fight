const express = require('express');
const router=express.Router();
const {con}  = require ('../../config/Database_config.js');
const {authenticateToken}  = require ('../../auth/auth_service.js');

router.post('/:fight_id/comments',authenticateToken,(req,res,next)=>{      

    if(!req.body.comment){
        return res.status(400).json({"error":'request body cannot be empty'})
    }

    else if(isNaN(Number(req.params.fight_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }

    //false(no error) if we have exactly 1 keys or (2 keys and the key id_comment_responded_to)
    else if(Object.keys(req.body).length!=1 && (Object.keys(req.body).length!=2 || !req.body.id_comment_responded_to)){
        return res.status(400).json({"error":'number of request body keys uncorrect'})
    }

    else if(req.body.id_comment_responded_to && isNaN(Number(req.body.id_comment_responded_to))){
        return res.status(400).json({"error":'wrong body key type'})
    }

    const id_fight= req.params.fight_id
    const id_user=req.user.user_id
    let id_comment_responded_to
    if(req.body.id_comment_responded_to)
        id_comment_responded_to=req.body.id_comment_responded_to
    else{
        id_comment_responded_to="NULL"
    }
    const comment= `"${req.body.comment}"`
    const insert_comment_query=`INSERT INTO comment (content,id_fight,id_user,id_comment_responded_to) VALUES(${comment},${id_fight},${id_user},${id_comment_responded_to})`
    con.query(insert_comment_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"message":"comment inserted"})
        }
    })
})


router.get('/:fight_id/comments',(req,res,next)=>{      

    if(isNaN(Number(req.params.fight_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }

    const id_fight= req.params.fight_id

    const get_comment_query=`SELECT c.id_comment,c.content,c.id_user,u.username,c.id_comment_responded_to FROM comment as c,user as u WHERE id_fight=${id_fight} AND c.id_user=u.id_user;`
    con.query(get_comment_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows})
        }
    })
})


router.put('/comments/:comment_id',authenticateToken,(req,res,next)=>{      

    if(!req.body.comment){
        return res.status(400).json({"error":'request body cannot be empty'})
    }

    else if(isNaN(Number(req.params.comment_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }

    else if(Object.keys(req.body).length!=1){
        return res.status(400).json({"error":'number of request body keys uncorrect'})
    }

    const id_comment= req.params.comment_id
    const id_user=req.user.user_id
    const comment=req.body.comment

    const update_comment_query=`UPDATE comment SET content="${comment}" WHERE id_user=${id_user} AND id_comment=${id_comment};`
    con.query(update_comment_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"message":"comment updated"})
        }
    })
})



router.delete('/comments/:comment_id',authenticateToken,(req,res,next)=>{      

    if(isNaN(Number(req.params.comment_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }

    const id_comment= req.params.comment_id
    const id_user=req.user.user_id

    const delete_comment_query=`DELETE FROM comment WHERE id_user=${id_user} AND id_comment=${id_comment};`
    con.query(delete_comment_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"message":"comment deleted"})
        }
    })
})


module.exports=router