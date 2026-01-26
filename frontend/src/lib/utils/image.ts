import imageCompression from "browser-image-compression";

export async function compressImage(file: File | Blob) {
  const options = {
    maxSizeMB: 1, // Max size 1MB
    maxWidthOrHeight: 1200, // Max dimensions 1200px
    useWebWorker: true,
    fileType: "image/webp", // Standardize to WebP
  };

  try {
    const compressedFile = await imageCompression(file as File, options);
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(
      `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
    );

    // Create a new file with .webp extension
    const fileName = (file as File).name
      ? (file as File).name.replace(/\.[^/.]+$/, "")
      : "image";

    return new File([compressedFile], `${fileName}.webp`, {
      type: "image/webp",
    });
  } catch (error) {
    console.error("Compression error:", error);
    return file as File; // Fallback to original
  }
}
