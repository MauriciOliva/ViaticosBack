'use strict'

import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import path from "path"
import ViaticosRouter from "../src/Viaticos/viaticos.routes.js"
import AuthRouter from "../src/auth/auth.routes.js"
import { limiter } from "../middleware/rate.limit.js"
import { createDefaultUser } from "../src/auth/auth.controller.js"

const config = (app) => {
    // Configurar CORS para producción
    const corsOptions = {
        origin: [
            'https://vlaticos-front.vercel.app',
            'https://viaticos-front.vercel.app', 
            'http://localhost:5173'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        optionsSuccessStatus: 200
    }

    app.use(cors(corsOptions));
    
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }))
    app.use(morgan('dev'))
    
    // Servir archivos estáticos
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
        setHeaders: (res, path) => {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
        }
    }));
    app.use(limiter)
}

const routes = (app) =>{
    app.use('/api/v1/viaticos', ViaticosRouter)
    app.use('/api/v1/auth', AuthRouter)
}

export const initServer =async ()=>{
    const app = express()
    try {
        config(app)
        routes(app)
        await createDefaultUser()
        app.listen(process.env.PORT)
        console.log(`Servidor iniciado en el puerto ${process.env.PORT}`)
    } catch (error) {
        console.log('Server init failed', error)
    }
}