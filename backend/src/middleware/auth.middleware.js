const jwt = require('jsonwebtoken')
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : header;

    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token is required.'
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decode.userId).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'User is not authorized.' });
        }
        req.userId = user._id;
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        })
    }
}

module.exports = authMiddleware;
