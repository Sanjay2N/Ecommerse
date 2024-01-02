const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const errorController = require('./controllers/error');


const User=require("./models/user");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6593bad74370f6aae0269d94')
    .then(user => {
      req.user =user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(()=>{

//   app.listen(3000);
// })

mongoose.connect("mongodb+srv://sanjay:dFUVJO8vzo0chWvH@cluster0.jkknfem.mongodb.net/shop?retryWrites=true&w=majority")
.then(result=>{
  User.findOne().then(result=>{
    if(!result){
      const user=new User({
        name:"sam",
        email:"s@gmail.com" ,
        cart:{
          items:[]
        }
      })
      user.save();
    }
  })
  
  app.listen(3000);
})
.catch(error=>{
  console.log(error);
})