import { put } from '@vercel/blob';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No se ha proporcionado ningún archivo.' }, { status: 400 });
    }

    // Fallback for development/testing if BLOB_READ_WRITE_TOKEN is not set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al subir la imagen.';
    console.error('Vercel Blob upload error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
