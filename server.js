const express = require("express")
const mongoose = require("mongoose")
const router  = require("./router/router")

const app = express()
app.use(express.json())
app.use(router)

require("dotenv").config()
const port = process.env.port
const dbLink = process.env.pass

mongoose.connect(dbLink).then(()=>{
    console.log('dataBase connected');

    app.listen(port, ()=>{
        console.log(`server on port: ${port}`);
    })
})