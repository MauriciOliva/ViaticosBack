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
    // ✅ NUEVO: Movilización como array para múltiples medios
    Movilizacion: [{
        tipo: {
            type: String,
            required: true,
            enum: ['Bus', 'VehiculoPersonal', 'Tuc-Tuc', 'Uber', 'Taxi', 'Mototaxi', 'Bicicleta', 'Caminata', 'Otro']
        },
        montoIda: {
            type: Number,
            required: true,
            min: 0
        },
        montoVuelta: {
            type: Number,
            required: true,
            min: 0
        },
        descripcion: {
            type: String,
            trim: true
        }
    }],
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
        type: String,
        required: false
    },
    FotoURL: { 
        type: String,
        required: false,
        validate: {
            validator: function(url) {
                if (!url || url.trim() === '') return true;
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

// ✅ NUEVO: Calcular el total de movilización sumando todos los medios
viaticosSchema.pre('save', function(next) {
    // Calcular total de movilización (suma de ida y vuelta de todos los medios)
    const totalMovilizacion = this.Movilizacion.reduce((total, mov) => {
        return total + (mov.montoIda || 0) + (mov.montoVuelta || 0);
    }, 0);
    
    // Sumar todos los gastos
    this.Montogastado = totalMovilizacion + 
                       (this.Hospedaje?.monto || 0) + 
                       (this.Comida?.monto || 0);
    next();
});

export default model('Viaticos', viaticosSchema);