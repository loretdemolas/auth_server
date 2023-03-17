import { Router } from "express";
import User from "../model/user.js";
import  bcrypt  from "bcryptjs";
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/config.js';
import verifyToken from "../middleware/auth.js";
import pkg from "jsonwebtoken";
import {registerValidation, loginValidation } from "../middleware/validation.js"

export const router = Router();

const { sign } = pkg;

router.post("/register", async (req, res ) => {
    
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10)
    const hashPassword =await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});
router.post("/login", async (req, res) => {
   
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email doesn't exists");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const token = sign(
        {_id: user._id}, 
        TOKEN_KEY,
        {
            expiresIn: "5m"
        }
    );
    res.header("auth-token", token).send(token);

});
router.post("/refresh", () => {});

router.get("/test", verifyToken, (req, res) => {
    res.status(200).send("access granted!");
  });


router.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});
