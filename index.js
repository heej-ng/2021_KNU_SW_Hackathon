const express = require('express');
const expressSession = require('express-session')

const app = new express()
const ejs = require('ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))

const mongoose = require('mongoose');
const dbAddress = "mongodb+srv://whghtjd320:jhs2430570@cluster0.ylrcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(dbAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const bcrypt = require('bcrypt')
const User = require('./models/User')

const mainController = require('./controllers/main')

const logoutController = require('./controllers/logout')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const storeUserController = require('./controllers/storeUser')
const newUserController = require('./controllers/newUser')

const redirectIfNotAuthMiddleware = require('./middleware/redirectIfNotAuthMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const validateMiddleWare = require('./middleware/validationMiddleware')
const authMiddleware = require('./middleware/authMiddleware')

app.use(expressSession({
  resave: true,
  saveUninitialized: true,
  secret:'keyboard cat'
}))

let port = process.env.PORT
if (port == null || port == "") {
  port = 9000
}

app.listen(port, ()=>{
  console.log('App listening ...')
})

app.use("*", (req, res, next)=>{
  loggedIn = req.session.userId;
  next()
})

// 로그인, 회원가입
app.get('/auth/logout', redirectIfNotAuthMiddleware, logoutController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.post("/users/login", (req, res) => {
  const {name, password} = req.body
  console.log(req.body)
  User.findOne({name:name}, (error, user) =>{
      if(user){
          bcrypt.compare(password, user.password, (error, same)=>{
              if(same){
                  req.session.userId = user._id
                  req.session.userName = user.name
                  if(!req.session.returnTo) res.redirect('/')
                  else res.redirect(req.session.returnTo)
              }
              else{
                  res.redirect('/auth/login')
              }
          })
      }
      else{
          res.redirect('/auth/login')
      }
  })
});

//main pages
app.get('/', mainController)

app.all('*', (req, res)=>{
  res.render('404Page')
})
