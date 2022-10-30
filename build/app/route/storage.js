"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StorageController_1 = __importDefault(require("../controllers/StorageController"));
const cloudinary_1 = __importDefault(require("..//..//infrastructure/cloudinary"));
const router = (0, express_1.Router)();
router.post("/upload", cloudinary_1.default.single("file"), StorageController_1.default.uploadSingleFile);
exports.default = router;
