import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Convert the file arrayBuffer into a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream inside a Promise
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'isha_uploads', // Uploaded files will be organized in this folder
          resource_type: 'auto', // Auto-detect format (image, video, raw, etc.)
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Cloudinary API upload route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image to Cloudinary.' },
      { status: 500 }
    );
  }
}
