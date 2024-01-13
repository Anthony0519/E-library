const jwt = require("jsonwebtoken")
const dataBase = require("../model/model")
require("dotenv").config()

exports.authentication = async(req,res,next)=>{
    try {
        
        // get the token 
        const author = req.headers.authorization
        const token = author.split(" ")[1]
        if (!token) {
            return res.status(400).json({
                error: "autherization failed: token not found"
            })
        }

        // validat the token 
        const decodeToken = jwt.verify(token,process.env.jwtKey)

        // get the user with the decoded token
        const user = await dataBase.findById(decodeToken.userId)
        if (!user) {
            return res.status(400).json({
                error:"this token is empty"
            })
        }
        if (user.blackList.includes(token)) {
            return res.status(400).json({
                error:"user logged out"
            })
        }
        if (user.role !== "Admin") {
            return res.status(400).json({
                error: "only admin's can perform this actions"
            })
        }

        req.user = decodeToken
        next()

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.authenticate = async(req,res,next)=>{
    try {
        
        // get the token 
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(400).json({
                error: "autherization failed: token not found"
            })
        }

        // validat the token 
        const decodeToken = jwt.verify(token,process.env.jwtKey)

        // get the user with the decoded token
        const user = await dataBase.findById(decodeToken.userId)
        if (!user) {
            return res.status(400).json({
                error:"this token is empty"
            })
        }
        if (user.blackList.includes(token)) {
            return res.status(400).json({
                error:"user logged out"
            })
        }

        req.users = decodeToken
        next()

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}