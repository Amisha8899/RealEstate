import { Server } from "socket.io";
const io = new Server(4000,{
    cors:{
        origin:"http://localhost:5173"
    },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
    const userExists = onlineUser.find((user) => user.userId===userId);
    if(!userExists){
        onlineUser.push({userId, socketId});
    }
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user)=>user.socketId!==socketId);
}

const getUser = (userId) => {
    const user = onlineUser.find((user) => user.userId === userId);
    return user;
}

io.on("connection", (socket)=>{
    socket.on("newUser", (userId)=>{
        addUser(userId, socket.id);
    });
    socket.on("sendMessage", ({receiverId, data}) => {
        const receiver = getUser(receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", data);
        } 
    });
    socket.on("disconnect", () => {
        removeUser(socket.id);
    });
})
