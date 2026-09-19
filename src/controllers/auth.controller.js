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

    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "1d"
    }
    )
    res.status(201).json({
        message: "user registerd successfully",
        user: {
            username: user.username,
            email: user.email
        },
        token
    })

}

export default register;