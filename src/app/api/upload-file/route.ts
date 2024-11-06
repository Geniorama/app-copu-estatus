import { NextRequest, NextResponse } from "next/server";
import r2Client from "@/app/lib/r2Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }
        const fileKey = `uploads/${file.name}`;

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        await r2Client.send(new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: file.type,
        }));

        const fileUrl = `${process.env.CLOUDFLARE_BUCKET_URL}/${fileKey}`;

        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        return NextResponse.json({ error: "La subida de archivo falló" }, { status: 500 });
    }
}
