const express = require('express');
const router=express.Router();
const {con}  = require ('../config/Database_config.js');


router.get('/characters',(req, res) => {

    const get_characters_query=`SELECT id_char,name FROM animechar`
    con.query( get_characters_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows})
        }
      });
})

router.get('/characters/:character_id',(req, res) => {

    if(isNaN(Number(req.params.character_id))){
        return res.status(400).json({"error":'wrong body key type'})
    }
    const id_character=req.params.character_id
    const get_character_query=`SELECT info,img FROM animechar WHERE id_char=${id_character}`
    con.query( get_character_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            return res.status(200).json({"data":rows[0]})
        }
      });
})


router.get('/characters/:character1_id/:character2_id/fights',(req, res) => {

    if(isNaN(Number(req.params.character1_id)) || isNaN(Number(req.params.character2_id))){
        return res.status(400).json({"error":'wrong body key type'})
        
    }
    const id_character1=req.params.character1_id
    const id_character2=req.params.character2_id
    const get_fight_id_query=`SELECT id_fight FROM fight WHERE (id_char1=${id_character1} AND id_char2=${id_character2}) OR (id_char1=${id_character2} AND id_char2=${id_character1})`
    con.query( get_fight_id_query, (err,rows) => {
        if (err){
            return res.status(500).json({"error":err.message})
        }
        else{
            if(rows.length==0){
                return res.status(500).json({"error":"fight doens't exist"})
            }
            return res.status(200).json({"data":rows[0].id_fight})
        }
      });
})

module.exports=router