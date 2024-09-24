import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken";

export const getPosts = async (req,res)=>{
    const query = req.query;
    
    try {
      const where = {};
      if (query.city!='undefined') {
          where.city = query.city;
      }
      if (query.type!='undefined') {
          where.type = query.type;
      }
      if (query.property!='undefined' && query.property!="") {
          where.property = query.property;
      }
     
      where.price={
          gte:parseInt(query.minPrice),
          lte:parseInt(query.maxPrice),
      }
      
      const posts=await prisma.post.findMany({
          where
      });
      res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({message:"Failed to getPosts!"});
    }
}

export const getPost = async (req,res)=>{
    const id = req.params.id;
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      const token = req.cookies?.token;
      let flag=false;
      if (token) {
        flag=await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                   
          if (!err) {
            const saved = await prisma.savedPost.findUnique({
              where: {
                userId_postId: {
                  postId: id,
                  userId: payload.id,
                },
              },
            });
            flag= saved ? true : false ; 
            return flag;
          }else return false;
        });
        
      }
      
      res.status(200).json({ ...post, isSaved: flag });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get post" });
    }
}

export const addPost = async (req,res)=>{
    const body = req.body;
    const tokenUserId = req.userId;
    console.log(body);
    try {
        const newPost = await prisma.post.create({
            data:{
                ...body.postData, 
                user:{
                  connect:{
                    id:tokenUserId,
                  }
                },
                postDetail:{
                    create:body.postDetail,
                }
                
            }
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({message:"Failed to add Posts!"});
    }
}
export const updatePost = async (req,res)=>{

    try {
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message:"Failed to upadte posts!"});
    }
}

export const deletePost = async (req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where:{id}
        })

        if(post.userId!==tokenUserId){
            return res.status(403).json({message:"Not authorized"});
        }

        await prisma.post.delete({
            where:{id},
        });

        res.status(200).json({message:"Post Deleted!!"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message:"Failed to delete pots!"});
    }
}