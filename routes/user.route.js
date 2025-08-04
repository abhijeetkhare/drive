const express=require('express')
const router=express.Router()
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register',body('email').trim().isEmail(),
body('password').trim(),
async (req,res)=>{

    

    const {email, username, password}=req.body;
    const hashPassword= await bcrypt.hash(password,10);

    const newUser = await userModel.create({
        email,
        username,
        password:hashPassword,

    })
    
    res.redirect('/user/login');
    console.log("New User Created:", {
        email: newUser.email,
        username: newUser.username,
    });
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',body('password').trim(),
async (req,res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array(),
            messsage: "Invalid data"
        })
    }
    const{username ,password}=req.body;
    const user=await userModel.findOne({
        username: username
    })
    if(!user){
        return res.status(400).json({
            messsage: "Invalid username or password"
        })
    }
    const isMatch= await bcrypt.compare(password,user.password)

     if(!isMatch){
        return res.status(400).json({
            messsage: "Invalid username or password"
        })
    }
    const token= jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
    },process.env.Secretkey)
    
    res.cookie('token',token)

    res.redirect('../home');
})



module.exports=router;