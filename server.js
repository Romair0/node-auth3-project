
const express =require("express")
const helmet=require("helmet")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const userRouter=require('./router/userRouter')
const server=express()

server.use(express.json())
server.use(cors())
server.use(helmet())
server.use(cookieParser())
server.use('/',userRouter)


server.use((err,req,res,next)=>{
    res.status(500).json({message:"Server Error"})
})

module.exports=server