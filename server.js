const express = require("express")
const http = require('http');
const cors = require('cors');
const socketio = require("socket.io")
const {Server} = require('socket.io')
const app = express();
const port = process.env.PORT || 222  ;

let users = [];
app.get("/",(req,res)=>{
    res.send("server is runnning ")
})
const server = http.createServer(app);

const io = new Server(server , {
    cors:{
        origin: "https://shivamchatroom.vercel.app",
        methods:["Get","Post"]
    }
})
io.on("connection",(socket)=>{
    console.log("user connected");

    socket.on("newjoined",({user})=>{
        users[socket.id] = user;
        console.log("here is the user" + users[socket.id])
        users[socket.id] 
        console.log(`${user} has joined`)

        socket.broadcast.emit("userjoined",{user:"Admin", message:`${users[socket.id]} Has Joined` , id:socket.id})

        socket.on("messagesent",(data)=>{
            console.log(data)
            io.emit("messagerec",(data))

        })

        socket.on("disconnect" , (user)=>{
            console.log(`${users[socket.id]} left`)
            socket.broadcast.emit("userdisconnect",{user:"Admin", message:`${users[socket.id]} Has Left` , id:socket.id})
      
            
         
        })
    })



}) 

server.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})