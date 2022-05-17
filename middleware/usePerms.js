const User = require('../models/user')

//Checking if a user Role is allowed
const userPerms = (role) => {
    return async (req, res, next) => {
        let user = await User.findById({ _id: req.verify.id });
        if (user.role !== role) {
            return res.status(403).json({ success: false, error: 'Not Allowed' })
        }
        next()
    }
}
module.exports = userPerms