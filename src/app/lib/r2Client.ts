// lib/r2Client.js
import { S3Client } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  region: process.env.CLOUDFLARE_R2_REGION,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export default r2Client;
