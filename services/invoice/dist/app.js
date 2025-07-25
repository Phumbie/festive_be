"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const invoice_1 = __importDefault(require("./routes/invoice"));
const auth_1 = require("./middleware/auth");
console.log('CONTAINER BUILD TEST - INVOICE SERVICE');
const app = (0, express_1.default)();
app.use((0, express_2.json)());
app.use((0, express_2.urlencoded)({ extended: true }));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'invoice' });
});
app.use(auth_1.authenticateJwt); // Require JWT for all routes
app.use('/invoices', invoice_1.default);
exports.default = app;
