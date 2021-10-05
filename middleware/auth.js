const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res
        .status(401)
        .json({success: false, message: "Acces token not found"});
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        console.log(error);
        return res
        .status(404)
        .json({success: false, message: "Acces token not valid"});
    }
}

module.exports = verifyToken;