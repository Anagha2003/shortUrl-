const express= require('express')
const mongoose= require('mongoose')
const cookieParser = require('cookie-parser');
const path = require('path');
const ShortUrl= require('./models/shortUrl')
const authmiddleware=require('./middleware/authmiddleware')
const app = express()

const authRoutes = require('./routes/auth');



mongoose.connect('mongodb://127.0.0.1:27017/short-url2')
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}))
app.use(express.json());
app.use(cookieParser());



app.use('/auth', authRoutes);

app.get('/',async(req,res)=>{
  const shortUrls=await ShortUrl.find()
  res.render('index',{shortUrls: shortUrls})
})

app.post('/shortUrls', authmiddleware, async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullurl });
    console.log("Short URL created successfully by user:", req.user.email);
    res.redirect('/');
  } catch (err) {
    console.error("Error creating short URL:", err.message);
    res.status(500).send("Internal Server Error");
  }
});



app.get('/:shortUrl',async(req,res)=>{
  const shortUrl= await ShortUrl.findOne({short: req.params.shortUrl})
  if(shortUrl==null){
    return res.sendStatus(404)
  }
    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full) 
  
   
})
app.listen(process.env.PORT || 5000);