import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/app/lib/r2Client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name;

    const uploadParams = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    await r2Client.send(command);

    return NextResponse.json({ message: "Archivo subido exitosamente", fileName }, { status: 200 });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
