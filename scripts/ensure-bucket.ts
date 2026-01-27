
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

const BUCKET_NAME = "generated-docs";

async function ensureBucket() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
    console.error("SUPABASE_SERVICE_ROLE_KEY:", !!supabaseKey);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Checking bucket: ${BUCKET_NAME}...`);

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error("Error listing buckets:", error);
    process.exit(1);
  }

  const bucketExists = buckets.find((b) => b.name === BUCKET_NAME);

  if (bucketExists) {
    console.log(`Bucket '${BUCKET_NAME}' already exists.`);
  } else {
    console.log(`Bucket '${BUCKET_NAME}' not found. Creating...`);
    const { data, error: createError } = await supabase.storage.createBucket(
      BUCKET_NAME,
      {
        public: true, // Make it public as per typical requirement for these docs/images
        fileSizeLimit: 10485760, // 10MB
      }
    );

    if (createError) {
      console.error("Error creating bucket:", createError);
      process.exit(1);
    }
    console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
  }
}

ensureBucket();
