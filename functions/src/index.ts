import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import { analyzeImage } from "./services/gemini.service";

admin.initializeApp();

export const processImage = onObjectFinalized(
  { region: "us-east1" },
  async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const contentType = event.data.contentType;

    if (!filePath) {
      console.log("Event has no file path. Skipping.");
      return;
    }

    if (!contentType || !contentType.startsWith("image/")) {
      console.log(`File ${filePath} is not an image. Skipping.`);
      return;
    }

    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const docRef = admin.firestore().collection("analysisResults").doc(filePath.replace(/\//g, "_"));

    try {
      await docRef.set({
        filePath,
        status: "processing",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Downloading ${filePath}...`);
      const [buffer] = await file.download();

      console.log(`Analyzing ${filePath} with Gemini...`);
      const resultText = await analyzeImage(contentType, buffer);

      console.log(`Saving results for ${filePath}...`);
      await docRef.update({
        status: "completed",
        result: resultText,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Processing complete for ${filePath}.`);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      // set() with merge so this works even if the initial set() above failed
      await docRef.set({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true }).catch(console.error);
    }
  }
);
