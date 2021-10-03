const router = require('express').Router()
const { raw } = require('express')
const User = require('../models/User')
const bcrypt  = require('bcrypt')

router.post('/login', async (req, res) => {
        try{
                const user = await User.findOne({username: req.body.username})

                !user && res.status(404).json("User not found")

                if(user){

                        const valid = await bcrypt.compare(req.body.password, user.password)

                        !valid && res.status(404).json("Password mismatch")

                        valid && res.status(202).json({"username":user.username, "email":user.email})
                }

                
        } catch(err){
                res.status(504).send(err)
        }

        

})

module.exports = router