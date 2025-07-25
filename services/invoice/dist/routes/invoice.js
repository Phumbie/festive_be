"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_1 = require("../controllers/invoiceController");
const router = (0, express_1.Router)();
router.post('/', invoiceController_1.createInvoice);
router.get('/', invoiceController_1.listInvoices);
router.get('/:id', invoiceController_1.getInvoice);
router.put('/:id', invoiceController_1.updateInvoice);
router.delete('/:id', invoiceController_1.deleteInvoice);
// Invoice item endpoints
router.post('/:id/items', invoiceController_1.addInvoiceItem);
router.put('/:id/items/:itemId', invoiceController_1.updateInvoiceItem);
router.delete('/:id/items/:itemId', invoiceController_1.deleteInvoiceItem);
exports.default = router;
