
import dotenv from "dotenv";
import { listOldFiles, deleteFile } from "../lib/upload";

// Load environment variables
dotenv.config({ path: ".env" });

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

async function cleanup() {
  console.log("Starting storage cleanup...");

  // List files in 'temp' folder older than 6 hours
  const oldFiles = await listOldFiles("temp", SIX_HOURS_MS);

  if (oldFiles.length === 0) {
    console.log("No old temporary files found.");
    return;
  }

  console.log(`Found ${oldFiles.length} old files to delete.`);

  for (const file of oldFiles) {
    console.log(`Deleting: ${file}`);
    await deleteFile(file);
  }

  console.log("Cleanup complete.");
}

cleanup().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
