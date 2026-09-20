import UserModel from "../models/user.model.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js"

async function register(req, res) {
    const { username, email, password } = req.body;
    console.log(req.body)

    const isAlreadyRegistered = await UserModel.findOne({
        $or: [
            { username }, { email }
        ]
    })
    if (isAlreadyRegistered) {
        res.status(409).json({ message: "username and email already register" })
    }
    const hasPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await UserModel.create({
        username,
        email,
        password: hasPassword
    });

    const accessToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    }
    )
    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 1000

    })

    res.status(201).json({
        message: "user registerd successfully",
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
    })

}
async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "token not found"
        })
    }
    const decoded = jwt.verify(token, config.JWT_SECRET)
    //  console.log(decoded)
    const user = await UserModel.findById(decoded.id)

    res.status(200).json({
        message: "user fetched successfully",
        user:
        {
            username: user.username,
            email: user.email
        }
    })
}

async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "refresh token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })
    
    const newRefreshToken = jwt.sign({
        id:decoded.id
    }, config.JWT_SECRET,
    {
        expiresIn : "7d"
    })

    res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite :"strict",
        maxAge : 7*24*60*60*1000
    })
    
    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 1000

    // })

    res.status(200).json({
        message:"Access token refreshed successfully",
        accessToken
    })
}

export { register, getMe, refreshToken }