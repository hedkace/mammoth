const express = require('express')
const {createServer} = require("http")
const {Server} = require("socket.io")
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()
//const collection = require("./config")
const crypto = require('crypto')
const nodeMailer = require('nodemailer')
//const tokens = require('./config')
const { collection, tokens, clicks } = require('./config')
//const fs = require('fs');
//const path = require('path');


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('view engine','ejs')
app.use(express.static("public"))

const httpServer = createServer(app)

const io = new Server(httpServer)

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lowercaseLetters = uppercaseLetters.toLowerCase()
const numbers = "0123456789"
const otherSymbols = "~!@#$%^&*()_+{}|:<>?,.;'[]-="
const allSymbols = uppercaseLetters + lowercaseLetters + numbers + otherSymbols
//let sessions = {}
const sessionTimeout = /*120000*/ 30000



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
                    let resData = {}
                    resData.name = data.username
                    resData.count = 0
                    console.log(resData)
                    socket.emit("serverMessage",{body:"Credentials accepted",color:"#afa"})
                    //sessions[socket.id] = existingUser.id
                    const updateSession = await tokens.findOne({name: data.username})
                    if(updateSession){
                        console.log("update session")
                        resData.lastOnline = updateSession.lastTime
                        //console.log(Date.parse(updateSession.lastTime) + sessionTimeout < Date.now())
                        if(Date.parse(updateSession.lastTime) + sessionTimeout < Date.now()){
                            //const newSession = {}
                            console.log("session timed out")
                            newToken = ""
                            for(let nn = 0; nn<48; nn++){
                                newToken += allSymbols[Math.floor(Math.random()*allSymbols.length)]
                            }
                            resData.token = newToken
                            updateSession.token = newToken
                            updateSession.lastTime = Date.now()
                            updateSession.save()
                            const clickCount = await clicks.findOne({name: data.username})
                            if(clickCount){
                                console.log("click count found")
                                resData.count = clickCount.count
                                resData.lastTime = clickCount.lastTime
                                console.log(clickCount.count)
                            }
                            else{
                                //create new entry
                                console.log("click count not found")
                                resData.count = 0
                                resData.lastTime = null
                                const newClickCount = clicks.create({
                                    name: data.username,
                                    count: 0,
                                    lastTime: updateSession.lastTime
                                })
                                newClickCount.save()
                            }
                        }
                        else{
                            console.log("session has not timed out")
                            resData.token = updateSession.token
                            updateSession.lastTime = Date.now()
                            updateSession.save()
                            resData.lastOnline = updateSession.lastTime
                            const clickCount = await clicks.findOne({name: data.username})
                            if(clickCount){
                                console.log("click count found")
                                resData.count = clickCount.count
                                resData.lastTime = clickCount.lastTime
                            }
                            else{
                                //create new entry
                                console.log("click count not found")
                                resData.count = 0
                                resData.lastTime = null
                                const newClickCount = clicks.create({
                                    name: data.username,
                                    count: 0,
                                    lastTime: updateSession.lastTime
                                })
                                newClickCount.save()
                            }
                        }
                    }
                    else{
                        console.log("create new session record")
                        newToken = ""
                        for(let nn = 0; nn<48; nn++){
                            newToken += allSymbols[Math.floor(Math.random()*allSymbols.length)]
                        }
                        const newSession = tokens.create({
                            name: data.username,
                            token: newToken,
                            lastTime: Date.now()

                        })
                        newSession.save()
                        resData.token = newToken
                        /*newSession.name = data.username
                        resData.token = newToken
                        newSession.token = newToken
                        newSession.lastTime = Date.now()
                        await tokens.insertMany(newSession)*/
                        const clickCount = await clicks.findOne({name: data.username})
                        if(clickCount){
                            console.log("click count found")
                            resData.count = clickCount.count
                        }
                        else{
                            //create new entry
                            console.log("click count not found")
                            const newClickCount = await clicks.create({
                                name: data.username,
                                count: 0,
                                lastTime: newSession.lastTime
                            })
                            console.log("ham")
                            newClickCount.save()
                        }
                    }
                    console.log(resData)
                    setTimeout(()=>{socket.emit("splash")},700)
                    setTimeout(()=>{socket.emit("launch",resData)},2000)
                    /*fs.readFile(path.join(__dirname, 'adnother.html'), (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error loading index.html');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(data);
                        }
                    });*/
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
        if(data.invite == process.env.INVITE2){
            if(existingUser){
                socket.emit("serverMessage",{body:"Username already in use",color:"#faa"})
            }
            else{
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
        }
        else{
            socket.emit("serverMessage",{body:"Invite code is invalid",color:"#faa"})
        }
    })
    socket.on('disconnect', function() {
        console.log(socket.id+" disconnected")
    })

    socket.on('click', async (data)=>{
        const updateSession = await tokens.findOne({name: data.username})
        if(updateSession){
            if(updateSession.token == data.token){
                if(Date.parse(updateSession.lastTime) + sessionTimeout < Date.now()){
                    socket.emit("promptUser")
                }
                else{
                    updateSession.lastTime = Date.now()
                    updateSession.save()
                    const updateClickCount = await clicks.findOne({name: data.username})
                    if(updateClickCount){
                        //update entry
                        updateClickCount.count ++
                        updateClickCount.save()
                        updateClickCount.lastTime = updateSession.lastTime
                        socket.emit("updateClicks",{count: updateClickCount.count, lastOnline: updateSession.lastTime, lastTime: updateClickCount.lastTime})
                    }
                    else{
                        //create new entry
                        const newClickCount = {
                            name: data.username,
                            count: 1,
                            lastTime: updateSession.lastTime
                        }
                        //newClickCount.save()
                        await clicks.insertMany(newClickCount)
                        socket.emit("updateClicks",{count: newClickCount.count, lastOnline: updateSession.lastTime, lastTime: newClickCount.lastTime})
                    }
                }
            }
            else{
                socket.emit("promptUser")
            }
        }
        else{
            socket.emit("promptUser")
        }
    })
})

httpServer.listen(5000)



