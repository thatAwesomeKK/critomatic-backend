const User = require("../models/user");
const fetchUser = async (req, res, next) => {
  try {
    req.user = await User.findById({ _id: req.verify.id });
  } catch (error) {
    return res.status(400).json({ success: false, error: "No User" });
  }
  next();
};

module.exports = fetchUser;
