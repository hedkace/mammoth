const express = require('express')
const {createServer} = require("http")
const {Server} = require("socket.io")
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()
const collection = require("./config")
const crypto = require('crypto')
const nodeMailer = require('nodemailer')


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('view engine','ejs')
app.use(express.static("public"))

const httpServer = createServer(app)

const io = new Server(httpServer)

let sessions = {}



io.on('connect',(socket)=>{
    console.log("user connected ", socket.id)
    
    socket.emit("promptUser")

    socket.on("change",()=>{
        console.log("message received")
        io.emit("update",{data:Math.random()*360})
    })
    socket.on("login",async (data)=>{
        console.log(data.username,data.password)
        const existingUser = await collection.findOne({name: data.username})
        console.log(existingUser)
        if(existingUser){
            bcrypt.compare(data.password, existingUser.password,async (err,isPasswordMatch)=>{
                if(isPasswordMatch){
                    socket.emit("serverMessage",{body:"Credentials accepted",color:"#afa"})
                    sessions[socket.id] = existingUser.id
                    setTimeout(()=>{socket.emit("splash")},700)
                    setTimeout(()=>{socket.emit("launch")},2000)
                }
                else{
                    socket.emit("serverMessage",{body:"Credentials rejected",color:"#faa"})
                }
            })
        }
        else{
            socket.emit("serverMessage",{body:"User not found",color:"#faa"})
        }
    })

    socket.on("signup",async (data)=>{
        console.log(data.username,data.password,data.invite)
        const existingUser = await collection.findOne({name: data.username})
        console.log(existingUser)
        if(existingUser){
            socket.emit("serverMessage",{body:"Username already in use",color:"#faa"})
        }
        else{
            if(data.invite == process.env.INVITE2){
                //Register New User
                bcrypt.genSalt(10,async (err,salt)=>{
                    if(err) {
                        console.log("error hashing password")
                        return false
                    }
                    bcrypt.hash(data.password,salt,async (err,hash)=>{
                        let newuser = {}
                        newuser.name = data.username
                        newuser.password = await bcrypt.hash(data.password,salt)
                        //newuser.salt = salt
                        await collection.insertMany(newuser)
                        socket.emit("serverMessage",{body:"User created",color:"#ffa"})
                    })
                })
            }
            else{
                socket.emit("serverMessage",{body:"Invite code is invalid",color:"#faa"})
            }
        }
    })
    socket.on('disconnect', function() {
        console.log(socket.id+" disconnected")
    })
})

httpServer.listen(5000)



