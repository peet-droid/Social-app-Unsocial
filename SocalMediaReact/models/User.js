const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
        username: {
                type: String,
                require: true,
                unique: true,
                minLength:3,
                maxLength:20
        },
        email: {
                type: String,
                require: true,
                maxLength:50,
                unique: true,
        },
        password: {
                type: String,
                require: true,
                minLength:6
        },
        profilePicture: {
                type: String,
                default:""
        },
        coverPicture: {
                type: String,
                default:""
        },

        follows :{
                type: Array,
                default:[]
        },

        followers: {
                type: Array,
                default:[]
        },
        isAdmin: {
                type: Boolean,
                default:false
        },
        Posts: {
                type: Array,
                default: []
        }
        
},
{timestamps: true}
)

module.exports = mongoose.model("User", UserSchema,"users")