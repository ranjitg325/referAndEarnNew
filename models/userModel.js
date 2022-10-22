const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      refId: {
        type: Schema.Types.ObjectId,
        ref: "referral",
      },
      
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)