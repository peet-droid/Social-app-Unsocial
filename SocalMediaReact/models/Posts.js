const mongoose = require('mongoose')


const PostSchema = mongoose.Schema({
        userId: {
                type: String,
                required: true,
        },
        desc: {
                type: String,
                maxLength:500,
        },
        img: {
                type: String,
        },
        
        likeE: {
                type: Array,
                default:[]
        },
        
},
{timestamps: true}
)

module.exports = mongoose.model("posts", PostSchema, "posts")