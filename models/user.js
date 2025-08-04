const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    
    username:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3,'username should be atleast 3 character long']
    },

    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [10,'Enter valid email']
    },
    password:{
        type: String,
        trim: true,    
        minlength: [8,'Passwor should have 8 character']
    }
    
})

const user=mongoose.model('user',userSchema)

module.exports=user; 