import multer from "multer";

const MIMETYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

const multerConfig = () => {
  return multer({
    storage: multer.memoryStorage(), // ✅ todo en memoria
    fileFilter: (req, file, cb) => {
      if (MIMETYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(`Solo se permiten archivos: ${MIMETYPES.join(", ")}`),
          false
        );
      }
    },
    limits: {
      fileSize: MAX_SIZE,
      files: MAX_FILES,
    },
  });
};

export const uploadViaticosPictures = multerConfig();
