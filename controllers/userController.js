const userModel = require("../models/userModel")
const referralModel = require("../models/referal")
const bcrypt = require("bcrypt")

// user create
exports.userCreate = async (req, res) => {
    try {
        let { fullname, email, password, refId } = req.body
        const user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            fullname,
            email,
            password,
            refId
        })
        const userCreated = await newUser.save()
        if (userCreated) {
            return res.status(201).json({ message: "User created successfully", data: userCreated })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

//user login and generate referal code
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const refCode = await referralModel.findOne({ userId: user._id })
        if (refCode) {
            return res.status(200).json({ message: "User login successfully", refCode })
        }
        const newRefCode = new referralModel({
            userId: user._id
        })
        const refCodeCreated = await newRefCode.save()
        if (refCodeCreated) {
            return res.status(200).json({ message: "User login successfully", refCodeCreated })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


exports.applyReferalCode = async (req, res) => {
    try {
        let { userId, applyReferalCode } = req.body
        const user = await referralModel.findOne({ userId })
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })
        }
        const userReferCode = await referralModel.findOne({ referalCode: applyReferalCode })
        if (!userReferCode) {
            return res.status(400).send({ message: "Invalid referral code" });
        }
        const userData = await referralModel.findOneAndUpdate({ userId: req.body.userId }, { applyReferalCode: applyReferalCode }, { new: true })

        if (userData.referalCode === applyReferalCode) {
            return res.status(400).send({ message: "you can't apply your own referral code" });
        }

        if (userData.isClicked === false) {
            const userPoint = await referralModel.findOneAndUpdate({ userId: req.body.userId }, { $inc: { referalPoint: 200 }, $set: { isClicked: true } }, { new: true })
            
            if (userReferCode.referalPoint < 40000) {
                const referCodePoint = await referralModel.findOneAndUpdate({ referalCode: applyReferalCode }, { $inc: { referalPoint: 500 } }, { new: true })
                return res.status(200).json({ message: "Referal code applied successfully", userPoint, referCodePoint })
            }
            return res.status(200).json({ message: "Referal code applied successfully", userPoint })
        
        } else {
            return res.status(400).send({ message: "you already used the benefit of referral code" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getReferalCode = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await referralModel.findOne({ userId }).select("referalCode")
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })
        }
        return res.status(200).json({ message: "Referal code", user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getReferalPoint = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await referralModel.findOne({ userId }).select("referalPoint")
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })
        }
        return res.status(200).json({ message: "Referal point", user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.redeemReferalPoint = async (req, res) => {
    try {
        const { userId, redeemPoint } = req.body
        const user = await referralModel.findOne({ userId })
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })
        }
        if (user.referalPoint < redeemPoint) {
            return res.status(400).json({ message: "You don't have enough point to redeem" })
        }
        user.referalPoint = user.referalPoint - redeemPoint
        const userUpdated = await user.save()
        if (userUpdated) {
            return res.status(200).json({ message: "Referal point redeemed successfully", userUpdated })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
