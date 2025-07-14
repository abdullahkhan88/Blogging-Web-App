const jwt = require('jsonwebtoken');

const AuthMiddleware = (req,res,next) =>{
    try{
        const AuthHeader = req.headers['authorization'];
        if(!AuthHeader){
            return res.status(401).send({message:"Token Missing"});
        };
        const token = AuthHeader.split(' ')[1];
        if(!token){
            return res.status(401).send({message:"Token Not Found"});
        };
        const decode = jwt.verify(token,process.env.userSecretKey);
        req.user = decode
        next();
    }catch(error){
        return res.status(403).send({message:"Invalid expired token"});
    };
};
module.exports = AuthMiddleware;