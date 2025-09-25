import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, folder = "viaticos") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer); // ✅ subimos el buffer directo
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log("✅ Imagen eliminada de Cloudinary:", publicId);
    }
  } catch (error) {
    console.error("❌ Error eliminando de Cloudinary:", error);
  }
};

export const uploadBase64ToCloudinary = (base64String, folder = "viaticos") => {
  return new Promise((resolve, reject) => {
    // Eliminar el prefijo data:image si existe
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    
    cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};