import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/post.js";
import userRoute from "./routes/user.js";
import testRoute from "./routes/test.js";
import chatRoutes from "./routes/chat.js";
import messageRoute from "./routes/message.js";

const app = express();
app.use(cors({origin:process.env.CLIENT_URL, credentials:true}))
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/user", userRoute);
app.use("/test", testRoute);
app.use("/chat", chatRoutes);
app.use("/message", messageRoute);
app.listen(8800,()=>{
    console.log("Server started on port 8800");
});