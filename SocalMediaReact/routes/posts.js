const router = require('express').Router()
const { raw } = require('express')
const posts = require('../models/Posts')
const User = require('../models/User')
const bcrypt  = require('bcrypt')

const getId = async (username) => {
        const user = await User.findOne({ username: username})
        if(user){
                return user.id
        }

        else{
                return user
        }
        
}

//New Post

router.post('/newpost', async (req, res) => {
        id = await getId(req.body.username)

        console.log(id)

        if(id){
                const newpost = new posts({
                        userId : id,
                        desc : req.body.desc,
                        img : req.body.img,
                })

                const savedpost = await newpost.save()

                const user = await User.findOne({username: req.body.username})

                user.Posts.push(savedpost.id)

                User.findByIdAndUpdate(user.id, {$set : user}, (err,user) => {
                        if(err){
                                res.status(405).send("Cant Update User")
                        }
                        else{
                                res.status(200).send(savedpost.id)
                        }
                })

                
        }
        else{
                res.status(402).send("User not found")
        }
})


//Delete a post

router.post('/delete', async (req, res) => {
        try {
                const post = await posts.findOne({id : req.body.postID})

                const user = await User.findOne({id : post.userID})

                user.Posts = user.Posts.filter(post => {
                        if(post !== req.body.postID){
                                return post
                        }
                })

                User.findByIdAndUpdate(user.id,  {$set : user} , (err, result) => {
                        if(err) {
                                res.status(405).send("Cant Update User")
                        }
                        else{
                                res.status(200).send("Post Deleted ")
                        }
                })
        } 
        catch (error) {
                res.status(402).send("User not found")
        }
})

//Get a post

const getPost = async (postID) => {
        const post = await posts.findOne({id : postID})

        return post
}

router.post('/getPost', async (req, res) => {

        try {
                const post = await getPost(req.body.postID)

                res.status(200).send(post)
        } 
        catch (error) {
                res.status(402).send("User not found")
        }
})

//Like a post with


router.post('/likePost', async (req, res) => {
        try {
                const user = await User.findOne({username: req.body.username})
                const post = await posts.findOne({id: req.body.postId})
                console.log(post);

                var likes = false

                if(post.likeE.includes(user.id)) {
                        res.send("Already likes")
                        likes = true
                }
                !likes && post.likeE.push(user.id)

                !likes && posts.findByIdAndUpdate(post.id, {$set: post} , (err, posts) =>{
                        if(err) {
                                res.status(406).send("Cant Update Post")
                        }
                        else{
                                res.status(200).send("Post Liked ")
                        }
                })
        }
        catch(error) {
                console.log(error)
                res.status(405).send("Cant Update Post")
        }
})

module.exports = router