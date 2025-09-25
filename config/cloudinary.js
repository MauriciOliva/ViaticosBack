import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

// ✅ VALIDAR QUE LAS VARIABLES EXISTAN
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Cloudinary configuration missing');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export default cloudinary;