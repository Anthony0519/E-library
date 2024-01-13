const dataBase = require("../model/model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const axios = require('axios');


// create a new user
exports.register = async(req,res)=>{
    try {
        
        // get the users input 
        const {firstName,lastName,email,username,role,password} = req.body

        // check if the email and username already exist
        const emailExist = await dataBase.findOne({email});
        const usernameExist = await dataBase.findOne({userName:username})

        // throw response 
        if (emailExist) {
            return res.status(400).json({
                error: "email already exist"
            })
        }
        if (usernameExist) {
            return res.status(400).json({
                error:"username already exist"
            })
        }

        // hash the password
        const saltPass = bcrypt.genSaltSync(12)
        const hashPass = bcrypt.hashSync(password,saltPass)

        // register the user
        const register = await dataBase.create({
            firstName,
            lastName,
            email,
            userName:username,
            role,
            password:hashPass
        })

        // throw a success message 
        res.status(201).json({
            message: "user created successfully",
            register
        })

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.login = async(req,res)=>{
    try{

        // get the requirement for login 
        const {emailOrUsername,password} = req.body

        // check if the user exsists
        const checkExists = await dataBase.findOne({$or:[{email:emailOrUsername}, {userName:emailOrUsername}]})
        if (!checkExists) {
            return res.status(400).json({
                error:"email or username does not exist"
            })
        }

        // check for password
        const checkPass = bcrypt.compareSync(password,checkExists.password)
        if (!checkPass) {
            return res.status(400).json({
                error:"wrong password"
            })
        }

        // generate a token for the user
        const token = jwt.sign({
            userId:checkExists._id,
            email:checkExists.email
        }, process.env.jwtKey, {expiresIn: "1d"})

        // throw a success message
        res.status(200).json({
            message:"logged In successfull",
            token
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.deleteuser = async(req,res)=>{
    try {
        
        // get the id of the person you are deleting
        const id = req.params.id

        // check if the id exist 
        const userExist = await dataBase.findById(id)
        if (!userExist) {
            return res.status(400).json({
                error:"no user with such id"
            })
        }

        // delete the user if the id is correct
        await dataBase.findByIdAndDelete(id)

        res.status(200).json({
            message: "user deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.logOut = async(req,res)=>{
    try {
        
        // get the user token
        const author = req.headers.authorization

        // exstract the token from the bearer
        const token = author.split(" ")[1]

        // get the user by the id
        const user = await dataBase.findById(req.users.userId)
        if (!user) {
            return res.status(400).json({
                error:"user not found"
            })
        }

        user.blackList.push(token)
        await user.save()

        res.status(200).json({
            message: "Successfully logged out"
        })

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.books = async(req,res)=>{
    try {
        
        // get the title from th params
        const title = req.params.title
        // Replace spaces in the title with '+'
        const formattedTitle = title.replace(/ /g, '+');

        // Construct the API URL
        const apiUrl = `https://openlibrary.org/search.json?title=${formattedTitle}`;

        // Use Axios to make a GET request to the Open Library API
        axios.get(apiUrl)
        .then(response => {
            const work = response.data.docs[0]; // Assuming there is a matching work
            if (work && work.ebook_count_i > 0 && work.ebook_access !== 'no_ebook' && work.has_fulltext) {
            // Construct the URL based on the Internet Archive identifier (ia)
            const iaIdentifier = work.ia[0]; // Assuming there is at least one identifier
            const internetArchiveUrl = `https://archive.org/details/${iaIdentifier}`;
            return res.status(200).json({
                book: `You can access the ebook here: ${internetArchiveUrl}`
            })
            } else {
            return res.status(400).json({
                error:'Sorry, the ebook is not available or cannot be accessed.'
            })
            }
        })
        .catch(error => {
            // Handle any errors that may occur during the request
            console.error(error.message);
        });

            } catch (error) {
                res.status(500).json({
                    error:error.message
                })
            }
        }