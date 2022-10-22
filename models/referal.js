const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReferralSchema = new Schema({
    referalCode: {
        type: String,
        //required: true,
        unique: true,
        default: function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    applyReferalCode: {
        type: String,
        //required: true,
        //unique: true
        default: null
    },
    referalPoint: {     //referalPoint : 100 referal point = 100 diamond
        type: Number,
        default: 0
    },
    isClicked: {     //it means if user click on apply referal code and redeem benefits then it will be true
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('referral', ReferralSchema)