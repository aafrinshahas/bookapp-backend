const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const UserModel = require('./models/User')
const port = process.env.PORT;
const app = express();
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended: true}))


//Database

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log('database connected')})
.catch(()=>{console.log('connection error')})

app.post('/signin', (req, res)=>{
    const {username, password} = req.body
    UserModel.findOne({username: username})
    .then((user)=>{
        if(user){
            if(user.password == password){
                res.json('success')
            }
            else{
                res.json('the password is incorrect')
            }
        }else{
            res.json('data not found')
        }
    })
})

app.post('/signup', (req, res)=>{
    const {username, password} = req.body
    const data = {
        username: username,
        password: password
    }

    UserModel.findOne({username: username})
    .then((user)=>{
        if(user){
            res.json('success')
        }else{
            if(password !== '' && username !== ''){
                res.json('not found')
                UserModel.insertMany([data])
            }
           
        }
    })
})


app.post('/login', (req, res)=>{
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.listen(port, ()=>{
    console.log('server started')
})