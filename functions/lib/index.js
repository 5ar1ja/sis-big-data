"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = void 0;
const storage_1 = require("firebase-functions/v2/storage");
const admin = __importStar(require("firebase-admin"));
const gemini_service_1 = require("./services/gemini.service");
admin.initializeApp();
exports.processImage = (0, storage_1.onObjectFinalized)({ region: "us-east1" }, async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    // Only process images
    if (!contentType || !contentType.startsWith("image/")) {
        console.log(`File ${filePath} is not an image. Skipping.`);
        return;
    }
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    try {
        // Set status to processing
        const docRef = admin.firestore().collection("analysisResults").doc(filePath.replace(/\//g, "_"));
        await docRef.set({
            filePath,
            status: "processing",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Download file to memory
        console.log(`Downloading ${filePath}...`);
        const [buffer] = await file.download();
        // Analyze with Gemini
        console.log(`Analyzing ${filePath} with Gemini...`);
        const resultText = await (0, gemini_service_1.analyzeImage)(contentType, buffer);
        // Save result to Firestore
        console.log(`Saving results for ${filePath}...`);
        await docRef.update({
            status: "completed",
            result: resultText,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Processing complete for ${filePath}.`);
    }
    catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        // Update status to error
        const docRef = admin.firestore().collection("analysisResults").doc(filePath.replace(/\//g, "_"));
        await docRef.update({
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }).catch(console.error);
    }
});
//# sourceMappingURL=index.js.map