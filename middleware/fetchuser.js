const jwt = require('jsonwebtoken');

const JWT_SECRET = "SwapIsNice";

// get the user from jwt token and add id to req object
const fetchuser = (req, res, next) => {
    // Check if token there or not
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        // verifying token and appending id in req
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}

module.exports = fetchuser;