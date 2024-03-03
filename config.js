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
module.exports = collection