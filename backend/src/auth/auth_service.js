const jwt=require('jsonwebtoken')

function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(token ==null) return res.status(401).json({"error":"acess token is not in header"})
    //now we have a token
    jwt.verify(token,process.env.SECRET_ACCESS_TOKEN_KEY,(err,user)=>{
        if(err) {
            return res.status(403).json({"error":err.message})
        }
        req.user=user
        next()
    })
}

function generate_access_token(user){
    return jwt.sign(user,process.env.SECRET_ACCESS_TOKEN_KEY,{expiresIn: '900s'})
}

function validatePassword(password) {// 6 to 16 alphanumerical with at least 1 spetial char, 1 nbr and 1 Uppercase letter
    const re=/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(password)
}


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports={authenticateToken,generate_access_token,validatePassword,validateEmail}