const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // check valid credentials
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({
            error: "invalid username or password"
        });
    }

    // create token
    const userObj = {
        username: username,
        id: user._id,
    };
    const token = jwt.sign(
        userObj,
        process.env.SECRET,
        { expiresIn: 60*60*24*7 }, // a week because why not
    );

    res.json({ token, username });
});

module.exports = loginRouter;
