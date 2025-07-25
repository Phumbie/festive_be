"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = authenticateJwt;
const jwt_1 = require("../utils/jwt");
function authenticateJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const payload = (0, jwt_1.verifyJwt)(token);
    if (!payload)
        return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = payload;
    next();
}
