const User = require('../models/user')
const fetchUser = async(req, res, next)=>{
   req.user = await User.findById({_id: req.verify.id})
   next()
}

module.exports = fetchUser
