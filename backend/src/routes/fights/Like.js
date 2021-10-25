const express = require('express');
const router=express.Router();
const {con}  = require ('../../config/Database_config.js');
const {authenticateToken}  = require ('../../auth/auth_service.js');

router.post('/:fight_id/likes',authenticateToken,(req,res,next)=>{      
    
    if(!req.body.is_like){
        return res.status(400).json({"error":'request body cannot be empty'})
    }
    
    else if(isNaN(Number(req.params.fight_id)) || (Number(req.body.is_like)!=0 && Number(req.body.is_like)!=1)){
        return res.status(400).json({"error":'wrong body key type'})
    }

    else if(Object.keys(req.body).length!=1){
        return res.status(400).json({"error":'number of request body keys uncorrect'})
    }

    const id_fight= req.params.fight_id
    const id_user=req.user.user_id
    const did_user_like__dislike_fight_query=`SELECT id_like,is_like FROM likedislike WHERE id_user=${id_user} AND id_fight=${id_fight}`
    con.query(did_user_like__dislike_fight_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            const request_like_state=parseInt(req.body.is_like)

            if(rows.length==0){//user never liked or disliked the fight
                insert_like_dislike(res,id_user,id_fight,request_like_state,next)
            }
            else{//user already liked or disliked the fight
                db_like_state=rows[0].is_like

                if(db_like_state===request_like_state){//state of like in db and request is the same
                    update_like_status(res,id_user,id_fight,"NULL",next)
                }
                else{
                    if(request_like_state===0){//in db like and request dislike
                            update_like_status(res,id_user,id_fight,"0",next)
                    }
                    else{//in db dislike but ask for like
                        update_like_status(res,id_user,id_fight,"1",next)
                    }
                }
            }
        }
    });
})


router.get('/:fight_id/nbr_likes',(req,res,next)=>{    
    
    if(isNaN(Number(req.params.fight_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }
    const id_fight= req.params.fight_id
    const get_nbr_likes_query=`SELECT COUNT(*) as nbr_of_likes FROM likedislike WHERE is_like=1 AND id_fight=${id_fight};`
    con.query(get_nbr_likes_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0].nbr_of_likes})
        }
      });
})


router.get('/:fight_id/like_state',authenticateToken,(req,res,next)=>{    
    
    if(isNaN(Number(req.params.fight_id))){
        res.status(400).json({"error":'wrong body key type'})
        return;
    }
    const id_user=req.user.user_id
    const id_fight= req.params.fight_id
    const get_like_state_query=`SELECT EXISTS(SELECT is_like FROM likedislike WHERE id_user=${id_user} AND id_fight=${id_fight} AND is_like=1) as is_exist;`
    con.query(get_like_state_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0].is_exist})
        }
      });
})

router.get('/:fight_id/dislike_state',authenticateToken,(req,res,next)=>{    
    
    if(isNaN(Number(req.params.fight_id))){
        return  res.status(400).json({"error":'wrong body key type'})
    }
    const id_user=req.user.user_id
    const id_fight= req.params.fight_id
    const get_dislike_state_query=`SELECT EXISTS(SELECT is_like FROM likedislike WHERE id_user=${id_user} AND id_fight=${id_fight} AND is_like=0) as is_exist;`
    con.query(get_dislike_state_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0].is_exist})
        }
      });
})

router.get('/:fight_id/nbr_dislikes',(req,res,next)=>{    

    if(isNaN(Number(req.params.fight_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }
    const id_fight= req.params.fight_id  
    const get_nbr_dislikes_query=` SELECT COUNT(*) as nbr_of_dislikes FROM likedislike WHERE is_like=0 AND id_fight=${id_fight};`
    con.query(get_nbr_dislikes_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0].nbr_of_dislikes})
        }
      });

})

const insert_like_dislike=(res,id_user,id_fight,request_like_state,next)=>{

    const insert_query=`INSERT INTO likedislike (is_like,id_user,id_fight) VALUES(${request_like_state},${id_user},${id_fight})`

    con.query(insert_query, (err, result)=> {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"message":"like inserted"})
        }
      });

};





const update_like_status=(res,id_user,id_fight,updated_value,next)=>{
    const update_query=`UPDATE likedislike SET is_like=${updated_value} WHERE id_user=${id_user} AND id_fight=${id_fight}`
    con.query(update_query, (err, result)=> {
        if (err){
            res.status(500).json({"error":err.message})
            return;
        }
        else{
            res.status(200).json({"message":"like updated"})
            return;
        }
      });
};


module.exports=router
