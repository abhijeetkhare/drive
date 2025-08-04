const dotenv=require('dotenv')
dotenv.config(); 
const express = require('express')
const app = express()
const port = 3000
const userRouter= require('./routes/user.route')

const connectToDB=require('./config/db')
const cookieParser = require('cookie-parser')
const indexRouter= require('./routes/index.route')




app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/',indexRouter)
app.use('/user',userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
