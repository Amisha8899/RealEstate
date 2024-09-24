import jwt from "jsonwebtoken";

export const loggedIn = async (req,res)=>{
    console.log(req.id);
    res.status(200).json({message:"You are Authenticated"});
};
export const admin = async (req,res)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:"Not Authenticated"});
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err) return res.status(403).json({message:"Token Not Valid"});
        if(!payload.isAdmin){
            return res.status(403).json({message:"Not Authorized"});
        }
    })
    res.status(200).json({message:"You are Authenticated"});
};