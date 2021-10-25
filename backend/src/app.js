const express = require('express')
const morgan= require('morgan')
const app = express()
const fight_route=require('./routes/Fight.js')
const character_route=require('./routes/Character.js')
const user_route=require('./auth/User.js')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../.env' });
}
//here you add middlewwares

app.use(morgan('dev'));


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }))// to support URL-encoded bodies 

const base_route="/api"
app.use(base_route,fight_route)
app.use(base_route,character_route)
app.use(base_route,user_route)


app.use((req,res,next)=>{
    return res.status(404).send({'error':"not found"})
})

app.use((error,req,res,next)=>{

    return res.status(error.status).json({
        "error":error.message,
    })
})
module.exports={app}