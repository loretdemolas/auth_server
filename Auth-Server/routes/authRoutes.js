import { Router } from "express";
import User from "../model/user.js";
import  bcrypt  from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../middleware/token.js";
import verifyToken from "../middleware/auth.js";
import {registerValidation, loginValidation } from "../middleware/validation.js"
import { REFRESH_TOKEN_KEY } from "../config/config.js";
import { verify } from "jsonwebtoken";

export const router = Router();


router.post("/register", async (req, res ) => {
    
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10)
    const hashPassword =await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        await user.save()
        res.send({user: user._id})
        
        
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
    

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.token = refreshToken;

    try {
        await user.save()
        
        
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }

    res.json({accessToken:accessToken, refreshToken:refreshToken});

});


router.post("/refresh", async (req, res) => {
    const user = await User.findOne({token: req.body.token});
    if(user.token == null) return res.status(400).send("refresh token doesn't exists");
    const refreshToken = user.token
    verify(refreshToken, REFRESH_TOKEN_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        console.log(err);
        const accessToken = generateAccessToken({_id: user._id});
        res.json({accessToken: accessToken});
      });
    })
   

router.get("/test", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        res.send(user);
    } catch (err) {
        console.log(err);
    }
      
});

router.delete("/logout", async (req, res) => {
    const update = {token: "logged out"};
    const filter = {email: req.body.email}

    await User.findOneAndUpdate(filter, update, {
        new: true
    });
    res.status(200).json({
        success: "success",
        message: "you have been logged out and your token wiped",
    });
})

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
