const router = require('express').Router()
const { raw } = require('express')
const User = require('../models/User')
const bcrypt  = require('bcrypt')

router.get('/', (req, res) => {
        res.send("User route")
})


//Authenticate

const authenticate = async (username, password) =>{
        console.log(username, password);

        const user = await User.findOne({username: username})

        // console.log(user)

        const valid = await bcrypt.compare(password, user.password)
        
        console.log(valid)

        if(valid){
                return true
        }
        else{
                return false
        }
}

//Register A user

router.post('/register', async (req, res) => {

        try{
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password, salt)
                const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                })

                const savedUser = await newUser.save()

                res.send(savedUser.username)
        }
        catch(err){
                console.log(err);
                res.status(404).send("User registration Failure")
        }
})

//Update user 

router.post('/update', async(req, res) => {

        if(await authenticate(req.body.auth.username, req.body.auth.password)) {
                const user = await User.findOne({username: req.body.auth.username})
                
                if(user){
                        for(i in req.body) {
                                if(user[i] !== undefined){
                                        console.log(i);
                                        user[i] = req.body[i]
                                }
                        }

                        User.findByIdAndUpdate(user.id, {$set : user}, (err,user) => {
                                if(err){
                                        res.status(405).send("Cant Update User")
                                }
                                else{
                                        res.status(200).json(user)
                                }
                        })
                }else{
                        res.status(504).json("Internal Server Error")
                }
        }
        else{
                res.status(403).send("Authentication failed")
        }

})

//Delete user

router.post('/delete', async (req, res) =>{
        if(await authenticate(req.body.auth.username, req.body.auth.password)) {
                User.findOneAndDelete({username: req.body.auth.username}, (err, user) => {
                        if(err) {
                                res.send("deletion failed: ")
                        }
                        else{
                                res.send("Deleted Successfully")
                        }
                })
        }
        else {
                res.status(403).send("Authentication failed")
        }
});

//Get User

router.post('/getAUser', async (req, res) =>{
        if(await authenticate(req.body.auth.username, req.body.auth.password)) {
                const user = await User.findOne({username: req.body.auth.username})
                const sent = {}
                for(var key in user) {
                        if(key !== "password") {
                                sent[key] = user[key]
                        }
                }
                res.status(200).json(sent)
        }
        else {
                res.status(403).send("Authentication failed")
        }
});


//Follow a user


router.get('/follow' , async (req, res) => {
        const user = await User.findOne({username : req.body.username})

        if(user) {
                const follow = await User.findOne({username : req.body.follows})
                if(follow === undefined) {
                        res.send("Account Does not exist")
                }
                else if(user.follows.includes(follow.id)){
                        res.send("Already Follows")
                }else{
                        user.follows.push(follow.id)
                        follow.followers.push(user.id)
                        try{
                                await User.findByIdAndUpdate(user.id, {$set : user})

                                await User.findByIdAndUpdate(follow.id, {$set : follow})

                                res.status(200).send("Follows")
                        }catch(e){
                                res.status(504).send("Error: ")
                        }

                }
        }else{
                res.status(504).send("User not found")
        }
})

//Unfollow a user


router.get('/unfollow' , async (req, res) => {
        try{
                const user = await User.findOne({username : req.body.username})

                if(user) {
                        const follow = await User.findOne({username : req.body.follows})
                        if(follow === undefined) {
                                res.send("Account Does not exist")
                        }
                        else{
                                var newfollow = user.follows.filter(id => {
                                        if(id !== follow.id){
                                                return id
                                        }
                                })

                                user.follows = newfollow
                                
                                var newfollowers = follow.followers.filter(id => {
                                        if(id !== user.id){
                                                return id
                                        }
                                })

                                follow.followers = newfollowers


                                try{
                                        await User.findByIdAndUpdate(user.id, {$set : user})

                                        await User.findByIdAndUpdate(follow.id, {$set : follow})

                                        res.status(200).send("Unfollows")
                                }catch(e){
                                        res.status(504).send("Error: ")
                                }

                        }
                }else{
                        res.status(504).send("User not found")
                }
        }
        catch(e){
                res.status(504).send("Cant Perform operation")
        }
})


module.exports = router