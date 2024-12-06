const express=require('express');
const router= express.Router();
const User=require('../models/user');
const path =require('path');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');



router.get('/login',function(req,res){
  
  res.render('login')
})

router.post('/create',(req,res)=>{
  let{username,email,password}=req.body
  bcrypt.genSalt(10,(err,salt)=>{
   bcrypt.hash(password,salt,async(err,hash)=>{
 let createdUser=await User.create({
       username,
       email,
       password:hash,
     })
     let token=jwt.sign({email},"shhhhh")
     res.cookie("token",token)

     res.redirect("/auth/sign")
  })
})
})
router.get('/logout',(req,res)=>{
res.cookie("token","");
res.redirect('/login');  
})

router.get('/sign',(req,res)=>{
res.render('sign');  
})

router.post('/sign',async (req,res)=>{
let user=await User.findOne({email:req.body.email})  
// console.log(user)
if(!user)
  res.send("Invalid email or password")

bcrypt.compare(req.body.password,user.password,function(err,result){
res.redirect('/')
})
})


module.exports = router;