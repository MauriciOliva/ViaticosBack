import multer from 'multer';

export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Máximo 10MB permitido.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Demasiados archivos. Máximo 5 archivos permitidos.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Campo de archivo inesperado.'
            });
        }
    }
    
    // Si es otro tipo de error de Multer o error personalizado
    if (error.message.includes('Solo se permiten archivos')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // Pasa otros errores al siguiente middleware de errores
    next(error);
};

export default handleMulterError;