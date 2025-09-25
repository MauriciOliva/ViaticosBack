import User from './aut.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import jwt from 'jsonwebtoken'

// Función para crear usuario admin por defecto
export const createDefaultUser = async () => {
    try {
        const adminExists = await User.findOne({ username: process.env.USER })
        
        if (!adminExists) {
            const hashedPassword = await encrypt(process.env.PASSWORD)
            
            const adminUser = new User({
                username: process.env.USER,
                password: hashedPassword,
                role: 'admin'
            })
            
            await adminUser.save()
            console.log('✅ Usuario admin creado automáticamente')
        }
    } catch (error) {
        console.error('❌ Error creando usuario admin:', error)
    }
}

// Login simplificado
export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        // Validaciones básicas
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            })
        }

        // Buscar usuario
        const user = await User.findOne({ username })
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            })
        }

        // Verificar contraseña
        const isPasswordValid = await checkPassword(user.password, password)
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            })
        }

        // Generar token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
                role: user.role 
            },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )

        // Respuesta exitosa
        res.json({
            success: true,
            message: `Bienvenido ${username}`,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            token
        })

    } catch (error) {
        console.error('❌ Error en login:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

// Middleware de autenticación simplificado
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
        })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado'
            })
        }
        
        req.user = user
        next()
    })
}