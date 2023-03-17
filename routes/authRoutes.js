import { Router } from "express";
import User from "../model/user.js";
import  bcrypt  from "bcryptjs";
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/config.js';
import verifyToken from "../middleware/auth.js";
import pkg, { verify } from "jsonwebtoken";
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
        const result = await user.save()
            res.send({user: user._id})
            console.log(result);
        
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});
router.post("/login", async (req, res) => {
   
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email doesn't exists");
    console.log(user)

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.token = refreshToken;

    res.json({accessToken:accessToken, refreshToken:refreshToken});

});

function generateAccessToken(user) {
    return sign({_id: user._id}, TOKEN_KEY, { expiresIn: "15s" });
}

function generateRefreshToken(user) {
    return sign({_id: user._id}, REFRESH_TOKEN_KEY);
}
router.post("/refresh", (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
    verify(refreshToken, REFRESH_TOKEN_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({_id: user._id});
        res.json({accessToken: accessToken});
    });
});

router.get("/test", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ "email": req.body.email});
        res.send(user);
        console.log(user);
    } catch (err) {
        console.log(err);
    }
      
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
