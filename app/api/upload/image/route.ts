import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const listingId = formData.get('listingId') as string;
    const isPrimary = formData.get('isPrimary') === 'true';
    const rightsConfirmed = formData.get('rightsConfirmed') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!rightsConfirmed) {
      return NextResponse.json(
        { error: 'You must confirm you have rights to use this image' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // ⚠️ P1 TECHNICAL DEBT: Data URL Storage
    // Current: Storing images as base64 data URLs (embeds in response)
    // Problem: Response size bloat, scalability cliff for multiple images
    // TODO: Migrate to Google Cloud Storage
    //   1. Set up GCS bucket with proper CORS and public-read ACL
    //   2. Implement uploadToGCS() function (see lib/storage.ts template)
    //   3. Generate signed/public URLs instead of data URLs
    //   4. Update database schema to store GCS URLs
    //   5. Add image optimization (resize, compress, WebP conversion)
    // Temporary solution until GCS migration:
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    const url = dataUrl;

    return NextResponse.json({
      success: true,
      url,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
