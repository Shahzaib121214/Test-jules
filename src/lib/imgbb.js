/**
 * Uploads an image to ImgBB and returns the direct image URL.
 * @param {File} file The image file to upload
 * @returns {Promise<string>} The uploaded image URL
 */
export const uploadImageToImgBB = async (file) => {
  if (!file) throw new Error("No file provided for upload.");

  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    console.error("VITE_IMGBB_API_KEY is missing. Using a fallback mockup URL for development.");
    // Return a dummy image or throw an error depending on strictness.
    // We throw to enforce real integration.
    throw new Error("ImgBB API key is missing in environment variables.");
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, WEBP, and GIF are supported.");
  }

  // Validate file size (e.g., max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImgBB upload failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Unknown ImgBB API error");
    }
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    throw error;
  }
};
