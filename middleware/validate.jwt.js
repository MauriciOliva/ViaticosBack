'use strict'
import jwt from 'jsonwebtoken'

export const validateJwt = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        })
    }
}