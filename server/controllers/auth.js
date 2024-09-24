import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// import {} from "dotenv/config";
export const register = async (req,res)=>{
    const {username, email, password} = req.body;
try{
    const hashedPass = await bcrypt.hash(password,10);
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPass,
        },
    });
    res.status(201).json({message:"User Created Successfully"});
} catch(err){
    res.status(500).json({message:"Failed to create user"});
}
};
export const login = async (req,res)=>{
    const {username, password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where:{username}
        })
        if(!user) return res.status(404).json({message:"Invalid Credentials"});
        const isPassValid = await bcrypt.compare(password, user.password);
        if(!isPassValid) return res.status(404).json({message:"Invalid Credentials"});
        // res.setHeader("Set-Cookie", "test="+"myValue").json("success"); // without cookie parser
        const age = 1000*60*60*24*7;
        const token = jwt.sign({
            id:user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY, {expiresIn:age});
        const {password:userPassword,...userinfo} = user
        // --env-file .env
        console.log(token);
        
        res.cookie("token",token,{
            httpOnly: true,
            // secure:true,
            maxAge:age,
        }).status(200).json(userinfo);

    }catch(err){
        res.status(500).json({message:"Failed to login"});
    }
}
export const logout = async (req,res)=>{
    res.clearCookie("token").status(200).json({message:"Logout successfully"});
}
// cookie: user data is decrypted into a cookie, 
//whenever user makes req to server cookie is send , 
//user data is encrypted from it to know which user the response is made