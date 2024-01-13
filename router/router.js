const router = require("express").Router()
const { register, login, logOut, deleteuser, books } = require("../controller/controller")
const { authentication, authenticate } = require("../middleware/authentication")

router.post("/register-user",register)
router.post("/login-user", login)
router.post("/logout-user",authenticate, logOut)
router.delete("/delete-user/:id",authentication,deleteuser)
router.get("/get-book/:title", authenticate,books)

module.exports = router