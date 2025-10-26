import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const ik = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await ik.upload({ file: buffer, fileName: file.name });
  return NextResponse.json({ url: result.url });
}
