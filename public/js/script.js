//console.log(localStorage.getItem("ham"))
let main = document.querySelector("main")


const socket = io('ws://localhost:5000')

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
    main.innerHTML = ""
    let newdiv = document.createElement("div")
    newdiv.innerHTML = "glhf"
    main.appendChild(newdiv)
})

socket.on('launch', (data)=>{
    document.body.innerHTML = ""
    main = document.createElement("main")
    document.body.appendChild(main)
})



let loginPage = ()=>{
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
    button.onclick = (e)=>{
        const data = {username:document.querySelector("#username").value,password:document.querySelector("#password").value}
        console.log(data)
        socket.emit("login",data)
    }
    main.appendChild(button)
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

    
}
let signupPage = ()=>{
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