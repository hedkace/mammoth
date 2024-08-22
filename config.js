const mongoose = require("mongoose")

const connect = mongoose.connect(process.env.DBP)

connect.then(()=>{
    console.log("Database connected successfully.")
})
.catch(()=>{
    console.log("Database cannot be connected.")
})

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }/*,
    salt: {
        type: String,
        require: true
    }*/
})

const collection = new mongoose.model("users", LoginSchema)

const TokenSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    lastTime: {
        type: Date,
        require: true
    }
})
const tokens = new mongoose.model("tokens", TokenSchema)

const ClickSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    count: {
        type: Number,
        require: true
    },
    lastTime: {
        type: Date,
        require: true
    }
})

const clicks = new mongoose.model("clicks", ClickSchema)
module.exports = { collection, tokens, clicks }
