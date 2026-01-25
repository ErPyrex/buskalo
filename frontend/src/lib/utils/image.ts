import imageCompression from "browser-image-compression";

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,           // Max size 1MB
    maxWidthOrHeight: 1200, // Max dimensions 1200px
    useWebWorker: true,
    fileType: 'image/webp'  // Standardize to WebP
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Create a new file with .webp extension if it was converted
    return new File([compressedFile], compressedFile.name.replace(/\.[^/.]+$/, "") + ".webp", {
      type: 'image/webp',
    });
  } catch (error) {
    console.error("Compression error:", error);
    return file; // Fallback to original
  }
}
