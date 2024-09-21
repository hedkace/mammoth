//const { json } = require("express")

//const { join } = require("path")

//console.log(localStorage.getItem("ham"))

let coinSymbol = "₡"
//let coinSymbol = "₦"
//let coinSymbol = "€"
let checkSymbol = "✔"
let xSymbol = "✘"


let color0 = "#7d8ea5" // Pale Blue
let color1 = "#75a1b0" //Light Blue Buttons
let colorBrand = "#7d8ea5" //brand blue
let color2 = "#041d39" // Dark Blue
let color3 = "#021020" // Darker Blue
let color4 = "#999" //Light Grey
let color5 = "#686868" //Dark Grey
let color6 = "#1a1a1a"  //Darker Grey
let color7 = "#2ae89" //Green
let color8 = "#ff5555" //Red
let color9 = "#f49b8b" //pale red
let color10 = "#e5b89a" //warning background
let color11 = "#a04910" //warning link


let main = document.querySelector("main")


const socket = io('ws://localhost:5000')

let session = JSON.parse(localStorage.getItem("sessionData"))
if(!session){
    session = {
        name: null,
        token: null,
    }
}


/*
    !!COMMUNICATION!!
*/

socket.on('connect', ()=>{
    socket.emit("checkToken", session)
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
    if(!main) main = document.createElement("main")
    main.innerHTML = ""
    let newdiv = document.createElement("div")
    let logo = document.createElement("img")
    logo.src = "images/mammoth-mark-blue.svg"
    logo.style.height = "50px"
    newdiv.appendChild(logo)
    newdiv.innerHTML += "<br>glhf"
    newdiv.style.color = colorBrand
    main.appendChild(newdiv)
})

socket.on('launch', (data)=>{
    document.body.innerHTML = ""
    session = {name: data.name, token: data.token}
    console.table(session)
    localStorage.setItem("sessionData", JSON.stringify(session))
    setTimeout(frontPage(data),3000)
    
})

socket.on('updateClicks', (data)=>{
    let clickScore = document.querySelector("#clickScore")
    if(clickScore) clickScore.innerHTML = data.count
    let lastOnline = document.querySelector(".lastOnline")
    let lastClick = document.querySelector(".lastClick")
    lastOnline.innerHTML = new Date(data.lastOnline).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})
    lastClick.innerHTML = new Date(data.lastTime).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})
    
    let newTable = document.querySelector(".clickTable")
    if(!newTable) {
        newTable = document.createElement("div")
        newTable.classList.add("clickTable")
    }
    else{
        newTable.innerHTML = ""
    }
    data.allClicks.sort((a,b)=>parseInt(b.count)-parseInt(a.count)).forEach(item => {
        let newRow = document.createElement("div")
        let rowName = document.createElement("div")
        let rowClicks = document.createElement("div")
        rowName.innerHTML = item.name
        rowClicks.innerHTML = item.count
        newRow.appendChild(rowName)
        newRow.appendChild(rowClicks)
        newTable.appendChild(newRow)
        newRow.style.display = "grid"
        newRow.style.gridTemplateColumns = "5fr 1fr"
        rowName.style.border = "1px solid "+color1
        rowClicks.style.border = "1px solid "+color1
        newRow.style.gap = "4px"
        if(item.name == session.name) newRow.style.background = color2
    })
    let main = document.querySelector("main")
    main.appendChild(newTable)
})

socket.on('clikt2Deth', (data)=>{
    clikt2Deth(data)
})

socket.on('games', (data)=>{
    gamesPage(data)
})
socket.on('gameLobby', (data)=>{
    console.table(data)
    gameCreationPage(data)
})


/*
    !!PAGE BUILDERS!!
*/

let loginPage = ()=>{
    console.log("load login page")
    let main = document.querySelector("main")
    let pageTitle = document.querySelector(".pageTitle")
    if(pageTitle){
        pageTitle.remove()
        let pageWrapper = document.querySelector(".pageWrapper")
        pageWrapper.remove()
    } 
    if(document.querySelector("main")){
        console.log(document.body.children.length)
        main.innerHTML = ""
    }
    else{
        document.body.innerHTML = ""
        main = document.createElement("main")
        document.body.appendChild(main)
    }
    let topBar = document.querySelector(".topBar")
    if(topBar){
        topBar.remove()
    }
    let backButton = document.querySelector(".backButton")
    if(backButton){
        backButton.remove()
    }
    document.body.style.display = "grid"
    document.body.style.gridTemplateRows = "1fr"
    document.body.style.gridTemplateColumns = "1fr"
    document.body.style.alignItems = "center"
    document.body.style.justifyItems = "center"
    let branding = document.createElement("div")
    branding.classList.add("branding")
    branding.innerHTML = "Mammoth"
    document.body.appendChild(branding)
    let backgroundVideo = document.querySelector(".backgroundVideo")
    if (backgroundVideo){

    } 
    else{
        backgroundVideo = document.createElement("div")
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
    }
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
    label = document.createElement("label")
    label.innerHTML = "Email address"
    field = document.createElement("input")
    field.type = "text"
    field.placeholder = "Enter your school email address"
    field.id = "email"
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
    document.body.innerHTML = ""
    document.body.style.display = "block"
    let main = document.querySelector("main") //select main div
    if(!main) main = document.createElement("main") //create new main if it does not exist
    let topBar = document.createElement("div") //add top bar
    document.body.appendChild(topBar)
    topBar.classList.add("topBar")
    topBar.style.display = "grid"
    topBar.style.gridTemplateColumns = "1fr 1fr 1fr"
    topBar.style.gridTemplateRows = "1fr"
    topBar.style.height = "40px"
    topBar.style.alignItems = "center"
    let branding = document.createElement("div")
    let mark = document.createElement("img")
    let logo = document.createElement("div")
    mark.classList.add("mark")
    logo.classList.add("logo")
    topBar.appendChild(branding)
    branding.appendChild(mark)
    mark.src = "images/mammoth-mark-blue.svg"
    branding.appendChild(logo)
    branding.style.display = "grid"
    branding.style.gridTemplateColumns = "40px 1fr"
    branding.style.gridTemplateRows = "1fr"
    branding.style.alignItems = "center"
    branding.style.height = "40px"
    branding.style.padding = "20px"
    mark.style.width = "30px"
    logo.innerHTML = "MAMMOTH"
    logo.style.fontWeight = 700
    logo.style.color = colorBrand
    logo.style.fontSize = "1.3rem"
    //top middle
    let topMiddle = document.createElement("div")
    topBar.appendChild(topMiddle)
    //top right - user menu
    let topRight = document.createElement("div")
    topBar.appendChild(topRight)
    topRight.style.display = "grid"
    topRight.style.gridTemplateColumns = "1fr 80px 50px 48px"
    topRight.style.gridTemplateRows = "1fr"
    let topRightSpacer = document.createElement("div")
    topRight.appendChild(topRightSpacer)
    let logoutButton = document.createElement("div")
    logoutButton.classList.add("logoutButton")
    topRight.appendChild(logoutButton)
    topRight.style.fontSize = "1.1rem"
    topRight.style.fontWeight = "normal"
    topRight.style.alignItems = "center"
    topRight.style.margin = "20px"
    logoutButton.style.color = color5
    logoutButton.innerHTML = "log out"
    logoutButton.style.gridColumn = "2/3"
    logoutButton.onclick = (e)=>{
        session.token = null
        localStorage.setItem("sessionData", JSON.stringify(session))
        loginPage()
    }
    let mailIcon = document.createElement("img")
    mailIcon.classList.add("mailIcon")
    topRight.appendChild(mailIcon)
    mailIcon.src= "images/mail icon.png"
    mailIcon.style.width = "30px"
    mailIcon.style.gridColumn = "3/4"
    mailIcon.style.gridRow = "1/2"
    mailIcon.style.display = "none"
    let userIcon = document.createElement("img")
    userIcon.classList.add("userIcon")
    userIcon.src = "images/avatar1m.png"
    userIcon.style.gridColumn = "4/5"
    userIcon.style.display = "none"
    topRight.appendChild(userIcon)
    userIcon.style.width = "48px"
    let mailNotification = document.createElement("div")
    mailNotification.innerHTML = "3"
    mailNotification.classList.add("mailNotification")
    topRight.appendChild(mailNotification)
    mailNotification.style.gridColumn = "3/4"
    mailNotification.style.gridRow = "1/2"
    mailNotification.style.marginLeft = "20px"
    mailNotification.style.marginTop = "-25px"
    mailNotification.style.background = color8
    mailNotification.style.width = "16px"
    mailNotification.style.height = "16px"
    mailNotification.style.borderRadius = "8px"
    mailNotification.style.display = "grid"
    mailNotification.style.gridTemplateRows = "1fr"
    mailNotification.style.gridTemplateRowColumns = "1fr"
    mailNotification.style.alignContent = "center"
    mailNotification.style.justifyContent = "center"
    mailNotification.style.color = "white"
    mailNotification.style.fontSize = "8pt"
    mailNotification.style.display = "none"
    //alert ribbon
    let alertRibbon = document.createElement("div")
    document.body.appendChild(alertRibbon)
    alertRibbon.style.background = color9
    alertRibbon.innerHTML = "check your email and click the link to unlock your account"
    alertRibbon.style.textAlign = "center"
    alertRibbon.style.padding = "20px"
    alertRibbon.style.color = "#333"
    alertRibbon.style.fontWeight = 400
    alertRibbon.style.margin = "60px 0 20px 0"
    alertRibbon.style.display = "none"
    //page wrapper
    let pageWrapper = document.createElement("div")
    pageWrapper.classList.add("pageWrapper")
    document.body.appendChild(pageWrapper)
    pageWrapper.style.display = "grid"
    pageWrapper.style.gridTemplateColumns = "1fr"
    pageWrapper.style.gridTemplateRows = "1fr"
    pageWrapper.style.justifyContent = "center"
    pageWrapper.style.alignItems = "center"
    //back button
    let backButton = document.createElement("div")
    pageWrapper.appendChild(backButton)
    backButton.innerHTML = "< Back"
    backButton.style.color = color5
    backButton.style.display = "block"
    backButton.classList.add("backButton")
    backButton.style.marginLeft = "20px"
    backButton.style.marginTop = 0
    if(alertRibbon.style.display == "none") backButton.style.marginTop = "30px"
    backButton.style.display = "none"
    backButton.onclick = (e) =>{
        frontPage({name: data.name, token: data.token})
    }
    //page title
    let pageTitle = document.createElement("div")
    pageTitle.classList.add("pageTitle")
    pageWrapper.appendChild(pageTitle)
    pageTitle.style.fontSize = "1.4rem"
    pageTitle.innerHTML = "Front Page"
    pageTitle.style.textAlign = "center"
    pageTitle.style.margin = "20px"
    pageTitle.style.fontWeight = 600
    //main content
    pageWrapper.appendChild(main)
    main.style.margin = "0 auto"
    main.style.width = "600px"
    main.style.display = "grid"
    let welcome = document.createElement("p")
    welcome.innerHTML = "Welcome, <strong>"+data.name+"</strong>!"
    welcome.style.textAlign = "left"
    welcome.style.width = "100%"
    let lastOnline = document.createElement("p")
    lastOnline.innerHTML = "last online: <strong>"+new Date(data.lastOnline).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})+"</strong>"
    lastOnline.style.textAlign = "left"
    lastOnline.style.width = "100%"
    lastOnline.style.fontSize = ".95rem"
    lastOnline.style.color = "color5"
    main.appendChild(welcome)
    main.appendChild(lastOnline)
    let mainNav = document.createElement("div")
    main.appendChild(mainNav)
    mainNav.style.display = "grid"
    mainNav.style.gridTemplateRows = "1fr"
    mainNav.style.color = color6
    mainNav.style.gap = "10px" 
    mainNav.style.fontWeight = 400
    //main nav buttons
    //clicked to death
    let mainNavButton = document.createElement("div")
    mainNavButton.innerHTML = "Clikt 2 Deth"
    mainNavButton.style.background = color1
    mainNavButton.style.display = "grid"
    mainNavButton.style.alignItems = "center"
    mainNavButton.style.justifyContent = "center"
    mainNav.style.margin = "20px"
    mainNavButton.style.width = "550px"
    mainNavButton.style.padding = "14px"
    mainNav.appendChild(mainNavButton)
    mainNavButton.classList.add("clikt")
    //marketplace
    /*mainNavButton = document.createElement("div")
    mainNavButton.innerHTML = "Marketplace"
    mainNavButton.style.background = color5
    mainNavButton.style.display = "grid"
    mainNavButton.style.alignItems = "center"
    mainNavButton.style.justifyContent = "center"
    mainNav.style.margin = "20px"
    mainNavButton.style.width = "550px"
    mainNavButton.style.padding = "14px"
    mainNav.appendChild(mainNavButton)*/
    //NFTs
    mainNavButton = document.createElement("div")
    mainNavButton.innerHTML = "NFTs"
    mainNavButton.style.background = color5
    mainNavButton.style.display = "grid"
    mainNavButton.style.alignItems = "center"
    mainNavButton.style.justifyContent = "center"
    mainNav.style.margin = "20px"
    mainNavButton.style.width = "550px"
    mainNavButton.style.padding = "14px"
    mainNav.appendChild(mainNavButton)
    mainNavButton.classList.add("nfts")
    //Games
    mainNavButton = document.createElement("div")
    mainNavButton.innerHTML = "Games"
    mainNavButton.style.background = color1
    mainNavButton.style.display = "grid"
    mainNavButton.style.alignItems = "center"
    mainNavButton.style.justifyContent = "center"
    mainNav.style.margin = "20px"
    mainNavButton.style.width = "550px"
    mainNavButton.style.padding = "14px"
    mainNav.appendChild(mainNavButton)
    mainNavButton.classList.add("games")
    mainNavButton.onclick = (e)=>{
        socket.emit("games", {name: session.name, token: session.token})
    }
    //Polaris
    mainNavButton = document.createElement("div")
    mainNavButton.innerHTML = "Polaris Quiz"
    mainNavButton.style.background = color5
    mainNavButton.style.display = "grid"
    mainNavButton.style.alignItems = "center"
    mainNavButton.style.justifyContent = "center"
    mainNav.style.margin = "20px"
    mainNavButton.style.width = "550px"
    mainNavButton.style.padding = "14px"
    mainNav.appendChild(mainNavButton)
    mainNavButton.classList.add("polaris")
    //Links
    mainNavButton = document.createElement("div")
    mainNavButton.innerHTML = "Links"
    mainNavButton.style.background = color5
    mainNavButton.style.display = "grid"
    mainNavButton.style.alignItems = "center"
    mainNavButton.style.justifyContent = "center"
    mainNav.style.margin = "20px"
    mainNavButton.style.width = "550px"
    mainNavButton.style.padding = "14px"
    mainNav.appendChild(mainNavButton)
    mainNavButton.classList.add("links")

    let clikt = document.querySelector(".clikt")
    clikt.onclick = (e)=>{
        socket.emit("clikt2Deth",{
            name: session.name,
            token: session.token
        })
    }
    

}

let gamesPage = (data) => {
    let backButton = document.querySelector(".backButton")
    backButton.style.display = "block"
    backButton.onclick = (e) =>{
        frontPage({name: data.name, token: data.token})
    }
    let pageTitle = document.querySelector(".pageTitle")
    pageTitle.innerHTML = "Games"
    let main = document.querySelector("main")
    main.innerHTML = ""
    let newLabel = document.createElement("div")
    let newWrapper = document.createElement("div")
    main.appendChild(newLabel)
    newLabel.style.fontSize = "2rem"
    newLabel.innerHTML = "Create A Game"
    main.appendChild(newWrapper)
    newWrapper.style.display = "grid"
    newWrapper.style.gridTemplateColumns = "1fr 1fr 1fr"
    newWrapper.style.gap = "8px"
    let newButton = document.createElement("div")
    newWrapper.appendChild(newButton)
    newButton.innerHTML = "RPS"
    newButton.style.padding = "10px"
    newButton.onclick = (e)=>{
        console.log("createRPS clicked")
        socket.emit("createRPS", {name: session.name, token: session.token})
    }
    newButton.style.background = color1
    newButton.style.color = color3
    newButton = document.createElement("div")
    newWrapper.appendChild(newButton)
    newButton.innerHTML = "Poker"
    newButton.style.padding = "10px"
    newButton.onclick = (e)=>{}
    newButton.style.background = color4
    newButton.style.color = color6
    newButton = document.createElement("div")
    newWrapper.appendChild(newButton)
    newButton.innerHTML = "WIP"
    newButton.style.padding = "10px"
    newButton.onclick = (e)=>{}
    newButton.style.background = color4
    newButton.style.color = color6
    newWrapper.style.marginBottom = "20px"
    newLabel = document.createElement("div")
    newWrapper = document.createElement("div")
    main.appendChild(newLabel)
    newLabel.style.fontSize = "2rem"
    newLabel.innerHTML = "Join A Game"
}


let gameCreationPage = (data) => {
    console.table(data)
    let backButton = document.querySelector(".backButton")
    backButton.style.display = "block"
    backButton.onclick = (e)=>{
        socket.emit("games", {name: session.name, token: session.token})
    }
    let pageTitle = document.querySelector(".pageTitle")
    pageTitle.innerHTML = data.gameName
    let main = document.querySelector("main")
    main.innerHTML = ""
    let newLabel = document.createElement("div")
    let newWrapper = document.createElement("div")
    main.appendChild(newLabel)
    newLabel.style.fontSize = "1.4rem"
    newLabel.innerHTML = "game: <strong>"+data.gameCode+"</strong><br>"
    newLabel.innerHTML += "type: <strong>"+data.gameType+"</strong><br>"
    main.appendChild(newWrapper)
    let newDetail = document.createElement("div")

}


let clikt2Deth= (data) =>{
    let backButton = document.querySelector(".backButton")
    backButton.style.display = "block"
    let pageTitle = document.querySelector(".pageTitle")
    pageTitle.innerHTML = "Clikt 2 Deth"
    let main = document.querySelector("main")
    main.innerHTML = ""
    main.innerHTML += "user<br><strong class='username'>"+data.name+"</strong><br><br>"
    main.innerHTML += "last active<br><strong class='lastOnline'>"+new Date(data.lastOnline).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})+"</strong><br><br>"
    document.querySelector(".username").style.fontSize = "1.8rem"
    document.querySelector(".lastOnline").style.fontSize = "1.8rem"
    let clickedToDeathScoreBox = document.createElement("div")
    main.appendChild(clickedToDeathScoreBox)
    let clickedToDeathLabel = document.createElement("div")
    let clickedToDeathScore = document.createElement("div")
    clickedToDeathScore.style.fontWeight = "bold"
    clickedToDeathScoreBox.appendChild(clickedToDeathLabel)
    clickedToDeathScoreBox.appendChild(clickedToDeathScore)
    clickedToDeathScoreBox.style.margin = "20px"
    clickedToDeathScore.id = "clickScore"
    clickedToDeathLabel.innerHTML = "clicks"
    clickedToDeathScore.style.fontSize = "3rem"
    let clickedToDeathButton = document.createElement("div")
    clickedToDeathButton.innerHTML = "Click Me!"
    clickedToDeathScore.innerHTML = data.count
    clickedToDeathButton.style.background = "#5f5"
    clickedToDeathButton.style.color = "#333"
    clickedToDeathButton.style.padding = "10px"
    clickedToDeathButton.style.margin = "20px"
    main.innerHTML += "<br><br>last click<br><strong class='lastClick'>"+new Date(data.lastTime).toLocaleString('en-US',{timeZone: 'America/Chicago', timeZoneName: 'short'})+"</strong><br><br>"
    document.querySelector(".lastClick").style.fontSize = "1.8rem"
    main.appendChild(clickedToDeathButton)
    clickedToDeathButton.onclick = (e)=>{
        socket.emit("click",{username: data.name, token: data.token})
    }
    let newTable = document.querySelector("clickTable")
    if(!newTable) {
        newTable = document.createElement("div")
        newTable.classList.add("clickTable")
    }
    else{
        newTable.innerHTML = ""
    }
    data.allClicks.sort((a,b)=>parseInt(b.count)-parseInt(a.count)).forEach(item => {
        let newRow = document.createElement("div")
        let rowName = document.createElement("div")
        let rowClicks = document.createElement("div")
        rowName.innerHTML = item.name
        rowClicks.innerHTML = item.count
        newRow.appendChild(rowName)
        newRow.appendChild(rowClicks)
        newTable.appendChild(newRow)
        newRow.style.display = "grid"
        newRow.style.gridTemplateColumns = "5fr 1fr"
        rowName.style.border = "1px solid "+color1
        rowClicks.style.border = "1px solid "+color1
        newRow.style.gap = "4px"
        if(item.name == data.name) newRow.style.background = color2
    })
    main.appendChild(newTable)
}