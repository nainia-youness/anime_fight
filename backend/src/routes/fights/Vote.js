const express = require('express');
const router=express.Router();
const {con}  = require ('../../config/Database_config.js');
const {authenticateToken}  = require ('../../auth/auth_service.js');


router.post('/:fight_id/votes',authenticateToken,(req,res,next)=>{
    
    if(!req.body.id_char_voted_for){
        return res.status(400).json({"error":'request body cannot be empty'})
    }
    
    else if(isNaN(Number(req.params.fight_id)) || isNaN(Number(req.body.id_char_voted_for))){
        return res.status(400).json({"error":'wrong body key type'})
    }

    else if(Object.keys(req.body).length!=1){
        return res.status(400).json({"error":'number of request body keys uncorrect'})
    }

    const id_fight= req.params.fight_id
    const id_user=req.user.user_id
    const did_user_vote_fight_query=`SELECT id_vote,id_char_voted_for FROM vote WHERE id_user=${id_user} AND id_fight=${id_fight};`
    con.query(did_user_vote_fight_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            request_id_char_vote=parseInt(req.body.id_char_voted_for)

            if(rows.length==0){//user never voted
                insert_vote(res,id_user,id_fight,request_id_char_vote,next)
            }
            else{
                db_id_char_vote=rows[0].id_char_voted_for
                if(db_id_char_vote===request_id_char_vote){//state of like in db and request is the same
                    update_char_voted_for(res,id_user,id_fight,"NULL",next)
                }
                else{
                    update_char_voted_for(res,id_user,id_fight,request_id_char_vote,next)
                }
            }
        }
    })
})

router.get('/:fight_id/characters/:character_id/vote_state',authenticateToken,(req,res,next)=>{    
    
    if(isNaN(Number(req.params.fight_id)) || isNaN(Number(req.params.character_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }
    const id_user=req.user.user_id
    const id_fight= req.params.fight_id
    const id_character= req.params.character_id
    const get_vote_state_query=`SELECT EXISTS(SELECT id_vote FROM vote WHERE id_fight=${id_fight} AND id_char_voted_for=${id_character} AND id_user=${id_user}) as is_exist;`
    con.query(get_vote_state_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0].is_exist})
        }
      });
})


router.get('/:fight_id/characters/:character_id/nbr_votes',(req,res,next)=>{    
    
    if(isNaN(Number(req.params.fight_id)) || isNaN(Number(req.params.character_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }
    const id_fight= req.params.fight_id
    const id_char= req.params.character_id
    const get_nbr_votes_query=`SELECT COUNT(*) as nbr_of_votes FROM vote WHERE id_fight=${id_fight} AND id_char_voted_for=${id_char};`
    con.query(get_nbr_votes_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0].nbr_of_votes})
        }
      });
})


const insert_vote=(res,id_user,id_fight,id_char_voted_for,next)=>{

    const is_char_in_fight_query=`SELECT id_fight FROM fight WHERE id_fight=${id_fight} AND (id_char1=${id_char_voted_for} OR id_char2=${id_char_voted_for})`

    const insert_query=`INSERT INTO vote (id_char_voted_for,id_user,id_fight) VALUES(${id_char_voted_for},${id_user},${id_fight})`
    con.query(is_char_in_fight_query, (err, result)=> {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            if(result.length==0){
                return res.status(500).json({"error":"character not in the fight"})
            }
            else{
                con.query(insert_query, (err, result)=> {
                    if (err){
                        return res.status(500).json({"error":err.message})
                    }
                    else{
                        return res.status(200).json({"message":"vote inserted"})
                    }
                  });
            }
        }
      });

}

const update_char_voted_for=(res,id_user,id_fight,updated_value,next)=>{

    const is_char_in_fight_query=`SELECT id_fight FROM fight WHERE id_fight=${id_fight} AND (id_char1=${updated_value} OR id_char2=${updated_value})`
    con.query(is_char_in_fight_query, (err, result)=> {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            if(updated_value!="NULL" && result.length==0){
                return res.status(500).json({"error":"character not in the fight"})
            }
            else{
                const update_query=`UPDATE vote SET id_char_voted_for=${updated_value} WHERE id_user=${id_user} AND id_fight=${id_fight}`
                con.query(update_query, (err, result)=> {
                    if (err){
                        return res.status(500).json({"error":err.message})
                    }
                    else{
                        return res.status(200).json({"message":"vote updated"})
                    }
                  });
            }
        }
      });
}


module.exports=router