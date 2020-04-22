const jwt = require('jsonwebtoken');

const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if(req.cookies.token) {
    //     token = req.cookies.token;
    // }

    //Make sure token exists
    if(!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }

    try{
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('call', decoded);
        req.user = await User.findById(decoded.id);

        next();
    } catch (e) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }
});

// Grant Access To Specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                ));
        }
        next();
    }
}