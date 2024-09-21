//const { json } = require("express")

//console.log(localStorage.getItem("ham"))

let coinSymbol = "₡"
//let coinSymbol = "₦"
//let coinSymbol = "€"
let color0 = "#7d8ea5" // Pale Blue
let color1 = "#75a1b0" //Light Blue Buttons
let color2 = "#041d39" // Dark Blue
let color3 = "#021020" // Darker Blue
let color4 = "#999" //Light Grey
let color5 = "#686868" //Dark Grey
let color6 = "#1a1a1a"  //Darker Grey
let color7 = "#2ae89" //Green
let color8 = "#ff5555" //Red
let color9 = "#f49b8b" //pale red


let main = document.querySelector("main")


const socket = io('ws://localhost:5000')
console.log(socket)

socket.on('connect', ()=>{
    console.log("connected")
})
socket.on('update', (color)=>{
    let colorString = "hsl("+color.data+",50%,05%)"
    document.body.style.background = colorString
})
socket.on('promptUser', ()=>{loginPage()})
socket.on('serverMessage', (message)=>{
    let serverMessage = document.querySelector("#serverMessage")
    serverMessage.style.color = message.color
    serverMessage.innerHTML = message.body
})

socket.on('splash', (data)=>{
    let main = document.querySelector("main")
    main.innerHTML = ""
    let newdiv = document.createElement("div")
    let logo = document.createElement("img")
    logo.src = "images/mammoth-mark.svg"
    logo.style.height = "50px"
    newdiv.appendChild(logo)
    newdiv.innerHTML += "<br>glhf"
    main.appendChild(newdiv)
})

socket.on('launch', (data)=>{
    document.body.innerHTML = ""
    frontPage(data)
    
})

socket.on('updateClicks', (data)=>{
    let clickScore = document.querySelector("#clickScore")
    if(clickScore) clickScore.innerHTML = data.count
    let lastOnline = document.querySelector(".lastOnline")
    let lastClick = document.querySelector(".lastClick")
    lastOnline.innerHTML = new Date(data.lastOnline).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})
    lastClick.innerHTML = new Date(data.lastTime).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})
    
})


let loginPage = ()=>{
    console.log("load login page")
    document.body.innerHTML = ""
    
    document.body.style.display = "grid"
    document.body.style.gridTemplateRows = "1fr"
    document.body.style.gridTemplateColumns = "1fr"
    document.body.style.alignItems = "center"
    document.body.style.justifyItems = "center"
    let main = document.createElement("main")
    let branding = document.createElement("div")
    branding.classList.add("branding")
    branding.innerHTML = "Mammoth"
    document.body.appendChild(branding)
    document.body.appendChild(main)
    let backgroundVideo = document.createElement("div")
    backgroundVideo.classList.add("backgroundVideo")
    //backgroundVideo.innerHTML = '<video playsinline autoplay muted loop><source src="videos/watersmoke.mp4" type="video/webm">Your browser does not support the video tag.</video>'
    let video = document.createElement("video")
    let vsource = document.createElement("source")
    vsource.src = "videos/watersmoke.mp4"
    vsource.type = "video/webm"
    //let video = backgroundVideo.querySelector("video")
    document.body.appendChild(backgroundVideo)
    backgroundVideo.appendChild(video)
    video.appendChild(vsource)
    video.autoplay = true
    video.playsInline = true
    video.muted = true
    video.loop = true
    video.style.position = "absolute"
    video.style.top = 0
    video.style.left = 0
    video.style.objectFit = "cover"
    video.style.height = "100%"
    video.style.width = "100%"
    video.load()
    video.play()
    backgroundVideo.style.position = "absolute"
    backgroundVideo.style.width = "100vw"
    backgroundVideo.style.height = "100vh"
    backgroundVideo.style.overflow = "hidden"
    backgroundVideo.style.left = 0
    backgroundVideo.style.top = 0
    main.innerHTML = ""
    let dialog = document.createElement("div")
    main.appendChild(dialog)    
    let title = document.createElement("h2")
    title.innerHTML = "Login"
    main.appendChild(title)
    let label = document.createElement("label")
    label.innerHTML = "Username"
    let field = document.createElement("input")
    field.type = "text"
    field.placeholder = "Enter your username"
    field.id = "username"
    main.appendChild(label)
    main.appendChild(field)
    field.onkeydown = (e)=>{
        if(e.key == "Enter") buttonClick()
    }
    label = document.createElement("label")
    label.innerHTML = "Password"
    field = document.createElement("input")
    field.type = "password"
    field.placeholder = "Enter your password"
    field.id = "password"
    main.appendChild(label)
    main.appendChild(field)
    let button = document.createElement("div")
    button.innerHTML = "Login"
    button.classList.add("button")
    button.tabIndex = 0
    main.appendChild(button)
    field.onkeydown = (e)=>{
        if(e.key == "TAB") button.focus()
        if(e.key == "Enter") buttonClick()
    }
    button.onkeydown = (e)=>{
        if(e.key == "Enter") buttonClick()
        if(e.key == " ") buttonClick()
    }
    let otherOption1 = document.createElement("div")
    let otherOption2 = document.createElement("div")
    let otherOption3 = document.createElement("div")
    otherOption1.innerHTML = "Forgot password? Click here."
    otherOption2.innerHTML = "Forgot username? Click here."
    otherOption3.innerHTML = "New? Sign up."
    //main.appendChild(otherOption1)
    //main.appendChild(otherOption2)
    main.appendChild(otherOption3)
    otherOption1.onclick = (e)=>{
        socket.emit("forgotPassword")
    }
    otherOption2.onclick = (e)=>{
        socket.emit("forgotUsername")
    }
    otherOption3.onclick = (e)=>{
        signupPage()
    }
    let serverMessage = document.createElement("div")
    serverMessage.id = "serverMessage"
    main.appendChild(serverMessage)
    let buttonClick = (e)=>{
        const data = {username:document.querySelector("#username").value,password:document.querySelector("#password").value}
        console.log(data)
        if(document.querySelector("#username").value.length == 0) {
            document.querySelector("#serverMessage").innerHTML = "Enter your username"
            document.querySelector("#serverMessage").style.color = "#faa"
        }
        else if(document.querySelector("#password").value.length == 0) {
            document.querySelector("#serverMessage").innerHTML = "Enter your password"
            document.querySelector("#serverMessage").style.color = "#faa"
        }
        else socket.emit("login",data)
    }
    button.onclick = buttonClick
}
let signupPage = ()=>{
    let main = document.querySelector("main")
    main.innerHTML = ""
    let dialog = document.createElement("div")
    main.appendChild(dialog)    
    let title = document.createElement("h2")
    title.innerHTML = "Sign Up"
    main.appendChild(title)
    let label = document.createElement("label")
    label.innerHTML = "Username"
    let field = document.createElement("input")
    field.type = "text"
    field.placeholder = "Enter your username"
    field.id = "username"
    main.appendChild(label)
    main.appendChild(field)
    label = document.createElement("label")
    label.innerHTML = "Password"
    field = document.createElement("input")
    field.type = "password"
    field.placeholder = "Enter your password"
    field.id = "password"
    main.appendChild(label)
    main.appendChild(field)
    label = document.createElement("label")
    label.innerHTML = "Confirm password"
    field = document.createElement("input")
    field.type = "password"
    field.placeholder = "Retype your password"
    field.id = "confirm"
    field.autocomplete = false
    main.appendChild(label)
    main.appendChild(field)
    label = document.createElement("label")
    label.innerHTML = "Invite code"
    field = document.createElement("input")
    field.type = "text"
    field.placeholder = "Enter your invite code"
    field.id = "invite"
    main.appendChild(label)
    main.appendChild(field)
    let button = document.createElement("div")
    button.innerHTML = "Sign Up"
    button.classList.add("button")
    main.appendChild(button)
    let otherOption1 = document.createElement("div")
    let otherOption2 = document.createElement("div")
    let otherOption3 = document.createElement("div")
    otherOption1.innerHTML = "Forgot password? Click here."
    otherOption2.innerHTML = "Forgot username? Click here."
    otherOption3.innerHTML = "Already a member? Log in."
    //main.appendChild(otherOption1)
    //main.appendChild(otherOption2)
    main.appendChild(otherOption3)
    otherOption1.onclick = (e)=>{
        socket.emit("forgotPassword")
    }
    otherOption2.onclick = (e)=>{
        socket.emit("forgotUsername")
    }
    otherOption3.onclick = (e)=>{
        loginPage()
    }
    let serverMessage = document.createElement("div")
    serverMessage.id = "serverMessage"
    main.appendChild(serverMessage)
    button.onclick = (e)=>{
        const data = {username:document.querySelector("#username").value,password:document.querySelector("#password").value, invite: document.querySelector("#invite").value}
        console.log(data)
        if(document.querySelector("#password").value != document.querySelector("#confirm").value) {
            document.querySelector("#serverMessage").innerHTML = "Passwords do not match"
            document.querySelector("#serverMessage").style.color = "#faa"
        }
        else if(document.querySelector("#username").value.length == 0 )   {
            document.querySelector("#serverMessage").innerHTML = "Choose a username"
            document.querySelector("#serverMessage").style.color = "#faa"
        }
        else if(document.querySelector("#invite").value.length == 0){
            document.querySelector("#serverMessage").innerHTML = "An invite code is required"
            document.querySelector("#serverMessage").style.color = "#faa"
        }
        else socket.emit("signup",data)
    }
    
}


let frontPage = (data) => {
    console.log(data)
    let main = document.querySelector("main")
    if(!main) main = document.createElement("main")
    let topBar = document.createElement("div")
    document.body.style.display = "grid"
    document.body.style.gridTemplateRows = "50px 1fr"
    document.body.style.gridTemplateColumns = "1fr"
    document.body.appendChild(topBar)
    topBar.classList.add("topBar")
    document.body.appendChild(main)
    topBar.style.display = "grid"
    topBar.style.gridTemplateColumns = "1fr 1fr 1fr"
    topBar.style.gridTemplateRows = "1fr"
    topBar.style.width = "100%"
    topBar.style.height = "50px"
    topBar.style.alignItems = "center"
    topBar.style.top = 0
    let topLeft = document.createElement("div")
    topLeft.innerHTML = "<img src='images/mammoth-mark.svg'>" +"Mammoth"
    let logo = topLeft.querySelector("img")
    logo.style.height = "20px"
    logo.style.marginRight = "10px"
    topLeft.style.fontWeight = 500
    topLeft.style.paddingLeft = "20px"
    topBar.appendChild(topLeft)
    topLeft.style.gridColumnStart = 1
    topLeft.style.gridColumnEnd = 2
    let topRight = document.createElement("div")
    let userIcon = document.createElement("div")
    let mailIconBox = document.createElement("div")
    topRight.appendChild(mailIconBox)
    topRight.appendChild(userIcon)
    let mailIcon = document.createElement("img")
    mailIconBox.appendChild(mailIcon)
    mailIcon.src= "images/mail icon.png"
    //mailIcon.src= "images/mammothmark.png"
    mailIconBox.classList.add("mailIconBox")
    mailIcon.classList.add("mailIcon")
    mailIconBox.style.width = "50px"
    mailIcon.style.width = "60%"
    userIcon.style.height = "32px"
    userIcon.style.width = "32px"
    let mailNotification = document.createElement("div")
    mailIconBox.appendChild(mailNotification)
    mailNotification.innerHTML = 0
    mailNotification.classList.add("mailNotification")
    topBar.appendChild(topRight)
    topRight.style.gridColumnStart = 3
    topRight.style.gridColumnEnd = 4
    userIcon.style.border = "1px solid #999"
    topRight.style.display = "grid"
    topRight.style.gridTempateColumns = "1fr 80px"
    topRight.style.gridTemplateRows = "1fr"
    topRight.style.justifyItems = "end"
    topRight.style.justifyContent = "end"
    topRight.style.textAlign = "right"
    topRight.style.paddingRight = "40px"
    topRight.style.height = "50px"
    userIcon.style.marginTop = "8px"
    userIcon.style.gridColumnStart = 2;
    userIcon.style.gridColumnStart = 3;
    let userDrop = document.createElement("div")
    let userLogout = document.createElement("div")
    userLogout.innerHTML = "log out"
    topRight.appendChild(userDrop)
    userDrop.appendChild(userLogout)
    userDrop.style.gridColumnStart = 2;
    userDrop.style.gridColumnStart = 3;
    userDrop.style.maxHeight = "50px"
    userDrop.style.display = "grid"
    userDrop.style.gridTemplateRows = "1fr"
    userDrop.style.gridTemplateColumns = "1fr"
    userDrop.style.justifyContent = "end"
    userLogout.style.display = "grid"
    userLogout.style.gridTemplateRows = "1fr"
    userLogout.style.gridTemplateColumns = "1fr"
    userLogout.style.alignItems = "center"
    userLogout.style.width = "150px"
    userLogout.style.maxHeight = "50px"
    userLogout.style.background = "#124"
    userLogout.classList.add("userLogout")
    userDrop.classList.add("userDrop")
    userIcon.classList.add("userIcon")
    main.style.gridRow = "2/3"
    main.style.gridColumn = "1/2"
    topBar.style.gridRow = "1/2"
    topBar.style.gridColumn = "1/2"
    let breadCrumbs = document.createElement("div")
    topBar.appendChild(breadCrumbs)
    let backButton = document.createElement("div")
    breadCrumbs.appendChild(backButton)
    backButton.innerHTML = "< Back"
    backButton.onclick = (e)=>{
        frontPage()
    }
    breadCrumbs.style.display = "none"
    breadCrumbs.classList.add("breadCrumbs")
    main.style.padding = 0
    main.style.margin = 0
    main.innerHTML += "user<br><strong class='username'>"+data.name+"</strong><br><br>"
    main.innerHTML += "last online<br><strong class='lastOnline'>"+new Date(data.lastOnline).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})+"</strong><br><br>"
    let clickedToDeathScoreBox = document.createElement("div")
    main.appendChild(clickedToDeathScoreBox)
    let clickedToDeathLabel = document.createElement("div")
    let clickedToDeathScore = document.createElement("div")
    clickedToDeathScore.style.fontWeight = "bold"
    clickedToDeathScoreBox.appendChild(clickedToDeathLabel)
    clickedToDeathScoreBox.appendChild(clickedToDeathScore)
    clickedToDeathScore.id = "clickScore"
    clickedToDeathLabel.innerHTML = "clicks"
    clickedToDeathScore.style.fontSize = "2rem"
    let clickedToDeathButton = document.createElement("div")
    clickedToDeathButton.innerHTML = "Click Me!"
    clickedToDeathScore.innerHTML = data.count
    clickedToDeathButton.style.background = "#5f5"
    clickedToDeathButton.style.color = "#333"
    clickedToDeathButton.style.padding = "10px"
    main.innerHTML += "<br><br>last click<br><strong class='lastClick'>"+new Date(data.lastTime).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})+"</strong><br><br>"
    main.appendChild(clickedToDeathButton)
    clickedToDeathButton.onclick = (e)=>{
        socket.emit("click",{username: data.name, token: data.token})
    }
    

}