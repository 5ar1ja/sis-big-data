import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import { analyzeImage } from "./services/gemini.service";

admin.initializeApp();

export const processImage = onObjectFinalized(
  { region: "us-central1" },
  async (event) => {
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
      const resultText = await analyzeImage(contentType, buffer);

      // Save result to Firestore
      console.log(`Saving results for ${filePath}...`);
      await docRef.update({
        status: "completed",
        result: resultText,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Processing complete for ${filePath}.`);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      
      // Update status to error
      const docRef = admin.firestore().collection("analysisResults").doc(filePath.replace(/\//g, "_"));
      await docRef.update({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }).catch(console.error);
    }
  }
);
