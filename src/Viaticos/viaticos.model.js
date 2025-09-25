import { Schema, model } from "mongoose";

const viaticosSchema = new Schema({
    NombreTecnico: {
        type: String,
        required: true,
        trim: true
    },
    Telefono: {
        type: Number,
        required: true
    },
    FechaEntrada: {
        type: Date,
        default: Date.now,
        required: true,
    },
    FechaSalida: {
        type: Date,
        default: Date.now,
        required: true,
    },
    Cliente: {
        type: String,
        required: true,
        trim: true
    },
    Movilizacion: {
        monto: {
            type: Number,
            required: true,    
            min: 0
        },
        tipo: {
            type: String,
            required: true,
            enum: ['Bus', 'VehiculoPersonal', 'Tuc-Tuc', 'Uber', 'Taxi']
        }
    },
    Hospedaje: {
        monto: {
            type: Number,
            required: true,
            min: 0
        },
        nombre: {
            type: String,
            required: true,
            trim: true 
        }
    },
    Comida: {
        monto: {
            type: Number,
            required: true,
            min: 0
        },
        tipo: {
            type: String,
            required: true,
            enum: ['Desayuno', 'Almuerzo', 'Cena']
        }
    },
    Ubicacion: {
        type: String,
        required: true,
        trim: true
    },
    Fotos: [{
        type: String, 
        required: false
    }],
    Firma: {
        type: String, // Guardaremos la firma como Data URL (base64)
        required: false
    },
    FotoURL: { 
        type: String,
        required: false,
        validate: {
            validator: function(url) {
                // Si está vacío, es válido
                if (!url || url.trim() === '') return true;
                
                // Si tiene valor, validar que sea una URL de imagen (permite query parameters)
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.+)?$/i.test(url);
            },
            message: 'URL de imagen inválida'
        }
    },
    MontoDado:{
        type: Number,
        required:true
    },
    Montogastado:{
        type: Number,
    }
}, {
    timestamps: true 
});

viaticosSchema.pre('save', function(next) {
    // Sumar todos los gastos: Movilización + Hospedaje + Comida
    this.Montogastado = (this.Movilizacion?.monto || 0) + 
                       (this.Hospedaje?.monto || 0) + 
                       (this.Comida?.monto || 0);
    next();
});

export default model('Viaticos', viaticosSchema);