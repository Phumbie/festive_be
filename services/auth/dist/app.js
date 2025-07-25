"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const role_1 = __importDefault(require("./routes/role"));
const userManagement_1 = __importDefault(require("./routes/userManagement"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./passport/google");
const app = (0, express_1.default)();
app.use((0, express_2.json)());
app.use((0, express_2.urlencoded)({ extended: true }));
app.use((0, express_session_1.default)({ secret: process.env.JWT_SECRET || 'supersecret', resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/auth', auth_1.default);
app.use('/auth', role_1.default);
app.use('/auth', userManagement_1.default);
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
    // On success, issue JWT and redirect or respond
    // @ts-ignore
    const user = req.user;
    // You may want to redirect to frontend with token as query param
    res.json({ message: 'Google SSO successful', user });
});
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'auth' });
});
exports.default = app;
