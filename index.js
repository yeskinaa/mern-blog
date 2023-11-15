import express from 'express'
import mongoose from 'mongoose'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'

import checkAuth from './utils/checkAuth.js'

import * as UserController from './controller/UserController.js'
import * as PostController from './controller/PostContoller.js'

const app = express();
const port = 4445

app.use(express.json())

mongoose
    .connect("mongodb+srv://yeskina_anna:r9uvb83b@cluster0.5wkcdvr.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => console.log("DB is OK!"))
    .catch((err) => console.log("DB is error!", err))

app.get('/', (req,res) => {
    res.send("Check information in the Insomnia")
})

//Реєстрація
app.post('/auth/register', registerValidation, UserController.register)

//Авторизація
app.post('/auth/login', loginValidation, UserController.login)

//Отримання інформації про користувача
app.get('/auth/user-info', checkAuth, UserController.userInfo)

//-------------
// app.get('./posts/:id', PostContoller.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.delete('./posts', PostContoller.remove)
// app.patch('./posts', PostContoller.update)

app.listen(port, (err) => {
    if (err) {
       return console.log(err)
    }
    console.log(`The server is running on port ${port}`)
})

